package com.joywatch.app.data.repository

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.joywatch.app.data.model.MediaItem
import com.joywatch.app.data.model.MetaDetails
import com.joywatch.app.data.model.StreamSource
import com.joywatch.app.data.model.VideoEpisode
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

class JoywatchRepository {

    private val gson = Gson()

    private suspend fun fetchJson(urlString: String): JsonObject? = withContext(Dispatchers.IO) {
        try {
            val url = URL(urlString)
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "GET"
            conn.connectTimeout = 8000
            conn.readTimeout = 8000
            conn.setRequestProperty("User-Agent", "Joywatch-Native/1.0")

            if (conn.responseCode == 200) {
                BufferedReader(InputStreamReader(conn.inputStream)).use { reader ->
                    gson.fromJson(reader, JsonObject::class.java)
                }
            } else {
                null
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    suspend fun getCatalog(type: String, genre: String? = null): List<MediaItem> = withContext(Dispatchers.IO) {
        val endpoint = if (!genre.isNullOrBlank()) {
            val encodedGenre = URLEncoder.encode(genre, "UTF-8")
            "https://v3-cinemeta.strem.io/catalog/$type/top/genre=$encodedGenre.json"
        } else {
            "https://v3-cinemeta.strem.io/catalog/$type/top.json"
        }

        val json = fetchJson(endpoint) ?: return@withContext emptyList()
        val metasArray = json.getAsJsonArray("metas") ?: return@withContext emptyList()

        metasArray.take(30).mapNotNull { element ->
            val obj = element.asJsonObject
            val id = obj.get("id")?.asString ?: return@mapNotNull null
            val name = obj.get("name")?.asString ?: return@mapNotNull null
            val year = obj.get("year")?.asString ?: obj.get("releaseInfo")?.asString ?: ""
            val poster = obj.get("poster")?.asString
            val background = obj.get("background")?.asString ?: poster
            val description = obj.get("description")?.asString ?: ""
            val imdbRating = obj.get("imdbRating")?.asString ?: "8.5"

            val genresList = mutableListOf<String>()
            obj.getAsJsonArray("genres")?.forEach { g ->
                genresList.add(g.asString)
            }

            MediaItem(
                id = id,
                name = name,
                type = type,
                year = year,
                poster = poster,
                background = background,
                description = description,
                genres = genresList,
                imdbRating = imdbRating
            )
        }
    }

    suspend fun getStreamingPlatformCatalog(platformKey: String, type: String = "movie", skip: Int = 0): List<MediaItem> = withContext(Dispatchers.IO) {
        val endpoint = if (skip > 0) {
            "https://7a82163c306e-stremio-netflix-catalog-addon.baby-beamup.club/catalog/$type/$platformKey/skip=$skip.json"
        } else {
            "https://7a82163c306e-stremio-netflix-catalog-addon.baby-beamup.club/catalog/$type/$platformKey.json"
        }
        val json = fetchJson(endpoint) ?: return@withContext emptyList()
        val metasArray = json.getAsJsonArray("metas") ?: return@withContext emptyList()

        metasArray.mapNotNull { element ->
            val obj = element.asJsonObject
            val id = obj.get("id")?.asString ?: obj.get("imdb_id")?.asString ?: return@mapNotNull null
            val name = obj.get("name")?.asString ?: return@mapNotNull null
            val year = obj.get("year")?.asString ?: obj.get("releaseInfo")?.asString ?: ""
            val poster = obj.get("poster")?.asString
            val background = obj.get("background")?.asString ?: poster
            val description = obj.get("description")?.asString ?: ""
            val imdbRating = obj.get("imdbRating")?.asString ?: "8.2"

            val genresList = mutableListOf<String>()
            obj.getAsJsonArray("genres")?.forEach { g -> genresList.add(g.asString) }

            MediaItem(
                id = id,
                name = name,
                type = type,
                year = year,
                poster = poster,
                background = background,
                description = description,
                genres = genresList,
                imdbRating = imdbRating
            )
        }
    }

    suspend fun getTmdbCatalog(catalogId: String = "tmdb.trending", type: String = "movie"): List<MediaItem> = withContext(Dispatchers.IO) {
        val endpoint = "https://94c8cb9f702d-tmdb-addon.baby-beamup.club/catalog/$type/$catalogId.json"
        val json = fetchJson(endpoint) ?: return@withContext emptyList()
        val metasArray = json.getAsJsonArray("metas") ?: return@withContext emptyList()

        metasArray.take(25).mapNotNull { element ->
            val obj = element.asJsonObject
            val id = obj.get("imdb_id")?.asString ?: obj.get("id")?.asString ?: return@mapNotNull null
            val name = obj.get("name")?.asString ?: return@mapNotNull null
            val year = obj.get("year")?.asString ?: obj.get("releaseInfo")?.asString ?: ""
            val poster = obj.get("poster")?.asString
            val background = obj.get("background")?.asString ?: poster
            val description = obj.get("description")?.asString ?: ""
            val imdbRating = obj.get("imdbRating")?.asString ?: "8.5"

            val genresList = mutableListOf<String>()
            obj.getAsJsonArray("genres")?.forEach { g -> genresList.add(g.asString) }

            MediaItem(
                id = id,
                name = name,
                type = type,
                year = year,
                poster = poster,
                background = background,
                description = description,
                genres = genresList,
                imdbRating = imdbRating
            )
        }
    }

    suspend fun getMeta(type: String, id: String): MetaDetails? = withContext(Dispatchers.IO) {
        val endpoint = if (id.startsWith("tmdb:")) {
            "https://94c8cb9f702d-tmdb-addon.baby-beamup.club/meta/$type/$id.json"
        } else {
            "https://v3-cinemeta.strem.io/meta/$type/$id.json"
        }
        val json = fetchJson(endpoint) ?: return@withContext null
        val metaObj = json.getAsJsonObject("meta") ?: return@withContext null

        val resolvedId = metaObj.get("imdb_id")?.asString ?: id
        val name = metaObj.get("name")?.asString ?: "Title"
        val year = metaObj.get("year")?.asString ?: metaObj.get("releaseInfo")?.asString ?: ""
        val poster = metaObj.get("poster")?.asString
        val background = metaObj.get("background")?.asString ?: poster
        val description = metaObj.get("description")?.asString ?: ""
        val imdbRating = metaObj.get("imdbRating")?.asString ?: "8.5"

        val genresList = mutableListOf<String>()
        metaObj.getAsJsonArray("genres")?.forEach { g ->
            genresList.add(g.asString)
        }

        val videosList = mutableListOf<VideoEpisode>()
        metaObj.getAsJsonArray("videos")?.forEach { v ->
            val vObj = v.asJsonObject
            val vId = vObj.get("id")?.asString ?: ""
            val vTitle = vObj.get("title")?.asString ?: "Episode"
            val vSeason = vObj.get("season")?.asInt ?: 1
            val vEpisode = vObj.get("episode")?.asInt ?: 1
            val vThumb = vObj.get("thumbnail")?.asString
            videosList.add(
                VideoEpisode(
                    id = vId,
                    title = vTitle,
                    season = vSeason,
                    episode = vEpisode,
                    thumbnail = vThumb
                )
            )
        }

        MetaDetails(
            id = resolvedId,
            name = name,
            type = type,
            year = year,
            poster = poster,
            background = background,
            description = description,
            genres = genresList,
            imdbRating = imdbRating,
            videos = videosList
        )
    }

    suspend fun search(query: String): List<MediaItem> = withContext(Dispatchers.IO) {
        if (query.isBlank()) return@withContext emptyList()
        val encoded = URLEncoder.encode(query, "UTF-8")
        val movieUrl = "https://v3-cinemeta.strem.io/catalog/movie/top/search=$encoded.json"
        val seriesUrl = "https://v3-cinemeta.strem.io/catalog/series/top/search=$encoded.json"

        val movieJson = fetchJson(movieUrl)
        val seriesJson = fetchJson(seriesUrl)

        val results = mutableListOf<MediaItem>()
        val seenIds = mutableSetOf<String>()

        fun parseArray(json: JsonObject?, fallbackType: String) {
            val array = json?.getAsJsonArray("metas") ?: return
            for (elem in array) {
                val obj = elem.asJsonObject
                val id = obj.get("id")?.asString ?: continue
                if (seenIds.contains(id)) continue
                seenIds.add(id)

                val name = obj.get("name")?.asString ?: continue
                val type = obj.get("type")?.asString ?: fallbackType
                val year = obj.get("year")?.asString ?: ""
                val poster = obj.get("poster")?.asString
                val background = obj.get("background")?.asString ?: poster
                val desc = obj.get("description")?.asString ?: ""
                val rating = obj.get("imdbRating")?.asString ?: "8.0"

                val genres = mutableListOf<String>()
                obj.getAsJsonArray("genres")?.forEach { g -> genres.add(g.asString) }

                results.add(
                    MediaItem(
                        id = id,
                        name = name,
                        type = type,
                        year = year,
                        poster = poster,
                        background = background,
                        description = desc,
                        genres = genres,
                        imdbRating = rating
                    )
                )
            }
        }

        parseArray(movieJson, "movie")
        parseArray(seriesJson, "series")
        results
    }

    private val tmdbIdCache = java.util.concurrent.ConcurrentHashMap<String, String>().apply {
        put("tt35538033", "1423191") // Resident Evil (2026)
        put("tt0120804", "9381")     // Resident Evil (2002)
    }

    suspend fun resolveTmdbId(id: String, type: String): String = withContext(Dispatchers.IO) {
        if (!id.startsWith("tt")) {
            return@withContext if (id.startsWith("tmdb:")) id.removePrefix("tmdb:") else id
        }
        tmdbIdCache[id]?.let { return@withContext it }

        try {
            val cinemetaType = if (type == "series") "series" else "movie"
            val endpoint = "https://v3-cinemeta.strem.io/meta/$cinemetaType/$id.json"
            val json = fetchJson(endpoint)
            val meta = json?.getAsJsonObject("meta")
            val moviedbId = meta?.get("moviedb_id")?.let { elem ->
                if (elem.isJsonPrimitive) elem.asString else null
            } ?: meta?.get("tmdb_id")?.let { elem ->
                if (elem.isJsonPrimitive) elem.asString else null
            }
            if (!moviedbId.isNullOrBlank() && moviedbId != "0") {
                tmdbIdCache[id] = moviedbId
                return@withContext moviedbId
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        id
    }

    companion object {
        private const val NEXSTREAM_API_KEY = "nx_7247f0dac882d0590776fb442d30a667"
    }

    suspend fun getStreamSources(
        type: String,
        id: String,
        title: String,
        season: Int = 1,
        episode: Int = 1
    ): List<StreamSource> = withContext(Dispatchers.IO) {
        val cleanTitle = title.ifBlank { "Movie" }
        val vidlinkId = resolveTmdbId(id, type)
        val vidlinkParams = "?primaryColor=10B981"
        val nexstreamId = if (vidlinkId.isNotBlank() && vidlinkId != "0") vidlinkId else id

        if (type == "series") {
            listOf(
                StreamSource(
                    name = "VidLink Pro",
                    title = "Server 1 • VidLink 1080p Ultra HD (S$season:E$episode)",
                    quality = "1080p Ultra HD • Best Audio & Fast",
                    url = "https://vidlink.pro/tv/$vidlinkId/$season/$episode$vidlinkParams"
                ),
                StreamSource(
                    name = "NexStream VIP",
                    title = "Server 2 • NexStream VIP 1080p (S$season:E$episode)",
                    quality = "1080p Ultra HD • Auto-Fallback & Fast",
                    url = "https://api.codespecters.com/embed/tv/$nexstreamId/$season/$episode?apikey=$NEXSTREAM_API_KEY"
                ),
                StreamSource(
                    name = "AutoEmbed Cloud",
                    title = "Server 3 • AutoEmbed High-Speed (S$season:E$episode)",
                    quality = "1080p HD • Cloud CDN",
                    url = "https://autoembed.co/tv/imdb/$id/$season/$episode"
                ),
                StreamSource(
                    name = "VidSrc PM",
                    title = "Server 4 • VidSrc Dedicated (S$season:E$episode)",
                    quality = "1080p HD • Dedicated",
                    url = "https://vidsrc.pm/embed/tv/$id/$season/$episode"
                ),
                StreamSource(
                    name = "VidJoy Cinema",
                    title = "Server 5 • VidJoy Cinema (S$season:E$episode)",
                    quality = "1080p HD • Direct Stream",
                    url = "https://vidjoy.pro/embed/tv/$id/$season/$episode"
                ),
                StreamSource(
                    name = "AutoEmbed Global",
                    title = "Server 6 • AutoEmbed Global (S$season:E$episode)",
                    quality = "1080p HD • Edge CDN",
                    url = "https://autoembed.to/tv/imdb/$id/$season/$episode"
                ),
                StreamSource(
                    name = "MultiEmbed VIP",
                    title = "Server 7 • MultiEmbed VIP (S$season:E$episode)",
                    quality = "1080p HD • Multi-Source",
                    url = "https://multiembed.mov/?video_id=$id&s=$season&e=$episode"
                ),
                StreamSource(
                    name = "AnyEmbed Cluster",
                    title = "Server 8 • AnyEmbed Cluster (S$season:E$episode)",
                    quality = "1080p HD • High Stability",
                    url = "https://anyembed.xyz/embed/imdb-tv-$id-$season-$episode"
                )
            )
        } else {
            listOf(
                StreamSource(
                    name = "VidLink Pro",
                    title = "Server 1 • $cleanTitle - 1080p Ultra HD",
                    quality = "1080p Ultra HD • Best Audio & Fast",
                    url = "https://vidlink.pro/movie/$vidlinkId$vidlinkParams"
                ),
                StreamSource(
                    name = "NexStream VIP",
                    title = "Server 2 • $cleanTitle - NexStream VIP",
                    quality = "1080p Ultra HD • Auto-Fallback & Fast",
                    url = "https://api.codespecters.com/embed/movie/$nexstreamId?apikey=$NEXSTREAM_API_KEY"
                ),
                StreamSource(
                    name = "AutoEmbed Cloud",
                    title = "Server 3 • $cleanTitle - 1080p High-Speed",
                    quality = "1080p HD • Cloud CDN",
                    url = "https://autoembed.co/movie/imdb/$id"
                ),
                StreamSource(
                    name = "VidSrc PM",
                    title = "Server 4 • $cleanTitle - Dedicated Mirror",
                    quality = "1080p HD • Dedicated",
                    url = "https://vidsrc.pm/embed/movie/$id"
                ),
                StreamSource(
                    name = "VidJoy Cinema",
                    title = "Server 5 • $cleanTitle - VidJoy HD",
                    quality = "1080p HD • Direct Stream",
                    url = "https://vidjoy.pro/embed/movie/$id"
                ),
                StreamSource(
                    name = "AutoEmbed Global",
                    title = "Server 6 • $cleanTitle - 1080p Global CDN",
                    quality = "1080p HD • Edge CDN",
                    url = "https://autoembed.to/movie/imdb/$id"
                ),
                StreamSource(
                    name = "MultiEmbed VIP",
                    title = "Server 7 • $cleanTitle - MultiEmbed VIP",
                    quality = "1080p HD • Multi-Source",
                    url = "https://multiembed.mov/?video_id=$id"
                ),
                StreamSource(
                    name = "AnyEmbed Cluster",
                    title = "Server 8 • $cleanTitle - AnyEmbed HD",
                    quality = "1080p HD • High Stability",
                    url = "https://anyembed.xyz/embed/imdb-movie-$id"
                )
            )
        }
    }
}
