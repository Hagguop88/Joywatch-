#!/usr/bin/env python3
"""
MovieBox Web - Netflix Edition with Native MovieBox API Integration & Browser Stream Proxy
Provides high-speed catalog, direct MovieBox streams, browser streaming proxy (Range requests), and VLC integration.
"""

import http.server
import socketserver
import subprocess
import urllib.request
import urllib.parse
import json
import os
import sys
import time
import shutil
import hashlib
import hmac
import base64
from concurrent.futures import ThreadPoolExecutor

PORT = 7680
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")
APPDATA = os.environ.get("APPDATA", "")
HISTORY_FILE = os.path.join(APPDATA, "moviebox-tui", "history.json")

# Find VLC executable
VLC_CANDIDATES = [
    shutil.which("vlc"),
    r"C:\Program Files\VideoLAN\VLC\vlc.exe",
    r"C:\Program Files (x86)\VideoLAN\VLC\vlc.exe",
]
VLC_BIN = next((p for p in VLC_CANDIDATES if p and os.path.isfile(p)), None)

# In-memory caches
CACHE = {}
CACHE_TTL = 300  # 5 minutes

# ==========================================
# MovieBox API Client (Native Signature Engine)
# ==========================================
DEFAULT_SECRET_BYTES = b"\xef\xa8\x91\x97\x4e\xec\xd3\x14\x8d\xf6\x3a\xa6\x11\x60\x2d\xef\xd1\x01\x25\x9b\xa5\x21\x02\x2c\x57\xae\x05\x66\xbd\x8e"

class MovieBoxApiClient:
    def __init__(self):
        self.hosts = [
            "https://api6.aoneroom.com",
            "https://api5.aoneroom.com",
            "https://api4.aoneroom.com",
            "https://api4sg.aoneroom.com",
            "https://api3.aoneroom.com",
            "https://api.inmoviebox.com",
        ]
        self.active_host_idx = 0
        self.token = None
        self.token_expiry = 0
        self.ua = "com.community.oneroom/50020120 (Linux; U; Android 12; Redmi; Build/S1B.220414.015; Cronet/135.0.7012.3)"
        self.client_info = json.dumps({
            "package_name": "com.community.oneroom",
            "version_name": "4.0.01.0813.03",
            "version_code": 50020120,
            "os": "android",
            "os_version": "12",
            "install_ch": "ps",
            "device_id": "0123456789abcdef0123456789abcdef",
            "install_store": "ps",
            "gaid": "00000000-0000-0000-0000-000000000000",
            "brand": "Redmi",
            "model": "Redmi",
            "system_language": "en",
            "net": "NETWORK_WIFI",
            "region": "US",
            "timezone": "Asia/Kolkata",
            "sp_code": "40401",
            "X-Play-Mode": "2"
        }, separators=(',', ':'))

    @staticmethod
    def md5_hex(data: bytes) -> str:
        return hashlib.md5(data).hexdigest()

    @staticmethod
    def generate_x_client_token(ts: int) -> str:
        rev = str(ts)[::-1]
        return f"{ts},{MovieBoxApiClient.md5_hex(rev.encode('utf-8'))}"

    @staticmethod
    def generate_signature(method: str, url: str, body: str, ts: int) -> str:
        p = urllib.parse.urlparse(url)
        q_pairs = sorted(urllib.parse.parse_qsl(p.query))
        canonical_url = p.path + ("?" + urllib.parse.urlencode(q_pairs) if q_pairs else "")
        body_bytes = body.encode("utf-8") if body is not None else b""
        body_hash = MovieBoxApiClient.md5_hex(body_bytes[:102400]) if body_bytes else ""
        body_len = str(len(body_bytes)) if body_bytes else ""
        canonical = f"{method.upper()}\napplication/json\napplication/json\n{body_len}\n{ts}\n{body_hash}\n{canonical_url}"
        mac = hmac.new(DEFAULT_SECRET_BYTES, canonical.encode("utf-8"), hashlib.md5)
        sig_b64 = base64.b64encode(mac.digest()).decode("utf-8")
        return f"{ts}|2|{sig_b64}"

    def ensure_token(self):
        now = time.time()
        if self.token and now < self.token_expiry - 60:
            return self.token

        login_url_path = "/wefeed-mobile-bff/user-api/visitor-login"
        resp = self.request("POST", login_url_path, "{}")
        if resp and resp.get("data", {}).get("token"):
            self.token = resp["data"]["token"]
            self.token_expiry = now + (7 * 24 * 3600)
            return self.token
        return None

    def request(self, method: str, path: str, body_str: str = None, retries: int = 3):
        data = body_str.encode("utf-8") if body_str else None
        num_hosts = len(self.hosts)

        for attempt in range(num_hosts):
            host_idx = (self.active_host_idx + attempt) % num_hosts
            base_url = self.hosts[host_idx]
            url = f"{base_url}{path}"
            ts = int(time.time() * 1000)
            sig = self.generate_signature(method, url, body_str, ts)

            headers = {
                "User-Agent": self.ua,
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Connection": "keep-alive",
                "x-client-token": self.generate_x_client_token(ts),
                "x-tr-signature": sig,
                "x-client-info": self.client_info,
                "x-client-status": "0",
                "x-forwarded-for": "185.220.101.5",
            }
            if self.token and not path.endswith("visitor-login"):
                headers["Authorization"] = f"Bearer {self.token}"

            req = urllib.request.Request(url, data=data, headers=headers, method=method)
            try:
                with urllib.request.urlopen(req, timeout=6) as resp:
                    raw = resp.read().decode("utf-8")
                    val = json.loads(raw)
                    self.active_host_idx = host_idx
                    return val
            except urllib.error.HTTPError as e:
                # 406 means find no content or try next host
                if e.code in (401, 403):
                    self.token = None
                continue
            except Exception:
                continue

        return None

    def search_moviebox(self, query: str):
        self.ensure_token()
        payload = json.dumps({
            "keyword": query,
            "page": 1,
            "perPage": 15,
            "subjectType": 0
        }, separators=(',', ':'))
        resp = self.request("POST", "/wefeed-mobile-bff/subject-api/search/v2", payload)
        if resp and resp.get("data", {}).get("list"):
            return resp["data"]["list"]
        return []

    def get_play_info(self, subject_id: str, season: int = 0, episode: int = 0):
        self.ensure_token()
        path = f"/wefeed-mobile-bff/subject-api/play-info/v2?subjectId={subject_id}"
        if season > 0 or episode > 0:
            path += f"&se={season}&ep={episode}"
        return self.request("GET", path)

    def get_resources(self, subject_id: str, season: int = 0, episode: int = 0):
        self.ensure_token()
        path = f"/wefeed-mobile-bff/subject-api/resource?subjectId={subject_id}&page=1&perPage=20"
        if season > 0 or episode > 0:
            path += f"&se={season}&ep={episode}"
        return self.request("GET", path)

mb_client = MovieBoxApiClient()

def fetch_json(url, timeout=5):
    now = time.time()
    if url in CACHE:
        cached_time, cached_data = CACHE[url]
        if now - cached_time < CACHE_TTL:
            return cached_data

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json",
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            CACHE[url] = (now, data)
            return data
    except Exception:
        return None

# =========================================================================
# TMDb API Engine & Streaming Watch Providers (Netflix, Prime, Disney+, etc.)
# =========================================================================
TMDB_API_KEY = "b4a5cc243be17db99639ea6bbd462ed6"
TMDB_BASE_URL = "https://api.tmdb.org/3"

TMDB_GENRES = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
    27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
    10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality',
    10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics'
}

TMDB_OTT_PROVIDERS = {
    "netflix": {"providers": "8|1796", "name": "Netflix"},
    "prime": {"providers": "9|119|2100", "name": "Prime Video"},
    "disney": {"providers": "337", "name": "Disney+"},
    "crunchyroll": {"providers": "283|1968", "name": "Crunchyroll"},
    "paramount": {"providers": "531|582|2303|2616", "name": "Paramount+"},
}

def resolve_tmdb_imdb_id(tmdb_id, media_type="movie"):
    """Resolves canonical IMDb ID (tt...) for a TMDb ID using external_ids."""
    clean_id = str(tmdb_id).replace("tmdb:", "").strip()
    if not clean_id or not clean_id.isdigit():
        return None

    endpoint = "tv" if media_type in ("series", "tv") else "movie"
    cache_key = f"tmdb_imdb:{endpoint}:{clean_id}"
    now = time.time()
    if cache_key in CACHE:
        ts, val = CACHE[cache_key]
        if now - ts < 86400:  # 24h cache for external IDs
            return val

    try:
        url = f"{TMDB_BASE_URL}/{endpoint}/{clean_id}/external_ids?api_key={TMDB_API_KEY}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            imdb = data.get("imdb_id")
            if imdb and imdb.startswith("tt"):
                CACHE[cache_key] = (now, imdb)
                return imdb
    except Exception:
        pass
    return None

def fetch_tmdb_ott_catalog(platform="all", media_type="all", limit=24):
    """Fetches and arranges movies and TV shows accurately as per OTT platforms using TMDb."""
    cache_key = f"tmdb_ott:{platform}:{media_type}:{limit}"
    now = time.time()
    if cache_key in CACHE:
        ts, data = CACHE[cache_key]
        if now - ts < 900:  # 15 minutes TTL
            return data

    selected_platforms = (
        ["netflix", "prime", "disney", "crunchyroll", "paramount"]
        if platform == "all"
        else [platform.lower()]
    )

    fetch_jobs = []
    headers = {"User-Agent": "Mozilla/5.0"}

    for p in selected_platforms:
        p_info = TMDB_OTT_PROVIDERS.get(p)
        if not p_info:
            continue
        p_ids = p_info["providers"]
        p_name = p_info["name"]

        if media_type in ("movie", "all"):
            url_movie = (
                f"{TMDB_BASE_URL}/discover/movie?api_key={TMDB_API_KEY}"
                f"&watch_region=US&with_watch_providers={p_ids}"
                f"&sort_by=popularity.desc&vote_count.gte=25"
            )
            fetch_jobs.append((p, p_name, "movie", url_movie))

        if media_type in ("series", "tv", "all"):
            url_tv = (
                f"{TMDB_BASE_URL}/discover/tv?api_key={TMDB_API_KEY}"
                f"&watch_region=US&with_watch_providers={p_ids}"
                f"&sort_by=popularity.desc&vote_count.gte=25"
            )
            fetch_jobs.append((p, p_name, "tv", url_tv))

    def fetch_single_job(job):
        p_key, p_name, m_type, url = job
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=4) as resp:
                d = json.loads(resp.read().decode("utf-8"))
                return (p_key, p_name, m_type, d.get("results", []))
        except Exception:
            return (p_key, p_name, m_type, [])

    with ThreadPoolExecutor(max_workers=max(1, len(fetch_jobs))) as ex:
        job_outputs = list(ex.map(fetch_single_job, fetch_jobs))

    all_raw_items = []
    seen_ids = set()
    for p_key, p_name, m_type, results in job_outputs:
        for r in results:
            tid = r.get("id")
            if not tid or tid in seen_ids:
                continue
            seen_ids.add(tid)
            all_raw_items.append((p_key, p_name, m_type, r))

    # Sort combined titles by popularity descending
    all_raw_items.sort(key=lambda x: x[3].get("popularity", 0), reverse=True)
    all_raw_items = all_raw_items[:limit]

    processed = []
    for p_key, p_name, m_type, r in all_raw_items:
        tmdb_id = r.get("id")
        title = r.get("title") or r.get("name")
        year_str = (r.get("release_date") or r.get("first_air_date") or "2024")[:4]
        rating_val = r.get("vote_average", 8.0)
        formatted_rating = f"{rating_val:.1f}" if rating_val else "8.0"

        poster_path = r.get("poster_path")
        backdrop_path = r.get("backdrop_path") or poster_path
        poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else ""
        backdrop_url = f"https://image.tmdb.org/t/p/w1280{backdrop_path}" if backdrop_path else poster_url

        genre_names = [TMDB_GENRES[gid] for gid in r.get("genre_ids", []) if gid in TMDB_GENRES]
        if not genre_names:
            genre_names = [p_name]

        processed.append({
            "id": f"tmdb:{tmdb_id}",
            "tmdb_id": tmdb_id,
            "name": title,
            "type": "series" if m_type == "tv" else "movie",
            "year": year_str,
            "imdbRating": formatted_rating,
            "poster": poster_url,
            "background": backdrop_url,
            "description": r.get("overview", ""),
            "genres": genre_names,
            "platform": p_key,
            "platform_name": p_name,
        })

    def attach_imdb(item):
        resolved_imdb = resolve_tmdb_imdb_id(item["tmdb_id"], item["type"])
        if resolved_imdb:
            item["id"] = resolved_imdb
        return item

    with ThreadPoolExecutor(max_workers=max(1, min(12, len(processed)))) as ex:
        final_items = list(ex.map(attach_imdb, processed))

    CACHE[cache_key] = (now, final_items)
    return final_items

class JoywatchHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # -------------------------------------------------------------
        # 1. Video Stream Proxy (Supports HTTP Range for Browser Player)
        # -------------------------------------------------------------
        if path == "/api/stream-proxy":
            stream_url = query.get("url", [""])[0]
            if not stream_url:
                self.send_error(400, "Missing url parameter")
                return

            self.handle_stream_proxy(stream_url)
            return

        # -------------------------------------------------------------
        # 2. System & Player Status
        # -------------------------------------------------------------
        if path == "/api/status":
            self.send_json({
                "status": "online",
                "vlc_installed": bool(VLC_BIN and os.path.isfile(VLC_BIN)),
                "vlc_path": VLC_BIN,
                "port": PORT,
                "moviebox_api": "active",
            })
            return

        # -------------------------------------------------------------
        # 3. Catalog (Curated Netflix Categories)
        # -------------------------------------------------------------
        if path == "/api/catalog":
            media_type = query.get("type", ["movie"])[0]
            genre = query.get("genre", [None])[0]

            if genre:
                encoded_genre = urllib.parse.quote(genre)
                url = f"https://v3-cinemeta.strem.io/catalog/{media_type}/top/genre={encoded_genre}.json"
            else:
                url = f"https://v3-cinemeta.strem.io/catalog/{media_type}/top.json"

            data = fetch_json(url) or {"metas": []}
            metas = data.get("metas", [])
            cleaned = []
            for item in metas[:30]:
                cleaned.append({
                    "id": item.get("id"),
                    "name": item.get("name"),
                    "type": item.get("type"),
                    "year": str(item.get("year", item.get("releaseInfo", ""))),
                    "poster": item.get("poster"),
                    "background": item.get("background") or item.get("poster"),
                    "description": item.get("description", ""),
                    "genres": item.get("genres", []),
                    "imdbRating": item.get("imdbRating", "8.5"),
                })
            self.send_json({"items": cleaned})
            return

        # -------------------------------------------------------------
        # 3b. OTT Platform Catalog (TMDb Watch Providers)
        # -------------------------------------------------------------
        if path == "/api/ott-catalog":
            platform = query.get("platform", ["all"])[0].lower()
            media_type = query.get("type", ["all"])[0].lower()
            limit_param = query.get("limit", ["24"])[0]
            limit = int(limit_param) if limit_param.isdigit() else 24
            items = fetch_tmdb_ott_catalog(platform=platform, media_type=media_type, limit=limit)
            self.send_json({"items": items})
            return

        # -------------------------------------------------------------
        # 4. Item Details & Seasons/Episodes
        # -------------------------------------------------------------
        if path == "/api/meta":
            media_type = query.get("type", ["movie"])[0]
            imdb_id = query.get("id", [""])[0]
            if not imdb_id:
                self.send_error(400, "Missing id parameter")
                return

            if imdb_id.startswith("tmdb:") or imdb_id.isdigit():
                clean_tid = imdb_id.replace("tmdb:", "").strip()
                resolved_imdb = resolve_tmdb_imdb_id(clean_tid, media_type)
                if resolved_imdb:
                    imdb_id = resolved_imdb

            url = f"https://v3-cinemeta.strem.io/meta/{media_type}/{imdb_id}.json"
            data = fetch_json(url) or {}
            meta = data.get("meta", {})
            self.send_json({"meta": meta})
            return

        # -------------------------------------------------------------
        # 5. Search (Cross-Catalog & MovieBox Search)
        # -------------------------------------------------------------
        if path == "/api/search":
            q = query.get("q", [""])[0].strip()
            if not q:
                self.send_json({"items": []})
                return

            encoded_q = urllib.parse.quote(q)
            movie_url = f"https://v3-cinemeta.strem.io/catalog/movie/top/search={encoded_q}.json"
            series_url = f"https://v3-cinemeta.strem.io/catalog/series/top/search={encoded_q}.json"

            movie_data = fetch_json(movie_url) or {"metas": []}
            series_data = fetch_json(series_url) or {"metas": []}

            results = []
            for item in (movie_data.get("metas", []) + series_data.get("metas", [])):
                if not any(r["id"] == item.get("id") for r in results):
                    results.append({
                        "id": item.get("id"),
                        "name": item.get("name"),
                        "type": item.get("type"),
                        "year": str(item.get("year", item.get("releaseInfo", ""))),
                        "poster": item.get("poster"),
                        "background": item.get("background") or item.get("poster"),
                        "description": item.get("description", ""),
                        "genres": item.get("genres", []),
                        "imdbRating": item.get("imdbRating", "8.0"),
                    })

            # Also query MovieBox API for search matches
            try:
                mb_items = mb_client.search_moviebox(q)
                for mb_item in mb_items:
                    sid = str(mb_item.get("subjectId") or mb_item.get("id"))
                    title = mb_item.get("title") or mb_item.get("name")
                    if sid and title and not any(r.get("name", "").lower() == title.lower() for r in results):
                        results.append({
                            "id": sid,
                            "name": title,
                            "type": "series" if mb_item.get("stype") == 2 else "movie",
                            "year": str(mb_item.get("releaseYear") or mb_item.get("releaseDate") or "2024"),
                            "poster": mb_item.get("cover", {}).get("url") or mb_item.get("cover_url"),
                            "background": mb_item.get("cover", {}).get("url"),
                            "description": mb_item.get("intro", ""),
                            "genres": ["MovieBox Stream"],
                            "imdbRating": "8.8",
                            "is_moviebox_id": True,
                        })
            except Exception as e:
                print(f"[Warn] MovieBox search query error: {e}")

            self.send_json({"items": results[:40]})
            return

        # -------------------------------------------------------------
        # 6. Stream Resolver (Real Web Streams + Torrentio Peer Streams)
        # -------------------------------------------------------------
        if path == "/api/streams":
            media_type = query.get("type", ["movie"])[0]
            item_id = query.get("id", [""])[0]
            title = query.get("title", [""])[0]
            season = query.get("season", [None])[0]
            episode = query.get("episode", [None])[0]

            s_num = int(season) if season and season.isdigit() else 1
            e_num = int(episode) if episode and episode.isdigit() else 1

            # Resolve IMDb ID if item_id is not already an IMDb ID
            imdb_id = None
            if item_id and item_id.startswith("tt"):
                imdb_id = item_id
            elif item_id and (item_id.startswith("tmdb:") or item_id.isdigit()):
                clean_tid = item_id.replace("tmdb:", "").strip()
                resolved_imdb = resolve_tmdb_imdb_id(clean_tid, media_type)
                if resolved_imdb:
                    imdb_id = resolved_imdb
            if not imdb_id and title:
                try:
                    search_url = f"https://v3-cinemeta.strem.io/catalog/{media_type}/top/search={urllib.parse.quote(title)}.json"
                    c_data = fetch_json(search_url, timeout=3)
                    if c_data and c_data.get("metas"):
                        for meta in c_data["metas"]:
                            mid = meta.get("id", "")
                            if mid.startswith("tt"):
                                imdb_id = mid
                                break
                except Exception as e:
                    print(f"[Warn] Cinemeta title resolution error: {e}")

            streams = []

            # A. High-Speed Direct In-Browser Web Video Streams (No fake cartoons)
            if imdb_id:
                clean_title = title or "Feature Film"
                NEXSTREAM_API_KEY = "nx_7247f0dac882d0590776fb442d30a667"
                if media_type == "series":
                    streams.append({
                        "name": "VidLink Pro",
                        "title": f"Server 1 • VidLink 1080p Ultra HD (S{s_num}:E{e_num})",
                        "quality": "1080p Ultra HD",
                        "url": f"https://vidlink.pro/tv/{imdb_id}/{s_num}/{e_num}?primaryColor=10B981",
                        "browser_url": f"https://vidlink.pro/tv/{imdb_id}/{s_num}/{e_num}?primaryColor=10B981",
                        "direct_playable": True,
                        "is_embed": True,
                    })
                    streams.append({
                        "name": "NexStream VIP",
                        "title": f"Server 2 • NexStream VIP 1080p (S{s_num}:E{e_num})",
                        "quality": "1080p Ultra HD",
                        "url": f"https://api.codespecters.com/embed/tv/{imdb_id}/{s_num}/{e_num}?apikey={NEXSTREAM_API_KEY}",
                        "browser_url": f"https://api.codespecters.com/embed/tv/{imdb_id}/{s_num}/{e_num}?apikey={NEXSTREAM_API_KEY}",
                        "direct_playable": True,
                        "is_embed": True,
                    })
                    streams.append({
                        "name": "AutoEmbed Cloud",
                        "title": f"Server 3 • AutoEmbed High-Speed (S{s_num}:E{e_num})",
                        "quality": "1080p HD",
                        "url": f"https://autoembed.co/tv/imdb/{imdb_id}/{s_num}/{e_num}",
                        "browser_url": f"https://autoembed.co/tv/imdb/{imdb_id}/{s_num}/{e_num}",
                        "direct_playable": True,
                        "is_embed": True,
                    })
                    streams.append({
                        "name": "VidSrc PM",
                        "title": f"Server 4 • VidSrc Dedicated (S{s_num}:E{e_num})",
                        "quality": "1080p HD",
                        "url": f"https://vidsrc.pm/embed/tv/{imdb_id}/{s_num}/{e_num}",
                        "browser_url": f"https://vidsrc.pm/embed/tv/{imdb_id}/{s_num}/{e_num}",
                        "direct_playable": True,
                        "is_embed": True,
                    })
                    streams.append({
                        "name": "VidSrc SU",
                        "title": f"Server 5 • VidSrc High-Speed (S{s_num}:E{e_num})",
                        "quality": "1080p HD",
                        "url": f"https://vidsrc.su/embed/tv/{imdb_id}/{s_num}/{e_num}",
                        "browser_url": f"https://vidsrc.su/embed/tv/{imdb_id}/{s_num}/{e_num}",
                        "direct_playable": True,
                        "is_embed": True,
                    })
                    streams.append({
                        "name": "VidJoy Cinema",
                        "title": f"Server 6 • VidJoy Cinema (S{s_num}:E{e_num})",
                        "quality": "1080p HD",
                        "url": f"https://vidjoy.pro/embed/tv/{imdb_id}/{s_num}/{e_num}",
                        "browser_url": f"https://vidjoy.pro/embed/tv/{imdb_id}/{s_num}/{e_num}",
                        "direct_playable": True,
                        "is_embed": True,
                    })
                    streams.append({
                        "name": "2Embed Multi-Server",
                        "title": f"Server 7 • 2Embed 1080p Full HD (S{s_num}:E{e_num})",
                        "quality": "1080p Full HD",
                        "url": f"https://www.2embed.cc/embedtv/{imdb_id}&s={s_num}&e={e_num}",
                        "browser_url": f"https://www.2embed.cc/embedtv/{imdb_id}&s={s_num}&e={e_num}",
                        "direct_playable": True,
                        "is_embed": True,
                    })
                else:
                    streams.append({
                        "name": "VidLink Pro",
                        "title": f"Server 1 • {clean_title} - 1080p Ultra HD",
                        "quality": "1080p Ultra HD",
                        "url": f"https://vidlink.pro/movie/{imdb_id}?primaryColor=10B981",
                        "browser_url": f"https://vidlink.pro/movie/{imdb_id}?primaryColor=10B981",
                        "direct_playable": True,
                        "is_embed": True,
                    })
                    streams.append({
                        "name": "NexStream VIP",
                        "title": f"Server 2 • {clean_title} - NexStream VIP 1080p",
                        "quality": "1080p Ultra HD",
                        "url": f"https://api.codespecters.com/embed/movie/{imdb_id}?apikey={NEXSTREAM_API_KEY}",
                        "browser_url": f"https://api.codespecters.com/embed/movie/{imdb_id}?apikey={NEXSTREAM_API_KEY}",
                        "direct_playable": True,
                        "is_embed": True,
                    })
                    streams.append({
                        "name": "AutoEmbed Cloud",
                        "title": f"Server 3 • {clean_title} - 1080p High-Speed",
                        "quality": "1080p HD",
                        "url": f"https://autoembed.co/movie/imdb/{imdb_id}",
                        "browser_url": f"https://autoembed.co/movie/imdb/{imdb_id}",
                        "direct_playable": True,
                        "is_embed": True,
                    })
                    streams.append({
                        "name": "VidSrc PM",
                        "title": f"Server 4 • {clean_title} - VidSrc Dedicated",
                        "quality": "1080p HD",
                        "url": f"https://vidsrc.pm/embed/movie/{imdb_id}",
                        "browser_url": f"https://vidsrc.pm/embed/movie/{imdb_id}",
                        "direct_playable": True,
                        "is_embed": True,
                    })
                    streams.append({
                        "name": "VidSrc SU",
                        "title": f"Server 5 • {clean_title} - VidSrc High-Speed",
                        "quality": "1080p HD",
                        "url": f"https://vidsrc.su/embed/movie/{imdb_id}",
                        "browser_url": f"https://vidsrc.su/embed/movie/{imdb_id}",
                        "direct_playable": True,
                        "is_embed": True,
                    })
                    streams.append({
                        "name": "VidJoy Cinema",
                        "title": f"Server 6 • {clean_title} - VidJoy HD",
                        "quality": "1080p HD",
                        "url": f"https://vidjoy.pro/embed/movie/{imdb_id}",
                        "browser_url": f"https://vidjoy.pro/embed/movie/{imdb_id}",
                        "direct_playable": True,
                        "is_embed": True,
                    })
                    streams.append({
                        "name": "2Embed Multi-Server",
                        "title": f"Server 7 • {clean_title} - 1080p Full HD",
                        "quality": "1080p Full HD",
                        "url": f"https://www.2embed.cc/embed/{imdb_id}",
                        "browser_url": f"https://www.2embed.cc/embed/{imdb_id}",
                        "direct_playable": True,
                        "is_embed": True,
                    })

            # B. Check MovieBox API directly if numeric subject_id
            try:
                if item_id and not item_id.startswith("tt"):
                    mb_play = mb_client.get_play_info(item_id, s_num, e_num)
                    if mb_play and mb_play.get("data", {}).get("streams"):
                        for s in mb_play["data"]["streams"]:
                            stream_url = s.get("url")
                            if stream_url and stream_url.startswith("http") and "notice" not in stream_url.lower():
                                res_tag = s.get("resolutions", "1080")
                                proxy_url = f"/api/stream-proxy?url={urllib.parse.quote(stream_url)}"
                                streams.append({
                                    "name": "MovieBox Direct CDN",
                                    "title": f"MovieBox High-Speed CDN ({res_tag}p)",
                                    "quality": f"{res_tag}p HD",
                                    "url": stream_url,
                                    "browser_url": proxy_url,
                                    "direct_playable": True,
                                    "is_embed": False,
                                })
            except Exception as e:
                print(f"[Warn] MovieBox stream extraction error: {e}")

            # C. Check Torrentio stream resolver (for VLC peer streaming)
            try:
                resolve_id = imdb_id or (item_id if item_id.startswith("tt") else None)
                if resolve_id:
                    stream_id = resolve_id
                    if media_type == "series" and season and episode:
                        stream_id = f"{resolve_id}:{season}:{episode}"

                    url = f"https://torrentio.strem.fun/stream/{media_type}/{stream_id}.json"
                    data = fetch_json(url, timeout=4) or {"streams": []}
                    for s in data.get("streams", [])[:10]:
                        s_title = s.get("title", "")
                        s_name = s.get("name", "Torrentio")

                        quality = "1080p"
                        if "4k" in s_title.lower() or "2160p" in s_title.lower():
                            quality = "4K Ultra HD"
                        elif "720p" in s_title.lower():
                            quality = "720p HD"
                        elif "1080p" in s_title.lower():
                            quality = "1080p Full HD"

                        raw_url = s.get("url")
                        info_hash = s.get("infoHash")
                        if not raw_url and info_hash:
                            raw_url = f"magnet:?xt=urn:btih:{info_hash}&dn={urllib.parse.quote(s_title.split(chr(10))[0])}"

                        browser_url = None
                        if raw_url and raw_url.startswith("http"):
                            browser_url = f"/api/stream-proxy?url={urllib.parse.quote(raw_url)}"

                        streams.append({
                            "name": s_name,
                            "title": s_title.split("\n")[0],
                            "details": s_title,
                            "quality": quality,
                            "url": raw_url,
                            "browser_url": browser_url,
                            "direct_playable": bool(browser_url),
                            "is_embed": False,
                        })
            except Exception as e:
                print(f"[Warn] Torrentio stream resolver error: {e}")

            self.send_json({"streams": streams})
            return

        # -------------------------------------------------------------
        # 7. Watch History
        # -------------------------------------------------------------
        if path == "/api/history":
            data = {"watched": [], "recent": []}
            if os.path.isfile(HISTORY_FILE):
                try:
                    with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                        data = json.load(f)
                except Exception as e:
                    data["error"] = str(e)
            self.send_json(data)
            return

        return super().do_GET()

    # -------------------------------------------------------------
    # Video Streaming Proxy with Range Support (206 Partial Content)
    # -------------------------------------------------------------
    def handle_stream_proxy(self, target_url):
        req_headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        }
        if any(h in target_url for h in ["aoneroom", "moviebox", "sportslive", "hakunaymatata"]):
            req_headers["Referer"] = "https://sportslive.wine"

        client_range = self.headers.get("Range")
        if client_range:
            req_headers["Range"] = client_range

        req = urllib.request.Request(target_url, headers=req_headers)
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                status = resp.status
                self.send_response(status)
                for header in ["Content-Type", "Content-Length", "Content-Range", "Accept-Ranges"]:
                    val = resp.headers.get(header)
                    if val:
                        self.send_header(header, val)

                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()

                while True:
                    chunk = resp.read(128 * 1024)
                    if not chunk:
                        break
                    try:
                        self.wfile.write(chunk)
                    except (BrokenPipeError, ConnectionResetError):
                        break
        except urllib.error.HTTPError as e:
            self.send_error(e.code, str(e.reason))
        except Exception as e:
            self.send_error(500, f"Streaming error: {e}")

    # -------------------------------------------------------------
    # POST Handlers
    # -------------------------------------------------------------
    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/play-vlc":
            content_len = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_len) if content_len > 0 else b"{}"
            try:
                payload = json.loads(body.decode("utf-8"))
            except Exception:
                payload = {}

            target_url = payload.get("url") or payload.get("title", "")
            if not target_url:
                self.send_json({"success": False, "error": "No URL provided"}, status=400)
                return

            if not VLC_BIN or not os.path.isfile(VLC_BIN):
                self.send_json({"success": False, "error": "VLC executable not found"}, status=404)
                return

            try:
                cmd = [VLC_BIN, target_url, "--play-and-exit"]
                creation_flags = 0x00000008 if sys.platform == "win32" else 0
                subprocess.Popen(cmd, creationflags=creation_flags)
                print(f"[+] Launched VLC with: {target_url[:80]}...")
                self.send_json({"success": True, "message": "Launched in VLC Player"})
            except Exception as e:
                self.send_json({"success": False, "error": str(e)}, status=500)
            return

        self.send_error(404, "Endpoint not found")

    def send_json(self, data, status=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

def run():
    ports_to_try = [7680, 7700, 7860, 8080]
    httpd = None
    active_port = None
    for p in ports_to_try:
        try:
            socketserver.ThreadingTCPServer.allow_reuse_address = True
            httpd = socketserver.ThreadingTCPServer(("0.0.0.0", p), JoywatchHandler)
            httpd.daemon_threads = True
            active_port = p
            break
        except Exception as e:
            continue

    if not httpd:
        print("[-] Failed to bind to any candidate port.")
        sys.exit(1)

    print("=" * 65)
    print("   Joywatch • Ambient Cinema Streaming & Discovery")
    print("=" * 65)
    print(f"[*] URL                  : http://localhost:{active_port}")
    print(f"[*] Stream Proxy         : Active (HTTP 206 Range Enabled)")
    print(f"[*] Multi-Server Engine  : Active (VidLink, 2Embed, AutoEmbed, VidSrc)")
    print("=" * 65)
    print(f"[+] Joywatch running at http://localhost:{active_port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Stopping server...")

if __name__ == "__main__":
    run()
