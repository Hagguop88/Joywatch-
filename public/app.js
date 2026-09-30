/**
 * Joywatch • Ambient Cinema Streaming & Discovery
 * Premium Modern Discovery & Streaming Platform Engine
 * 
 * Strict UI/UX Invariants:
 * - Zero Purple Anywhere
 * - Zero Gradients (Pure solid tints and layered smooth box-shadows)
 * - Zero Emojis (Delicate SVGs and clean text)
 * - Primary Accent: Pure Warm Cinema Amber (#EAB308)
 * - Direct In-Browser Playback with Multi-Server Failover
 * - OTT Platforms: Netflix, Prime Video, Disney+, Crunchyroll, Paramount+
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Header Elements
  const navbar = document.getElementById('navbar');
  const searchBox = document.getElementById('search-box');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const joylistCounter = document.getElementById('joylist-counter');
  const mobileJoylistCounter = document.getElementById('mobile-joylist-counter');
  const allNavButtons = document.querySelectorAll('.nav-pill, .bottom-nav-pill');
  void document.getElementById('nav-search-btn');
  void document.getElementById('mobile-search-tab');

  // Main Views & Sections
  const billboard = document.getElementById('billboard');
  const ottSection = document.getElementById('ott-section');
  const rowsContainer = document.getElementById('rows-container');
  const searchView = document.getElementById('search-view');
  const mylistView = document.getElementById('mylist-view');
  const sectionView = document.getElementById('section-view');
  const sectionTitleEl = document.getElementById('section-title');
  const sectionSubtitleEl = document.getElementById('section-subtitle');
  const sectionBadgeEl = document.getElementById('section-badge');
  const sectionCountBadgeEl = document.getElementById('section-count-badge');
  const sectionGrid = document.getElementById('section-grid');
  const sectionBackBtn = document.getElementById('section-back-btn');

  // Live TV View Elements
  const livetvView = document.getElementById('livetv-view');
  const tvSearchInput = document.getElementById('tv-search-input');
  const tvClearSearchBtn = document.getElementById('tv-clear-search-btn');
  const tvAddStreamBtn = document.getElementById('tv-add-stream-btn');
  const tvTotalCountBadge = document.getElementById('tv-total-count-badge');
  const tvChannelsGrid = document.getElementById('tv-channels-grid');
  const tvEmptyState = document.getElementById('tv-empty-state');
  const tvResetFiltersBtn = document.getElementById('tv-reset-filters-btn');
  const tvCategoryPills = document.getElementById('tv-category-pills');
  const tvCountryPills = document.getElementById('tv-country-pills');
  const tvFeaturedTitle = document.getElementById('tv-featured-title');
  const tvFeaturedDesc = document.getElementById('tv-featured-desc');
  const tvFeaturedCategory = document.getElementById('tv-featured-category');
  const tvFeaturedCountry = document.getElementById('tv-featured-country');
  const tvFeaturedQuality = document.getElementById('tv-featured-quality');
  const tvFeaturedLogo = document.getElementById('tv-featured-logo');
  const tvFeaturedPlayBtn = document.getElementById('tv-featured-play-btn');

  // Custom Stream Modal Elements
  const customStreamModal = document.getElementById('custom-stream-modal');
  const customStreamCloseBtn = document.getElementById('custom-stream-close-btn');
  const customStreamForm = document.getElementById('custom-stream-form');
  const customStreamName = document.getElementById('custom-stream-name');
  const customStreamUrl = document.getElementById('custom-stream-url');
  const customStreamCategory = document.getElementById('custom-stream-category');
  const customStreamQuality = document.getElementById('custom-stream-quality');

  // Hero Billboard Elements
  const billboardBg = document.getElementById('billboard-bg');
  const billboardTitle = document.getElementById('billboard-title');
  const billboardRating = document.getElementById('billboard-rating');
  const billboardYear = document.getElementById('billboard-year');
  const billboardGenres = document.getElementById('billboard-genres');
  const billboardRuntime = document.getElementById('billboard-runtime');
  const billboardSynopsis = document.getElementById('billboard-synopsis');
  const billboardPlayBtn = document.getElementById('billboard-play-btn');
  const billboardMyListBtn = document.getElementById('billboard-mylist-btn');
  const billboardMyListText = document.getElementById('billboard-mylist-text');
  const billboardInfoBtn = document.getElementById('billboard-info-btn');
  const billboardMatch = document.getElementById('billboard-match');

  // Dedicated Search Page Elements
  const dedicatedSearchInput = document.getElementById('dedicated-search-input');
  const dedicatedClearBtn = document.getElementById('dedicated-clear-btn');
  const searchGrid = document.getElementById('search-grid');
  const searchResultsHeading = document.getElementById('search-results-heading');
  const searchSubheading = document.getElementById('search-subheading');
  const searchCountBadge = document.getElementById('search-count-badge');

  // Watchlist & Library View Elements
  const mylistGrid = document.getElementById('mylist-grid');
  const mylistCountBadge = document.getElementById('mylist-count-badge');
  const mylistEmpty = document.getElementById('mylist-empty');
  const mylistEmptyTitle = document.getElementById('mylist-empty-title');
  const mylistEmptySubtext = document.getElementById('mylist-empty-subtext');
  const mylistEmptyIcon = document.getElementById('mylist-empty-icon');
  const browseCatalogBtn = document.getElementById('browse-catalog-btn');
  const libTabWatchlist = document.getElementById('lib-tab-watchlist');
  const libTabHistory = document.getElementById('lib-tab-history');
  const libClearHistoryBtn = document.getElementById('lib-clear-history-btn');
  const libWatchlistCount = document.getElementById('lib-watchlist-count');
  const libHistoryCount = document.getElementById('lib-history-count');
  let activeLibraryTab = 'watchlist'; // 'watchlist' | 'history'

  // Settings View Elements
  const settingsView = document.getElementById('settings-view');
  const themeGrid = document.getElementById('theme-grid');
  const serverList = document.getElementById('server-list');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  const resetSettingsBtn = document.getElementById('reset-settings-btn');
  const exportBackupBtn = document.getElementById('export-backup-btn');
  const importBackupBtn = document.getElementById('import-backup-btn');
  const importBackupFile = document.getElementById('import-backup-file');

  // Cinema Detail Modal Elements
  const detailModal = document.getElementById('detail-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBanner = document.getElementById('modal-banner');
  const modalPosterImg = document.getElementById('modal-poster-img');
  const modalTitle = document.getElementById('modal-title');
  const modalType = document.getElementById('modal-type');
  const modalMatch = document.getElementById('modal-match');
  const modalRating = document.getElementById('modal-rating');
  const modalYear = document.getElementById('modal-year');
  const modalGenres = document.getElementById('modal-genres');
  const modalRuntime = document.getElementById('modal-runtime');
  const modalHeroSynopsis = document.getElementById('modal-hero-synopsis');
  const modalSynopsis = document.getElementById('modal-synopsis');
  const modalPlayBtn = document.getElementById('modal-play-btn');
  const modalMyListBtn = document.getElementById('modal-mylist-btn');
  const modalMyListText = document.getElementById('modal-mylist-text');
  const modalCastSection = document.getElementById('modal-cast-section');
  const modalCastList = document.getElementById('modal-cast-list');
  const episodesSection = document.getElementById('episodes-section');
  const seasonSelect = document.getElementById('season-select');
  const episodesList = document.getElementById('episodes-list');
  const modalRelatedSection = document.getElementById('modal-related-section');
  const modalRelatedShelf = document.getElementById('modal-related-shelf');

  // Video Player Elements
  const videoPlayer = document.getElementById('video-player');
  const htmlVideo = document.getElementById('html-video');
  const playerIframe = document.getElementById('player-iframe');
  const playerBackBtn = document.getElementById('player-back-btn');
  const playerTitle = document.getElementById('player-title');
  const playerSub = document.getElementById('player-sub');
  const playerServersDropdown = document.getElementById('player-servers-dropdown');
  const playerServersToggleBtn = document.getElementById('player-servers-toggle-btn');
  const playerServersPanel = document.getElementById('player-servers-panel');
  const playerServersContainer = document.getElementById('player-servers-container');
  const serversActiveTag = document.getElementById('servers-active-tag');

  // Global State
  let currentFeaturedItem = null;
  let activeModalItem = null;
  let activeModalStreams = [];
  let currentServerIndex = 0;
  let searchTimeout = null;
  let isModalAnimating = false;
  let isPlayerAnimating = false;
  let cachedCatalogPool = [];

  // Playback-resume state (wired to JoywatchProviders + JoywatchProgress).
  let activeSeason = 1;
  let activeEpisode = 1;
  let activePlaybackSession = null;

  function hasPlaybackEngine() {
    return typeof window.JoywatchProviders !== 'undefined' &&
      typeof window.JoywatchProgress !== 'undefined';
  }

  function hasSettingsEngine() {
    return typeof window.JoywatchSettings !== 'undefined';
  }

  // Current media key for per-media server memory (matches sessionKey shape).
  function mediaServerKey() {
    if (!activeModalItem || !activeModalItem.id) return null;
    const mediaType = activeModalItem.type === 'series' ? 'series' : 'movie';
    return window.JoywatchSettings.buildMediaKey(mediaType, activeModalItem.id, activeSeason, activeEpisode);
  }

  // Consolidated per-stream display label, keyed on the stable provider id so
  // VidSrc PM and SU never collide and labels always agree with Settings.
  function serverLabelFor(stream, index) {
    let providerId = null;
    try {
      if (hasPlaybackEngine()) providerId = window.JoywatchProviders.identify(stream.browser_url || stream.url);
    } catch (e) { providerId = null; }
    if (providerId && hasSettingsEngine()) {
      const displayName = window.JoywatchSettings.SERVER_DISPLAY_NAMES[providerId];
      if (displayName) return `Server ${index + 1} (${displayName})`;
    }
    return `Server ${index + 1}${stream.name ? ` (${stream.name})` : ''}`;
  }

  // Resolve the remembered server (provider id) for the active media to the
  // current stream index. Returns -1 when there is no preference.
  function resolvePreferredIndex() {
    if (!hasSettingsEngine() || !hasPlaybackEngine() || !mediaServerKey()) return -1;
    try {
      const key = mediaServerKey();
      const pref = window.JoywatchSettings.getServerPref(
        activeModalItem.type === 'series' ? 'series' : 'movie',
        activeModalItem.id, activeSeason, activeEpisode);
      if (!pref || !key) return -1;
      return activeModalStreams.findIndex(s =>
        window.JoywatchProviders.identify(s.browser_url || s.url) === pref);
    } catch (e) { return -1; }
  }

  // Persist the user's server choice for this title (provider id, never index).
  function rememberServerChoice(index) {
    if (!hasSettingsEngine() || !hasPlaybackEngine()) return;
    try {
      const stream = activeModalStreams[index];
      if (!stream) return;
      const providerId = window.JoywatchProviders.identify(stream.browser_url || stream.url);
      if (!providerId) return; // Torrentio/proxy streams have no stable provider
      if (!mediaServerKey()) return;
      window.JoywatchSettings.setServerPref(
        activeModalItem.type === 'series' ? 'series' : 'movie',
        activeModalItem.id, activeSeason, activeEpisode, providerId);
    } catch (e) { /* server memory is best-effort */ }
  }

  // Apply the stored server order / hidden list to the live stream array.
  function applyServerPreferences() {
    if (!hasSettingsEngine() || !activeModalStreams || !activeModalStreams.length) return;
    try {
      const settings = window.JoywatchSettings.getAll();
      activeModalStreams = window.JoywatchSettings.reorderAndFilterStreams(activeModalStreams, settings);
    } catch (e) { /* keep the raw order on failure */ }
  }

  function endActivePlaybackSession() {
    if (activePlaybackSession) {
      try {
        activePlaybackSession.close();
      } catch (e) { /* never break player teardown */ }
      activePlaybackSession = null;
    }
  }

  // Search & Filter State
  const filterState = {
    platform: 'all',
    type: 'all',
    genre: 'all',
    year: 'all',
    rating: 'all'
  };

  // =========================================================================
  // CANONICAL OTT PLATFORMS DATA (100+ to 200+ titles per platform from TMDb)
  // Netflix, Prime Video, Disney+ Hotstar, Crunchyroll, Paramount+
  // =========================================================================
  const OTT_DATA = (typeof window !== 'undefined' && window.TMDB_PRECOMPILED_OTT)
    ? window.TMDB_PRECOMPILED_OTT
    : ((typeof TMDB_PRECOMPILED_OTT !== 'undefined' && TMDB_PRECOMPILED_OTT) ? TMDB_PRECOMPILED_OTT : {
        netflix: [],
        prime: [],
        disney: [],
        crunchyroll: [],
        paramount: []
      });

  // Seed cached pool with all curated OTT platform titles for instant availability
  Object.values(OTT_DATA).forEach(list => {
    list.forEach(item => {
      if (!cachedCatalogPool.some(c => c.id === item.id)) {
        cachedCatalogPool.push(item);
      }
    });
  });

  // =========================================================================
  // LOCALSTORAGE WATCHLIST (My List)
  // =========================================================================
  function getJoyList() {
    try {
      return JSON.parse(localStorage.getItem('joywatch_list')) || [];
    } catch (e) {
      return [];
    }
  }

  function saveJoyList(list) {
    localStorage.setItem('joywatch_list', JSON.stringify(list));
    updateJoylistCounter();
    if (mylistView && mylistView.style.display !== 'none') {
      renderMyListView();
    }
  }

  function isInJoyList(id) {
    return getJoyList().some(item => item.id === id);
  }

  function toggleJoyList(item) {
    if (!item) return;
    let list = getJoyList();
    const index = list.findIndex(i => i.id === item.id);
    if (index >= 0) {
      list.splice(index, 1);
      updateMyListBtn(false);
      updateHeroMyListBtn(false);
      showToast(`Removed "${item.name}" from My List`);
    } else {
      list.unshift(item);
      updateMyListBtn(true);
      updateHeroMyListBtn(true);
      showToast(`Added "${item.name}" to My List`);
    }
    saveJoyList(list);
  }

  function updateLibraryCounters() {
    const count = getJoyList().length;
    if (libWatchlistCount) libWatchlistCount.textContent = count;
    let histLen = 0;
    if (hasPlaybackEngine()) {
      try {
        histLen = window.JoywatchProgress.listRecent().length;
      } catch (e) { histLen = 0; }
    }
    if (libHistoryCount) libHistoryCount.textContent = histLen;
  }

  function updateJoylistCounter() {
    const count = getJoyList().length;
    if (joylistCounter) joylistCounter.textContent = count;
    if (mobileJoylistCounter) mobileJoylistCounter.textContent = count;
    if (mylistCountBadge && activeLibraryTab === 'watchlist') mylistCountBadge.textContent = `${count} saved`;
    updateLibraryCounters();
  }

  function updateMyListBtn(isSaved) {
    if (!modalMyListBtn) return;
    if (isSaved) {
      modalMyListBtn.classList.add('active');
      if (modalMyListText) modalMyListText.textContent = 'Saved in List';
    } else {
      modalMyListBtn.classList.remove('active');
      if (modalMyListText) modalMyListText.textContent = '+ My List';
    }
  }

  function updateHeroMyListBtn(isSaved) {
    if (!billboardMyListBtn) return;
    if (isSaved) {
      billboardMyListBtn.classList.add('active');
      if (billboardMyListText) billboardMyListText.textContent = 'Saved in List';
    } else {
      billboardMyListBtn.classList.remove('active');
      if (billboardMyListText) billboardMyListText.textContent = '+ My List';
    }
  }

  updateJoylistCounter();

  // =========================================================================
  // API FETCH & CLIENT FALLBACKS
  // =========================================================================
  async function safeFetchJson(url, fallbackFn = null) {
    try {
      const res = await fetch(url);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      console.warn(`Endpoint ${url} failed, using direct client-side fallback:`, e);
    }
    if (typeof fallbackFn === 'function') {
      try {
        return await fallbackFn();
      } catch (e) {
        console.warn(`Fallback execution failed for ${url}:`, e);
      }
    }
    return null;
  }

  async function fetchCatalog(type, genre = null) {
    const apiPath = `/api/catalog?type=${type}${genre ? '&genre=' + encodeURIComponent(genre) : ''}`;
    const data = await safeFetchJson(apiPath, async () => {
      const stremUrl = genre 
        ? `https://v3-cinemeta.strem.io/catalog/${type}/top/genre=${encodeURIComponent(genre)}.json`
        : `https://v3-cinemeta.strem.io/catalog/${type}/top.json`;
      const res = await fetch(stremUrl);
      const json = await res.json();
      const items = (json.metas || []).slice(0, 30).map(m => ({
        id: m.id,
        name: m.name,
        type: m.type || type,
        year: String(m.year || m.releaseInfo || '2025'),
        poster: m.poster,
        background: m.background || m.poster,
        description: m.description || '',
        genres: m.genres || (genre ? [genre] : []),
        imdbRating: m.imdbRating || '8.5'
      }));
      return { items };
    });
    const items = (data && data.items) ? data.items : [];
    items.forEach(item => {
      if (!cachedCatalogPool.some(c => c.id === item.id)) {
        cachedCatalogPool.push(item);
      }
    });
    return { items };
  }

  // =========================================================================
  // TMDb API ENGINE & STREAMING WATCH PROVIDERS (Netflix, Prime, Disney+, etc.)
  // =========================================================================
  const TMDB_API_KEY = 'b4a5cc243be17db99639ea6bbd462ed6';
  const TMDB_BASE_URL = 'https://api.tmdb.org/3';

  async function fetchOttCatalog(platform, type = 'all', limit = 200) {
    if (!platform || platform === 'all') {
      const combined = [];
      const seen = new Set();
      ['netflix', 'prime', 'disney', 'crunchyroll', 'paramount'].forEach(p => {
        const list = OTT_DATA[p] || [];
        list.forEach(item => {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            combined.push(item);
          }
        });
      });
      let result = combined;
      if (type !== 'all') {
        result = result.filter(it => type === 'series' ? it.type === 'series' : it.type === 'movie');
      }
      return result.slice(0, limit);
    }

    const cached = OTT_DATA[platform] || [];
    if (cached.length >= 50) {
      let filtered = cached;
      if (type !== 'all') {
        filtered = filtered.filter(it => type === 'series' ? it.type === 'series' : it.type === 'movie');
      }
      return filtered.slice(0, limit);
    }

    const apiPath = `/api/ott-catalog?platform=${encodeURIComponent(platform)}&type=${encodeURIComponent(type)}&limit=${limit}`;
    const data = await safeFetchJson(apiPath, async () => {
      // Direct client fallback to TMDb if server proxy is unavailable
      const provMap = {
        netflix: '8|1796',
        prime: '9|119|2100',
        disney: '2336|337',
        crunchyroll: '283|1968',
        paramount: '531|582|2303|2616'
      };
      const prov = provMap[platform.toLowerCase()] || '8';
      const mType = type === 'series' ? 'tv' : 'movie';
      const tmdbUrl = `${TMDB_BASE_URL}/discover/${mType}?api_key=${TMDB_API_KEY}&watch_region=US&with_watch_providers=${prov}&sort_by=popularity.desc&vote_count.gte=25`;
      const res = await fetch(tmdbUrl);
      const json = await res.json();
      return {
        items: (json.results || []).slice(0, limit).map(r => ({
          id: `tmdb:${r.id}`,
          tmdb_id: r.id,
          name: r.title || r.name,
          type: mType === 'tv' ? 'series' : 'movie',
          year: (r.release_date || r.first_air_date || '2024').substring(0, 4),
          imdbRating: r.vote_average ? r.vote_average.toFixed(1) : '8.0',
          poster: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : '',
          background: r.backdrop_path ? `https://image.tmdb.org/t/p/w1280${r.backdrop_path}` : '',
          description: r.overview || '',
          genres: [getPlatformDisplayName(platform)],
          platform: platform,
          platform_name: getPlatformDisplayName(platform)
        }))
      };
    });

    const items = (data && data.items && data.items.length > 0) ? data.items : (OTT_DATA[platform] || []);
    if (items.length > 0) {
      if (!OTT_DATA[platform] || OTT_DATA[platform].length < items.length) {
        OTT_DATA[platform] = items;
      }
      items.forEach(it => {
        it.platform = platform;
        if (!cachedCatalogPool.some(c => c.id === it.id)) {
          cachedCatalogPool.push(it);
        }
      });
    }
    return items;
  }

  async function fetchMeta(type, id) {
    const apiPath = `/api/meta?type=${type}&id=${id}`;
    const data = await safeFetchJson(apiPath, async () => {
      const res = await fetch(`https://v3-cinemeta.strem.io/meta/${type}/${id}.json`);
      const json = await res.json();
      return { meta: json.meta || {} };
    });
    return data || { meta: {} };
  }

  async function fetchSearch(query) {
    const apiPath = `/api/search?q=${encodeURIComponent(query)}`;
    const data = await safeFetchJson(apiPath, async () => {
      const encoded = encodeURIComponent(query);
      const [mRes, sRes] = await Promise.all([
        fetch(`https://v3-cinemeta.strem.io/catalog/movie/top/search=${encoded}.json`).then(r => r.json()).catch(() => ({ metas: [] })),
        fetch(`https://v3-cinemeta.strem.io/catalog/series/top/search=${encoded}.json`).then(r => r.json()).catch(() => ({ metas: [] }))
      ]);
      const combined = [...(mRes.metas || []), ...(sRes.metas || [])];
      const seen = new Set();
      const items = [];
      for (const m of combined) {
        if (!seen.has(m.id)) {
          seen.add(m.id);
          items.push({
            id: m.id,
            name: m.name,
            type: m.type || 'movie',
            year: String(m.year || m.releaseInfo || '2025'),
            poster: m.poster,
            background: m.background || m.poster,
            description: m.description || '',
            genres: m.genres || [],
            imdbRating: m.imdbRating || '8.2'
          });
        }
      }
      return { items: items.slice(0, 40) };
    });
    const items = (data && data.items) ? data.items : [];
    items.forEach(item => {
      if (!cachedCatalogPool.some(c => c.id === item.id)) {
        cachedCatalogPool.push(item);
      }
    });
    return { items };
  }

  async function fetchStreams(type, id, title, season = 1, episode = 1) {
    const apiPath = `/api/streams?type=${type}&id=${id}&title=${encodeURIComponent(title)}&season=${season}&episode=${episode}`;
    const data = await safeFetchJson(apiPath, async () => {
      const cleanTitle = title || "Feature Film";
      const s = parseInt(season) || 1;
      const e = parseInt(episode) || 1;
      const streams = [];
      const nexKey = "nx_7247f0dac882d0590776fb442d30a667";
      if (type === 'series') {
        streams.push(
          { name: "VidLink Pro", title: `Server 1 • VidLink 1080p Ultra HD (S${s}:E${e})`, quality: "1080p Ultra HD", url: `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=EAB308`, browser_url: `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=EAB308`, direct_playable: true, is_embed: true },
          { name: "NexStream VIP", title: `Server 2 • NexStream VIP 1080p (S${s}:E${e})`, quality: "1080p Ultra HD", url: `https://api.codespecters.com/embed/tv/${id}/${s}/${e}?apikey=${nexKey}`, browser_url: `https://api.codespecters.com/embed/tv/${id}/${s}/${e}?apikey=${nexKey}`, direct_playable: true, is_embed: true },
          { name: "AutoEmbed Cloud", title: `Server 3 • AutoEmbed High-Speed (S${s}:E${e})`, quality: "1080p HD", url: `https://autoembed.co/tv/imdb/${id}/${s}/${e}`, browser_url: `https://autoembed.co/tv/imdb/${id}/${s}/${e}`, direct_playable: true, is_embed: true },
          { name: "VidSrc PM", title: `Server 4 • VidSrc Dedicated (S${s}:E${e})`, quality: "1080p HD", url: `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`, browser_url: `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`, direct_playable: true, is_embed: true },
          { name: "VidSrc SU", title: `Server 5 • VidSrc High-Speed (S${s}:E${e})`, quality: "1080p HD", url: `https://vidsrc.su/embed/tv/${id}/${s}/${e}`, browser_url: `https://vidsrc.su/embed/tv/${id}/${s}/${e}`, direct_playable: true, is_embed: true },
          { name: "VidJoy Cinema", title: `Server 6 • VidJoy Cinema (S${s}:E${e})`, quality: "1080p HD", url: `https://vidjoy.pro/embed/tv/${id}/${s}/${e}`, browser_url: `https://vidjoy.pro/embed/tv/${id}/${s}/${e}`, direct_playable: true, is_embed: true },
          { name: "2Embed Multi-Server", title: `Server 7 • 2Embed 1080p Full HD (S${s}:E${e})`, quality: "1080p Full HD", url: `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`, browser_url: `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`, direct_playable: true, is_embed: true }
        );
      } else {
        streams.push(
          { name: "VidLink Pro", title: `Server 1 • ${cleanTitle} - 1080p Ultra HD`, quality: "1080p Ultra HD", url: `https://vidlink.pro/movie/${id}?primaryColor=EAB308`, browser_url: `https://vidlink.pro/movie/${id}?primaryColor=EAB308`, direct_playable: true, is_embed: true },
          { name: "NexStream VIP", title: `Server 2 • ${cleanTitle} - NexStream VIP 1080p`, quality: "1080p Ultra HD", url: `https://api.codespecters.com/embed/movie/${id}?apikey=${nexKey}`, browser_url: `https://api.codespecters.com/embed/movie/${id}?apikey=${nexKey}`, direct_playable: true, is_embed: true },
          { name: "AutoEmbed Cloud", title: `Server 3 • ${cleanTitle} - 1080p High-Speed`, quality: "1080p HD", url: `https://autoembed.co/movie/imdb/${id}`, browser_url: `https://autoembed.co/movie/imdb/${id}`, direct_playable: true, is_embed: true },
          { name: "VidSrc PM", title: `Server 4 • ${cleanTitle} - VidSrc Dedicated`, quality: "1080p HD", url: `https://vidsrc.pm/embed/movie/${id}`, browser_url: `https://vidsrc.pm/embed/movie/${id}`, direct_playable: true, is_embed: true },
          { name: "VidSrc SU", title: `Server 5 • ${cleanTitle} - VidSrc High-Speed`, quality: "1080p HD", url: `https://vidsrc.su/embed/movie/${id}`, browser_url: `https://vidsrc.su/embed/movie/${id}`, direct_playable: true, is_embed: true },
          { name: "VidJoy Cinema", title: `Server 6 • ${cleanTitle} - VidJoy HD`, quality: "1080p HD", url: `https://vidjoy.pro/embed/movie/${id}`, browser_url: `https://vidjoy.pro/embed/movie/${id}`, direct_playable: true, is_embed: true },
          { name: "2Embed Multi-Server", title: `Server 7 • ${cleanTitle} - 1080p Full HD`, quality: "1080p Full HD", url: `https://www.2embed.cc/embed/${id}`, browser_url: `https://www.2embed.cc/embed/${id}`, direct_playable: true, is_embed: true }
        );
      }
      return { streams };
    });
    return data || { streams: [] };
  }

  // =========================================================================
  // NAVBAR SCROLL & SEARCH EVENTS
  // =========================================================================
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Header search box: first click/focus jumps straight to the search section.
  let searchOpenedOnce = false;
  function openSearchFromHeader() {
    if (!searchOpenedOnce) {
      searchOpenedOnce = true;
      openDedicatedSearch(searchInput ? searchInput.value.trim() : '');
      if (dedicatedSearchInput) dedicatedSearchInput.focus();
    }
  }
  function resetSearchOpened() {
    searchOpenedOnce = false;
  }

  if (searchBox) {
    searchBox.addEventListener('pointerdown', openSearchFromHeader);
    searchBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openSearchFromHeader();
    });
  }
  if (searchInput) {
    searchInput.addEventListener('focus', openSearchFromHeader);
    searchInput.addEventListener('click', openSearchFromHeader);
  }

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    clearSearchBtn.style.display = query ? 'flex' : 'none';
    if (dedicatedSearchInput) dedicatedSearchInput.value = query;
    if (dedicatedClearBtn) dedicatedClearBtn.style.display = query ? 'flex' : 'none';

    if (searchTimeout) clearTimeout(searchTimeout);
    if (searchView.style.display === 'block') {
      if (query) {
        searchTimeout = setTimeout(() => executeSearchQuery(query), 240);
      } else {
        renderRecommendationsInSearch();
      }
    }
  });

  clearSearchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    if (dedicatedSearchInput) dedicatedSearchInput.value = '';
    if (dedicatedClearBtn) dedicatedClearBtn.style.display = 'none';
    renderRecommendationsInSearch();
  });

  // Dedicated Search Bar in Separate Search Page
  if (dedicatedSearchInput) {
    dedicatedSearchInput.addEventListener('input', () => {
      const query = dedicatedSearchInput.value.trim();
      dedicatedClearBtn.style.display = query ? 'flex' : 'none';
      if (searchInput) searchInput.value = query;
      if (clearSearchBtn) clearSearchBtn.style.display = query ? 'flex' : 'none';

      if (searchTimeout) clearTimeout(searchTimeout);
      if (!query) {
        renderRecommendationsInSearch();
        return;
      }

      searchTimeout = setTimeout(() => {
        executeSearchQuery(query);
      }, 240);
    });
  }

  if (dedicatedClearBtn) {
    dedicatedClearBtn.addEventListener('click', () => {
      dedicatedSearchInput.value = '';
      dedicatedClearBtn.style.display = 'none';
      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      renderRecommendationsInSearch();
      dedicatedSearchInput.focus();
    });
  }

  // Global '/' keyboard shortcut to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && document.activeElement !== dedicatedSearchInput) {
      e.preventDefault();
      openDedicatedSearch('');
      if (dedicatedSearchInput) dedicatedSearchInput.focus();
    }
  });

  // Reset the header-search jump when navigating back via nav pills or logo.
  allNavButtons.forEach(btn => {
    btn.addEventListener('click', resetSearchOpened);
  });
  const logoLink = document.getElementById('logo-link');
  if (logoLink) logoLink.addEventListener('click', resetSearchOpened);

  // =========================================================================
  // SEPARATE DEDICATED SEARCH PAGE WITH PRE-SEARCH RECOMMENDATIONS
  // =========================================================================
  function openDedicatedSearch(query = '') {
    // Hide billboard, OTT section, home shelves, watchlist, settings
    hideAllViews();
    searchView.style.display = 'block';

    // No Search tab in the nav anymore; clear active nav state on search.
    allNavButtons.forEach(b => b.classList.remove('active'));

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (query) {
      executeSearchQuery(query);
    } else {
      renderRecommendationsInSearch();
    }
  }

  function closeSearchView() {
    showHomeViews();
  }

  // Display Curated Recommendations When Search Is Empty (Like Real OTT Apps)
  async function renderRecommendationsInSearch() {
    searchResultsHeading.textContent = 'Recommended for You';
    if (searchSubheading) {
      searchSubheading.textContent = 'Trending movies and shows across Netflix, Prime Video, Disney+ Hotstar, Crunchyroll, and Paramount+';
    }
    searchCountBadge.textContent = 'Curated picks';

    if (filterState.platform !== 'all') {
      const pName = getPlatformDisplayName(filterState.platform);
      const titles = (OTT_DATA[filterState.platform] && OTT_DATA[filterState.platform].length > 0)
        ? OTT_DATA[filterState.platform]
        : (await fetchOttCatalog(filterState.platform, filterState.type, 200));
      searchResultsHeading.textContent = `${pName} Universe`;
      if (searchSubheading) {
        searchSubheading.textContent = `All ${titles.length}+ movies & TV series streaming on ${pName} via TMDb`;
      }
      renderCardGridWithFilters(titles);
    } else {
      let pool = cachedCatalogPool;
      if (pool.length < 50) {
        pool = await fetchOttCatalog('all', filterState.type, 200);
      }
      renderCardGridWithFilters(pool);
    }
  }

  async function executeSearchQuery(query) {
    searchResultsHeading.textContent = `Search results for "${query}"`;
    if (searchSubheading) {
      searchSubheading.textContent = 'Real-time results matching your query across all streaming platforms';
    }
    searchCountBadge.textContent = 'Searching...';
    searchGrid.innerHTML = '<div class="shelf-loader"><div class="joy-spinner"></div><span>Searching Joywatch universe...</span></div>';

    try {
      const data = await fetchSearch(query);
      const items = data.items || [];
      renderCardGridWithFilters(items, true);
    } catch (err) {
      searchGrid.innerHTML = `<div class="shelf-loader"><span>Search error: ${err.message}</span></div>`;
    }
  }

  function renderCardGridWithFilters(items, isSearchQuery = false) {
    let filtered = items.filter(item => {
      // Platform Filter
      if (filterState.platform !== 'all') {
        const platformItems = OTT_DATA[filterState.platform] || [];
        const isPlatformMatch = item.platform === filterState.platform || platformItems.some(p => p.id === item.id || p.name.toLowerCase() === item.name.toLowerCase());
        if (!isPlatformMatch) return false;
      }

      // Type Filter
      if (filterState.type !== 'all') {
        if (filterState.type === 'movie' && item.type === 'series') return false;
        if (filterState.type === 'series' && item.type !== 'series') return false;
      }

      // Genre Filter
      if (filterState.genre !== 'all') {
        const itemGenres = (item.genres || []).map(g => g.toLowerCase());
        if (!itemGenres.some(g => g.includes(filterState.genre.toLowerCase()))) {
          return false;
        }
      }

      // Year Filter
      if (filterState.year !== 'all') {
        const itemYear = parseInt(item.year) || 0;
        if (filterState.year === '2026' && itemYear !== 2026) return false;
        if (filterState.year === '2025' && itemYear !== 2025) return false;
        if (filterState.year === '2024' && itemYear !== 2024) return false;
        if (filterState.year === 'classic' && (itemYear >= 2024 || itemYear === 0)) return false;
      }

      // Rating Filter
      if (filterState.rating !== 'all') {
        const r = parseFloat(item.imdbRating) || 0;
        const minRating = parseFloat(filterState.rating) || 7.0;
        if (r < minRating) return false;
      }

      return true;
    });

    searchGrid.innerHTML = '';
    searchCountBadge.textContent = `${filtered.length} titles`;

    if (filtered.length === 0) {
      searchGrid.innerHTML = `<div class="shelf-loader"><span>No titles found matching current filters. Try selecting "All" or a different keyword.</span></div>`;
      return;
    }

    filtered.forEach(item => {
      searchGrid.appendChild(createCardElement(item));
    });
  }

  function getPlatformDisplayName(key) {
    switch (key) {
      case 'netflix': return 'Netflix';
      case 'prime': return 'Prime Video';
      case 'disney': return 'Disney+ Hotstar';
      case 'crunchyroll': return 'Crunchyroll';
      case 'paramount': return 'Paramount+';
      default: return 'All Platforms';
    }
  }

  // Setup Search Filter Buttons
  function initFilterButtons() {
    // OTT Platform Filter in Search
    document.querySelectorAll('#ott-filters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#ott-filters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterState.platform = btn.dataset.ott || 'all';
        applyCurrentFilters();
      });
    });

    // Type Filter
    document.querySelectorAll('#type-filters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#type-filters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterState.type = btn.dataset.type || 'all';
        applyCurrentFilters();
      });
    });

    // Genre Filter
    document.querySelectorAll('#genre-filters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#genre-filters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterState.genre = btn.dataset.genre || 'all';
        applyCurrentFilters();
      });
    });

    // Year Filter
    document.querySelectorAll('#year-filters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#year-filters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterState.year = btn.dataset.year || 'all';
        applyCurrentFilters();
      });
    });

    // Rating Filter
    document.querySelectorAll('#rating-filters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#rating-filters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterState.rating = btn.dataset.rating || 'all';
        applyCurrentFilters();
      });
    });
  }

  function applyCurrentFilters() {
    const q = (dedicatedSearchInput ? dedicatedSearchInput.value.trim() : '') || (searchInput ? searchInput.value.trim() : '');
    if (q) {
      executeSearchQuery(q);
    } else {
      renderRecommendationsInSearch();
    }
  }

  initFilterButtons();

  // =========================================================================
  // HOMEPAGE OTT PLATFORMS SELECTOR STRIP
  // =========================================================================
  const ottButtons = document.querySelectorAll('.ott-card-btn');
  ottButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedOtt = btn.dataset.ott || 'all';
      ottButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (selectedOtt === 'all') {
        initHomeCatalog('all');
      } else {
        renderFilteredOttHomeShelves(selectedOtt);
      }
    });
  });

  async function renderFilteredOttHomeShelves(platformKey) {
    const platformName = getPlatformDisplayName(platformKey);
    rowsContainer.innerHTML = '<div class="shelf-loader"><div class="joy-spinner"></div><span>Arranging ' + platformName + ' universe via TMDb...</span></div>';

    const titles = (OTT_DATA[platformKey] && OTT_DATA[platformKey].length > 0)
      ? OTT_DATA[platformKey]
      : (await fetchOttCatalog(platformKey, 'all', 200));

    rowsContainer.innerHTML = '';
    if (!titles || titles.length === 0) {
      rowsContainer.innerHTML = `<div class="shelf-loader"><span>No titles found for ${platformName}.</span></div>`;
      return;
    }

    // Set billboard to the top title of the selected OTT platform
    setBillboard(titles[0]);

    // Shelf 1: Trending on Platform (Top 35 titles)
    const trending = titles.slice(0, 35);
    const platformShelf = createRowElement(`Trending on ${platformName}`, trending, platformKey);
    if (platformShelf) rowsContainer.appendChild(platformShelf);

    // Shelf 2: Feature Films & Blockbusters
    const movieMatches = titles.filter(t => t.type === 'movie');
    if (movieMatches.length > 0) {
      const row = createRowElement(`${platformName} Feature Films & Blockbusters`, movieMatches, platformKey);
      if (row) rowsContainer.appendChild(row);
    }

    // Shelf 3: Binge-Worthy TV Series
    const seriesMatches = titles.filter(t => t.type === 'series');
    if (seriesMatches.length > 0) {
      const row = createRowElement(`${platformName} Binge-Worthy TV Series`, seriesMatches, platformKey);
      if (row) rowsContainer.appendChild(row);
    }

    // Shelf 4: Top Rated (IMDb 7.8+)
    const topRated = titles.filter(t => parseFloat(t.imdbRating) >= 7.8);
    if (topRated.length > 0) {
      const row = createRowElement(`Top Rated on ${platformName} (IMDb 8.0+)`, topRated, platformKey);
      if (row) rowsContainer.appendChild(row);
    }

    // Shelf 5: Curated Signature Platform Genre
    let signatureTitles = [];
    let signatureTitle = '';
    if (platformKey === 'crunchyroll') {
      signatureTitle = 'Crunchyroll Anime Hits & Shonen Masterpieces';
      signatureTitles = titles.filter(t => (t.genres || []).some(g => ['Animation', 'Action', 'Fantasy'].includes(g)));
    } else if (platformKey === 'disney') {
      signatureTitle = 'Disney+ Hotstar: Marvel, Star Wars & Family Adventures';
      signatureTitles = titles.filter(t => (t.genres || []).some(g => ['Action', 'Adventure', 'Animation', 'Family', 'Sci-Fi'].includes(g)));
    } else if (platformKey === 'netflix') {
      signatureTitle = 'Netflix Originals, Thrillers & Dramas';
      signatureTitles = titles.filter(t => (t.genres || []).some(g => ['Drama', 'Thriller', 'Crime', 'Mystery'].includes(g)));
    } else if (platformKey === 'prime') {
      signatureTitle = 'Prime Video Action & Suspense Thrillers';
      signatureTitles = titles.filter(t => (t.genres || []).some(g => ['Action', 'Thriller', 'Crime', 'Sci-Fi'].includes(g)));
    } else if (platformKey === 'paramount') {
      signatureTitle = 'Paramount+ Action & Sci-Fi Universe';
      signatureTitles = titles.filter(t => (t.genres || []).some(g => ['Action', 'Sci-Fi', 'Adventure', 'Western'].includes(g)));
    }

    if (signatureTitles.length > 0) {
      const sigRow = createRowElement(signatureTitle, signatureTitles, platformKey);
      if (sigRow) rowsContainer.appendChild(sigRow);
    }

    // Shelf 6: Complete Platform Catalog (All 160-212 Titles!)
    const completeRow = createRowElement(`Complete ${platformName} Catalog (${titles.length} Titles)`, titles, platformKey);
    if (completeRow) rowsContainer.appendChild(completeRow);

    // Shelf 7: More Recommended Discoveries
    const recommendations = cachedCatalogPool.filter(c => c.platform !== platformKey).slice(0, 20);
    if (recommendations.length > 0) {
      const recRow = createRowElement(`More Recommended Discoveries`, recommendations);
      if (recRow) rowsContainer.appendChild(recRow);
    }
  }

  // =========================================================================
  // NAVIGATION & VIEWS
  // =========================================================================
  allNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      if (!filter) return;

      allNavButtons.forEach(b => {
        if (b.dataset.filter === filter) b.classList.add('active');
        else b.classList.remove('active');
      });

      handleFilterChange(filter);
    });
  });

  // Shared helper for mutually-exclusive top-level views.
  function hideAllViews() {
    if (mylistView) mylistView.style.display = 'none';
    if (settingsView) settingsView.style.display = 'none';
    if (sectionView) sectionView.style.display = 'none';
    if (livetvView) livetvView.style.display = 'none';
    searchView.style.display = 'none';
    billboard.style.display = 'none';
    if (ottSection) ottSection.style.display = 'none';
    rowsContainer.style.display = 'none';
  }

  function showHomeViews() {
    if (mylistView) mylistView.style.display = 'none';
    if (settingsView) settingsView.style.display = 'none';
    if (sectionView) sectionView.style.display = 'none';
    if (livetvView) livetvView.style.display = 'none';
    searchView.style.display = 'none';
    billboard.style.display = 'flex';
    if (ottSection) ottSection.style.display = 'flex';
    rowsContainer.style.display = 'flex';
  }

  function handleFilterChange(filter) {
    if (videoPlayer && videoPlayer.classList.contains('open')) {
      closeVideoPlayer();
    }
    if (filter === 'mylist') {
      hideAllViews();
      if (mylistView) mylistView.style.display = 'block';
      renderMyListView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (filter === 'settings') {
      hideAllViews();
      if (settingsView) settingsView.style.display = 'block';
      renderSettingsView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (filter === 'livetv') {
      hideAllViews();
      if (livetvView) livetvView.style.display = 'block';
      renderLiveTvView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showHomeViews();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      initHomeCatalog(filter);
    }
  }

  function renderMyListView() {
    if (!mylistView) return;
    updateLibraryCounters();

    if (libTabWatchlist && libTabHistory) {
      if (activeLibraryTab === 'history') {
        libTabWatchlist.classList.remove('active');
        libTabWatchlist.setAttribute('aria-selected', 'false');
        libTabHistory.classList.add('active');
        libTabHistory.setAttribute('aria-selected', 'true');
      } else {
        libTabWatchlist.classList.add('active');
        libTabWatchlist.setAttribute('aria-selected', 'true');
        libTabHistory.classList.remove('active');
        libTabHistory.setAttribute('aria-selected', 'false');
      }
    }

    mylistGrid.innerHTML = '';

    if (activeLibraryTab === 'history') {
      let recent = [];
      if (hasPlaybackEngine()) {
        try {
          recent = window.JoywatchProgress.listRecent(50);
        } catch (e) { recent = []; }
      }
      if (mylistCountBadge) mylistCountBadge.textContent = `${recent.length} watched`;
      if (libClearHistoryBtn) libClearHistoryBtn.style.display = recent.length > 0 ? 'inline-flex' : 'none';

      if (recent.length === 0) {
        mylistEmpty.style.display = 'flex';
        mylistGrid.style.display = 'none';
        if (mylistEmptyTitle) mylistEmptyTitle.textContent = 'No watch history yet';
        if (mylistEmptySubtext) mylistEmptySubtext.textContent = 'Titles you start watching will appear here with your watch progress.';
        if (mylistEmptyIcon) mylistEmptyIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
      } else {
        mylistEmpty.style.display = 'none';
        mylistGrid.style.display = 'grid';
        recent.forEach(e => {
          const item = {
            id: String(e.mediaId),
            name: e.title || 'Untitled',
            poster: e.poster || '',
            background: e.poster || '',
            year: e.year || '2025',
            type: e.type || 'movie',
            imdbRating: '8.8',
            _progress: e,
            _isHistory: true
          };
          mylistGrid.appendChild(createCardElement(item));
        });
      }
    } else {
      const list = getJoyList();
      if (mylistCountBadge) mylistCountBadge.textContent = `${list.length} saved`;
      if (libClearHistoryBtn) libClearHistoryBtn.style.display = 'none';

      if (list.length === 0) {
        mylistEmpty.style.display = 'flex';
        mylistGrid.style.display = 'none';
        if (mylistEmptyTitle) mylistEmptyTitle.textContent = 'Your Watchlist is empty';
        if (mylistEmptySubtext) mylistEmptySubtext.textContent = 'Bookmark movies and TV series you want to watch later by clicking "+ My List" on any title.';
        if (mylistEmptyIcon) mylistEmptyIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>';
      } else {
        mylistEmpty.style.display = 'none';
        mylistGrid.style.display = 'grid';
        list.forEach(item => {
          mylistGrid.appendChild(createCardElement(item));
        });
      }
    }
  }

  if (libTabWatchlist && !libTabWatchlist.dataset.wired) {
    libTabWatchlist.dataset.wired = '1';
    libTabWatchlist.addEventListener('click', () => {
      activeLibraryTab = 'watchlist';
      renderMyListView();
    });
  }
  if (libTabHistory && !libTabHistory.dataset.wired) {
    libTabHistory.dataset.wired = '1';
    libTabHistory.addEventListener('click', () => {
      activeLibraryTab = 'history';
      renderMyListView();
    });
  }
  if (libClearHistoryBtn && !libClearHistoryBtn.dataset.wired) {
    libClearHistoryBtn.dataset.wired = '1';
    libClearHistoryBtn.addEventListener('click', () => {
      if (!window.confirm('Clear all watch history and progress entries?')) return;
      try {
        if (hasPlaybackEngine()) window.JoywatchProgress.clearStore();
        if (hasSettingsEngine()) window.JoywatchSettings.clearServerPrefs();
        renderMyListView();
        showToast('Watch history cleared');
      } catch (e) { showToast('Could not clear history'); }
    });
  }

  if (browseCatalogBtn) {
    browseCatalogBtn.addEventListener('click', () => {
      allNavButtons.forEach(b => {
        if (b.dataset.filter === 'all') b.classList.add('active');
        else b.classList.remove('active');
      });
      handleFilterChange('all');
    });
  }

  // =========================================================================
  // SETTINGS VIEW (Appearance, Servers, Preferences, Data)
  // =========================================================================
  function renderSettingsView() {
    if (!settingsView || !hasSettingsEngine()) return;
    renderThemeSwatches();
    renderServerRows();
    renderSettingsToggles();
    wireSettingsDataButtons();
  }

  function renderThemeSwatches() {
    if (!themeGrid) return;
    themeGrid.innerHTML = '';
    const settings = window.JoywatchSettings.getAll();
    window.JoywatchSettings.THEMES.forEach(theme => {
      const btn = document.createElement('button');
      btn.className = `theme-swatch ${settings.theme === theme.id ? 'active' : ''}`;
      const dotColor = (theme.vars && theme.vars['--joy-accent']) ? theme.vars['--joy-accent'] : '#EAB308';
      const dotBg = theme.id === 'slate' ? '#0F172A' : dotColor;
      btn.innerHTML = `
        <span class="theme-swatch-dot" style="background-color: ${dotBg};"></span>
        <span>${theme.name}</span>
      `;
      btn.title = `Use the ${theme.name} theme`;
      btn.addEventListener('click', () => {
        try {
          const current = window.JoywatchSettings.getAll();
          current.theme = theme.id;
          window.JoywatchSettings.setAll(current);
          window.JoywatchSettings.applyTheme(theme.id);
          renderThemeSwatches();
          showToast(`${theme.name} theme applied`);
        } catch (e) { /* theme change is cosmetic only */ }
      });
      themeGrid.appendChild(btn);
    });
  }

  function renderServerRows() {
    if (!serverList) return;
    serverList.innerHTML = '';
    const settings = window.JoywatchSettings.getAll();
    const order = settings.serverOrder || [];
    let prefs = {};
    try { prefs = window.JoywatchSettings.getServerPrefs(); } catch (e) { prefs = {}; }

    const rememberedIds = {};
    Object.keys(prefs).forEach(k => { rememberedIds[prefs[k]] = true; });

    order.forEach((providerId, pos) => {
      const displayName = window.JoywatchSettings.SERVER_DISPLAY_NAMES[providerId] || providerId;
      const isHidden = !!(settings.hiddenServers && settings.hiddenServers[providerId]);
      const isFavorite = !!(settings.favoriteServers && settings.favoriteServers[providerId]);
      const isRemembered = !!rememberedIds[providerId];

      const row = document.createElement('div');
      row.className = `server-row ${isFavorite ? 'favorite' : ''} ${isHidden ? 'hidden-server' : ''}`;
      row.innerHTML = `
        <span class="server-row-label">
          <span class="server-row-name">${pos + 1}. ${displayName}</span>
          ${isRemembered ? '<span class="server-memory-badge">Remembered</span>' : ''}
        </span>
      `;

      const moveUp = document.createElement('button');
      moveUp.className = 'server-btn';
      moveUp.title = `Move ${displayName} up`;
      moveUp.setAttribute('aria-label', `Move ${displayName} up`);
      moveUp.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>';
      moveUp.addEventListener('click', () => { moveServer(providerId, -1); });
      row.appendChild(moveUp);

      const moveDown = document.createElement('button');
      moveDown.className = 'server-btn';
      moveDown.title = `Move ${displayName} down`;
      moveDown.setAttribute('aria-label', `Move ${displayName} down`);
      moveDown.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>';
      moveDown.addEventListener('click', () => { moveServer(providerId, 1); });
      row.appendChild(moveDown);

      const fav = document.createElement('button');
      fav.className = `server-btn ${isFavorite ? 'active-state' : ''}`;
      fav.title = isFavorite ? `Unpin ${displayName}` : `Pin ${displayName} to top`;
      fav.setAttribute('aria-label', fav.title);
      fav.setAttribute('aria-pressed', isFavorite ? 'true' : 'false');
      fav.innerHTML = `<svg viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      fav.addEventListener('click', () => {
        try {
          const s = window.JoywatchSettings.getAll();
          if (s.favoriteServers[providerId]) delete s.favoriteServers[providerId];
          else s.favoriteServers[providerId] = true;
          window.JoywatchSettings.setAll(s);
          renderServerRows();
          showToast(isFavorite ? `${displayName} unpinned` : `${displayName} pinned to top`);
        } catch (e) { /* best-effort */ }
      });
      row.appendChild(fav);

      const vis = document.createElement('button');
      vis.className = `server-btn ${isHidden ? '' : 'active-state'}`;
      vis.title = isHidden ? `Show ${displayName}` : `Hide ${displayName}`;
      vis.setAttribute('aria-label', vis.title);
      vis.setAttribute('aria-pressed', isHidden ? 'false' : 'true');
      vis.innerHTML = isHidden
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
      vis.addEventListener('click', () => {
        try {
          const s = window.JoywatchSettings.getAll();
          if (s.hiddenServers[providerId]) delete s.hiddenServers[providerId];
          else s.hiddenServers[providerId] = true;
          window.JoywatchSettings.setAll(s);
          renderServerRows();
          showToast(isHidden ? `${displayName} shown` : `${displayName} hidden`);
        } catch (e) { /* best-effort */ }
      });
      row.appendChild(vis);

      serverList.appendChild(row);
    });

    const note = document.createElement('p');
    note.className = 'settings-note';
    note.textContent = 'Order and visibility apply to the Servers panel in the player. Titles you already watched keep the server you last chose for them.';
    serverList.appendChild(note);
  }

  function moveServer(providerId, dir) {
    try {
      const s = window.JoywatchSettings.getAll();
      const idx = s.serverOrder.indexOf(providerId);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= s.serverOrder.length) return;
      const tmp = s.serverOrder[idx];
      s.serverOrder[idx] = s.serverOrder[swap];
      s.serverOrder[swap] = tmp;
      window.JoywatchSettings.setAll(s);
      renderServerRows();
    } catch (e) { /* best-effort */ }
  }

  function renderSettingsToggles() {
    if (!hasSettingsEngine()) return;
    const settings = window.JoywatchSettings.getAll();
    document.querySelectorAll('.settings-toggle[data-toggle]').forEach(btn => {
      const key = btn.getAttribute('data-toggle');
      const on = !!settings[key];
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
      btn.onclick = () => {
        try {
          const s = window.JoywatchSettings.getAll();
          s[key] = !s[key];
          window.JoywatchSettings.setAll(s);
          applySettingsToggles();
          renderSettingsToggles();
          showToast(key === 'reducedMotion'
            ? (s[key] ? 'Reduced motion on' : 'Reduced motion off')
            : (s[key] ? 'Autoplay next episode on' : 'Autoplay next episode off'));
        } catch (e) { /* best-effort */ }
      };
    });
  }

  function applySettingsToggles() {
    if (!hasSettingsEngine()) return;
    try {
      const s = window.JoywatchSettings.getAll();
      document.documentElement.classList.toggle('reduce-motion', !!s.reducedMotion);
    } catch (e) { /* cosmetic only */ }
  }

  function wireSettingsDataButtons() {
    if (exportBackupBtn && !exportBackupBtn.dataset.wired) {
      exportBackupBtn.dataset.wired = '1';
      exportBackupBtn.addEventListener('click', () => {
        try {
          let recentProgress = [];
          if (hasPlaybackEngine()) {
            try { recentProgress = window.JoywatchProgress.listRecent(500); } catch (e) { recentProgress = []; }
          }
          let currentSettings = {};
          if (hasSettingsEngine()) {
            try { currentSettings = window.JoywatchSettings.getAll(); } catch (e) { currentSettings = {}; }
          }
          let serverPrefs = {};
          if (hasSettingsEngine()) {
            try { serverPrefs = window.JoywatchSettings.getServerPrefs(); } catch (e) { serverPrefs = {}; }
          }

          const backupData = {
            app: 'joywatch',
            version: 1,
            exportedAt: new Date().toISOString(),
            joywatch_list: getJoyList(),
            joywatch_progress_v1: recentProgress,
            joywatch_settings_v1: currentSettings,
            joywatch_server_pref_v1: serverPrefs
          };

          const jsonStr = JSON.stringify(backupData, null, 2);
          const blob = new Blob([jsonStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const dateStr = new Date().toISOString().slice(0, 10);
          a.href = url;
          a.download = `joywatch-backup-${dateStr}.json`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 100);
          showToast('Library and settings backup exported');
        } catch (e) {
          showToast('Could not export backup');
        }
      });
    }

    if (importBackupBtn && importBackupFile && !importBackupBtn.dataset.wired) {
      importBackupBtn.dataset.wired = '1';
      importBackupBtn.addEventListener('click', () => {
        importBackupFile.value = '';
        importBackupFile.click();
      });

      importBackupFile.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (!data || typeof data !== 'object') throw new Error('Invalid JSON');

            // 1. Restore Watchlist
            if (Array.isArray(data.joywatch_list)) {
              localStorage.setItem('joywatch_list', JSON.stringify(data.joywatch_list));
              updateJoylistCounter();
            }

            // 2. Restore Watch Progress
            if (data.joywatch_progress_v1) {
              let progressMap = {};
              if (Array.isArray(data.joywatch_progress_v1)) {
                data.joywatch_progress_v1.forEach(entry => {
                  if (entry && entry.mediaId) {
                    const key = `${entry.type || 'movie'}:${entry.mediaId}:${entry.season || 0}:${entry.episode || 0}`;
                    progressMap[key] = entry;
                  }
                });
              } else if (typeof data.joywatch_progress_v1 === 'object') {
                progressMap = data.joywatch_progress_v1;
              }
              localStorage.setItem('joywatch_progress_v1', JSON.stringify(progressMap));
            }

            // 3. Restore Settings
            if (data.joywatch_settings_v1 && hasSettingsEngine()) {
              window.JoywatchSettings.setAll(data.joywatch_settings_v1);
              window.JoywatchSettings.applyTheme(data.joywatch_settings_v1.theme || 'obsidian');
            }

            // 4. Restore Server Preferences
            if (data.joywatch_server_pref_v1) {
              localStorage.setItem('joywatch_server_pref_v1', JSON.stringify(data.joywatch_server_pref_v1));
            }

            applySettingsToggles();
            renderSettingsView();
            showToast('Backup restored successfully');
          } catch (err) {
            showToast('Could not restore backup: invalid file');
          }
        };
        reader.readAsText(file);
      });
    }

    if (clearHistoryBtn && !clearHistoryBtn.dataset.wired) {
      clearHistoryBtn.dataset.wired = '1';
      clearHistoryBtn.addEventListener('click', () => {
        if (!window.confirm('Clear all watch history and Continue Watching entries?')) return;
        try {
          if (hasPlaybackEngine()) window.JoywatchProgress.clearStore();
          if (typeof window.JoywatchSettings !== 'undefined') window.JoywatchSettings.clearServerPrefs();
          showToast('Watch history cleared');
        } catch (e) { showToast('Could not clear history'); }
      });
    }
    if (resetSettingsBtn && !resetSettingsBtn.dataset.wired) {
      resetSettingsBtn.dataset.wired = '1';
      resetSettingsBtn.addEventListener('click', () => {
        if (!window.confirm('Reset all settings to defaults?')) return;
        try {
          window.JoywatchSettings.reset();
          window.JoywatchSettings.applyTheme(window.JoywatchSettings.DEFAULT_THEME_ID);
          applySettingsToggles();
          renderSettingsView();
          showToast('Settings reset to defaults');
        } catch (e) { showToast('Could not reset settings'); }
      });
    }
  }

  // Apply persisted theme + toggles at startup.
  (function applyPersistedSettings() {
    if (!hasSettingsEngine()) return;
    try {
      const s = window.JoywatchSettings.getAll();
      window.JoywatchSettings.applyTheme(s.theme);
      document.documentElement.classList.toggle('reduce-motion', !!s.reducedMotion);
    } catch (e) { /* startup cosmetics are best-effort */ }
  })();

  // =========================================================================
  // MOVIE CARDS (2:3 Aspect Ratio, Rounded Corners, Hover Overlay)
  // =========================================================================
  function createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    // Always prioritize official canonical IMDb movie poster
    let poster = item.poster;
    if ((!poster || poster.includes('unsplash.com')) && item.id && item.id.startsWith('tt')) {
      poster = `https://images.metahub.space/poster/medium/${item.id}/img`;
    }
    if (!poster) {
      poster = (item.id && item.id.startsWith('tt'))
        ? `https://images.metahub.space/poster/medium/${item.id}/img`
        : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="210" height="315" viewBox="0 0 210 315"><rect width="210" height="315" fill="%2317140B"/></svg>';
    }
    const rating = item.imdbRating || '8.4';
    const year = item.year || '2025';
    const mediaType = item.type === 'series' ? 'TV Series' : 'Movie';

    card.innerHTML = `
      <div class="card-poster-wrapper">
        <img class="card-poster" src="${poster}" alt="${item.name}" loading="lazy" onload="this.classList.add('loaded')" onerror="if (!this.dataset.triedFallback && '${item.id}'.startsWith('tt')) { this.dataset.triedFallback = '1'; this.src = 'https://images.metahub.space/poster/medium/${item.id}/img'; } else { this.classList.add('loaded'); }">
        
        <div class="card-top-pill">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#EAB308">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>${rating}</span>
        </div>

        <div class="card-hover-overlay">
          <button class="overlay-center-play" title="Watch Now" aria-label="Watch Now">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
          </button>
          <div class="overlay-bottom-info">
            <span class="overlay-title">${item.name}</span>
            <div class="overlay-subline">
              <span>IMDb ${rating}</span>
              <span>•</span>
              <span>${year}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card-meta-box">
        <div class="card-title">${item.name}</div>
        <div class="card-subline">
          <span>${year}</span>
          <span>•</span>
          <span>${mediaType}</span>
        </div>
      </div>
    `;

    const posterWrapper = card.querySelector('.card-poster-wrapper');
    if (item._isMasterpiece) {
      card.classList.add('masterpiece-card');
      const mb = document.createElement('span');
      mb.className = 'card-masterpiece-badge';
      mb.textContent = 'Masterpiece';
      if (posterWrapper) posterWrapper.appendChild(mb);
    }
    if (item._matchScore) {
      const mp = document.createElement('span');
      mp.className = 'card-match-pill';
      mp.innerHTML = `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>${item._matchScore}</span>`;
      if (posterWrapper) posterWrapper.appendChild(mp);
    }
    if (item._recReason) {
      const metaBox = card.querySelector('.card-meta-box');
      if (metaBox) {
        const rr = document.createElement('div');
        rr.className = 'card-rec-reason';
        rr.textContent = item._recReason;
        metaBox.appendChild(rr);
      }
    }

    // Continue Watching & Watch History affordances:
    // Progress rail, Watched badge, and quick Dismiss / Remove button
    if (item._progress) {
      try {
        const wrapper = card.querySelector('.card-poster-wrapper');
        if (item._progress.completed) {
          const badge = document.createElement('div');
          badge.className = 'card-status-badge';
          badge.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Watched</span>';
          if (wrapper) wrapper.appendChild(badge);
        } else if (typeof item._progress.currentTime === 'number') {
          const rail = document.createElement('div');
          rail.className = 'card-progress-rail';
          const fill = document.createElement('div');
          fill.className = 'card-progress-fill';
          const dur = item._progress.duration > 0 ? item._progress.duration : 0;
          const pct = dur > 0
            ? Math.min(100, Math.max(0, (item._progress.currentTime / dur) * 100))
            : 0;
          fill.style.width = pct + '%';
          rail.appendChild(fill);
          if (wrapper) wrapper.appendChild(rail);
        }

        // Dismiss button: removes entry from stored progress
        const dismissBtn = document.createElement('button');
        dismissBtn.className = 'card-dismiss-btn';
        dismissBtn.title = item._isHistory ? 'Remove from history' : 'Remove from Continue Watching';
        dismissBtn.setAttribute('aria-label', dismissBtn.title);
        dismissBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        dismissBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (hasPlaybackEngine()) {
            window.JoywatchProgress.removeEntry(
              item._progress.mediaId, item._progress.type, item._progress.season, item._progress.episode
            );
          }
          card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            if (card.parentNode) {
              const parentTrack = card.closest('.shelf-cards-track');
              card.remove();
              if (parentTrack && parentTrack.children.length === 0) {
                const parentRow = parentTrack.closest('.media-shelf-row');
                if (parentRow) parentRow.remove();
              }
            }
            if (mylistView && mylistView.style.display !== 'none') {
              renderMyListView();
            }
          }, 200);
          showToast(item._isHistory ? 'Removed from history' : 'Removed from Continue Watching');
        });
        if (wrapper) wrapper.appendChild(dismissBtn);
      } catch (e) { /* progress rail is cosmetic only */ }
    }

    card.addEventListener('click', () => openDetailModal(item));

    const playBtn = card.querySelector('.overlay-center-play');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDetailModal(item, true);
      });
    }

    return card;
  }

  // Horizontal Track Drag-to-Scroll Momentum
  function attachSmoothDragScroll(track) {
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;
    let hasMoved = false;

    track.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      hasMoved = false;
      startX = e.pageX;
      scrollStart = track.scrollLeft;
      track.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 6) {
        hasMoved = true;
        track.scrollLeft = scrollStart - dx;
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        track.classList.remove('is-dragging');
        setTimeout(() => { hasMoved = false; }, 60);
      }
    });

    track.addEventListener('click', (e) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  // =========================================================================
  // DEDICATED SECTION VIEW & SHELF ROUTING (See All)
  // =========================================================================
  function openSectionView(title, items, options = {}) {
    hideAllViews();
    if (sectionView) sectionView.style.display = 'block';

    allNavButtons.forEach(b => b.classList.remove('active'));

    const count = (items && items.length) ? items.length : 0;
    if (sectionTitleEl) sectionTitleEl.textContent = title;
    if (sectionSubtitleEl) {
      sectionSubtitleEl.textContent = options.subtitle || `Complete collection of ${count} titles in this section.`;
    }
    if (sectionBadgeEl) {
      sectionBadgeEl.textContent = options.badge || 'Collection';
    }
    if (sectionCountBadgeEl) {
      sectionCountBadgeEl.textContent = `${count} ${count === 1 ? 'Title' : 'Titles'}`;
    }

    if (sectionGrid) {
      sectionGrid.innerHTML = '';
      if (items && items.length > 0) {
        items.forEach(item => {
          sectionGrid.appendChild(createCardElement(item));
        });
      } else {
        sectionGrid.innerHTML = '<div class="shelf-loader"><span>No titles found in this section.</span></div>';
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeSectionView() {
    if (sectionView) sectionView.style.display = 'none';
    showHomeViews();
    allNavButtons.forEach(b => {
      if (b.dataset.filter === 'all') b.classList.add('active');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (sectionBackBtn && !sectionBackBtn.dataset.wired) {
    sectionBackBtn.dataset.wired = '1';
    sectionBackBtn.addEventListener('click', closeSectionView);
  }

  function openShelfSection(title, items, filterCategory = null) {
    if (filterCategory === 'watchlist' || title.toLowerCase().includes('watchlist')) {
      activeLibraryTab = 'watchlist';
      allNavButtons.forEach(b => {
        if (b.dataset.filter === 'mylist') b.classList.add('active');
        else b.classList.remove('active');
      });
      handleFilterChange('mylist');
      return;
    }

    if (filterCategory === 'continue_watching' || title.toLowerCase().includes('continue watching')) {
      activeLibraryTab = 'history';
      allNavButtons.forEach(b => {
        if (b.dataset.filter === 'mylist') b.classList.add('active');
        else b.classList.remove('active');
      });
      handleFilterChange('mylist');
      return;
    }

    let badge = 'Collection';
    let subtitle = `Complete collection of ${items ? items.length : 0} titles in this section.`;
    let targetItems = items || [];

    if (filterCategory === 'masterpiece' || title.toLowerCase().includes('masterpiece')) {
      badge = 'Hall of Fame • Certified 9.5+';
      subtitle = 'The highest-rated cinematic triumphs in world history with verified scores of 9.5 and above.';
      targetItems = MASTERPIECES_DATA;
    } else if (filterCategory === 'netflix' || filterCategory === 'prime' || filterCategory === 'disney' || filterCategory === 'crunchyroll' || filterCategory === 'paramount') {
      const pName = getPlatformDisplayName(filterCategory);
      badge = `${pName} Catalog`;
      subtitle = `Explore all verified movies and series streaming on ${pName} via TMDb.`;
      if (OTT_DATA[filterCategory] && OTT_DATA[filterCategory].length > 0) {
        targetItems = OTT_DATA[filterCategory];
      }
    } else if (filterCategory === 'series' || title.toLowerCase().includes('tv shows')) {
      badge = 'Binge-Worthy Series';
      subtitle = 'Top-rated television series, prestige dramas, and serialized epics.';
    } else if (filterCategory === 'Animation' || filterCategory === 'anime' || title.toLowerCase().includes('anime')) {
      badge = 'Animation & Anime';
      subtitle = 'Acclaimed animated masterworks, shonen sagas, and visual wonders.';
    } else if (filterCategory === 'Action') {
      badge = 'Action Collection';
      subtitle = 'High-octane thrill rides, martial arts combat, and pulse-pounding spectacles.';
    } else if (filterCategory === 'Sci-Fi') {
      badge = 'Sci-Fi Universe';
      subtitle = 'Futuristic epics, space exploration, dystopian sagas, and cyberpunk realities.';
    } else if (filterCategory === 'Thriller') {
      badge = 'Thrillers & Mystery';
      subtitle = 'Mind-bending plots, psychological tension, neo-noir, and detective mysteries.';
    } else if (filterCategory === 'trending' || title.toLowerCase().includes('trending')) {
      badge = 'Trending Worldwide';
      subtitle = 'The most popular feature films and blockbusters streaming globally right now.';
    } else if (filterCategory === 'top_rated') {
      badge = 'Certified 8.5+';
      subtitle = 'Critically acclaimed masterworks with IMDb scores of 8.5 and above.';
    }

    openSectionView(title, targetItems, { badge, subtitle });
  }

  // Create Horizontal Shelf Row
  function createRowElement(title, items, filterCategory = null) {
    if (!items || items.length === 0) return null;

    const row = document.createElement('div');
    row.className = 'shelf-row';

    const rowHeader = document.createElement('div');
    rowHeader.className = 'shelf-header';
    rowHeader.innerHTML = `
      <div class="shelf-title-group">
        <h2 class="shelf-title">${title}</h2>
        <button class="shelf-see-all" title="View all in ${title}">
          <span>See All</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      <div class="shelf-nav-controls">
        <button class="shelf-arrow-btn arrow-left" title="Scroll left" aria-label="Scroll left">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button class="shelf-arrow-btn arrow-right" title="Scroll right" aria-label="Scroll right">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;

    const track = document.createElement('div');
    track.className = 'shelf-cards-track';

    items.forEach(item => {
      track.appendChild(createCardElement(item));
    });

    attachSmoothDragScroll(track);

    const leftBtn = rowHeader.querySelector('.arrow-left');
    const rightBtn = rowHeader.querySelector('.arrow-right');
    leftBtn.addEventListener('click', () => {
      const step = Math.max(300, track.clientWidth * 0.75);
      track.scrollBy({ left: -step, behavior: 'smooth' });
    });
    rightBtn.addEventListener('click', () => {
      const step = Math.max(300, track.clientWidth * 0.75);
      track.scrollBy({ left: step, behavior: 'smooth' });
    });

    const seeAllBtn = rowHeader.querySelector('.shelf-see-all');
    seeAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openShelfSection(title, items, filterCategory);
    });

    row.appendChild(rowHeader);
    row.appendChild(track);
    return row;
  }

  // =========================================================================
  // HALL OF FAME MASTERPIECES (IMDb 9.5+)
  // =========================================================================
  const MASTERPIECES_DATA = [
    {
      id: 'tt0111161',
      name: 'The Shawshank Redemption',
      poster: 'https://images.metahub.space/poster/medium/tt0111161/img',
      background: 'https://images.metahub.space/background/medium/tt0111161/img',
      year: '1994',
      type: 'movie',
      imdbRating: '9.8',
      genres: ['Drama', 'Hope'],
      description: 'Over the course of several years, two convicts form a friendship, seeking solace and eventual redemption through basic compassion.',
      _isMasterpiece: true
    },
    {
      id: 'tt0068646',
      name: 'The Godfather',
      poster: 'https://images.metahub.space/poster/medium/tt0068646/img',
      background: 'https://images.metahub.space/background/medium/tt0068646/img',
      year: '1972',
      type: 'movie',
      imdbRating: '9.6',
      genres: ['Crime', 'Drama'],
      description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.',
      _isMasterpiece: true
    },
    {
      id: 'tt0468569',
      name: 'The Dark Knight',
      poster: 'https://images.metahub.space/poster/medium/tt0468569/img',
      background: 'https://images.metahub.space/background/medium/tt0468569/img',
      year: '2008',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Action', 'Crime', 'Drama'],
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      _isMasterpiece: true
    },
    {
      id: 'tt0050083',
      name: '12 Angry Men',
      poster: 'https://images.metahub.space/poster/medium/tt0050083/img',
      background: 'https://images.metahub.space/background/medium/tt0050083/img',
      year: '1957',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Crime', 'Drama'],
      description: 'The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to more carefully consider the evidence before jumping to a hasty verdict.',
      _isMasterpiece: true
    },
    {
      id: 'tt0108052',
      name: "Schindler's List",
      poster: 'https://images.metahub.space/poster/medium/tt0108052/img',
      background: 'https://images.metahub.space/background/medium/tt0108052/img',
      year: '1993',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Biography', 'Drama', 'History'],
      description: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
      _isMasterpiece: true
    },
    {
      id: 'tt0167260',
      name: 'The Lord of the Rings: The Return of the King',
      poster: 'https://images.metahub.space/poster/medium/tt0167260/img',
      background: 'https://images.metahub.space/background/medium/tt0167260/img',
      year: '2003',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Action', 'Adventure', 'Drama'],
      description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.',
      _isMasterpiece: true
    },
    {
      id: 'tt0110912',
      name: 'Pulp Fiction',
      poster: 'https://images.metahub.space/poster/medium/tt0110912/img',
      background: 'https://images.metahub.space/background/medium/tt0110912/img',
      year: '1994',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Crime', 'Drama'],
      description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
      _isMasterpiece: true
    },
    {
      id: 'tt0071562',
      name: 'The Godfather Part II',
      poster: 'https://images.metahub.space/poster/medium/tt0071562/img',
      background: 'https://images.metahub.space/background/medium/tt0071562/img',
      year: '1974',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Crime', 'Drama'],
      description: 'The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.',
      _isMasterpiece: true
    },
    {
      id: 'tt0120737',
      name: 'The Lord of the Rings: The Fellowship of the Ring',
      poster: 'https://images.metahub.space/poster/medium/tt0120737/img',
      background: 'https://images.metahub.space/background/medium/tt0120737/img',
      year: '2001',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Action', 'Adventure', 'Drama'],
      description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
      _isMasterpiece: true
    },
    {
      id: 'tt0137523',
      name: 'Fight Club',
      poster: 'https://images.metahub.space/poster/medium/tt0137523/img',
      background: 'https://images.metahub.space/background/medium/tt0137523/img',
      year: '1999',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Drama'],
      description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
      _isMasterpiece: true
    },
    {
      id: 'tt0109830',
      name: 'Forrest Gump',
      poster: 'https://images.metahub.space/poster/medium/tt0109830/img',
      background: 'https://images.metahub.space/background/medium/tt0109830/img',
      year: '1994',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Drama', 'Romance'],
      description: 'The history of the United States from the 1950s to the \'70s unfolds from the perspective of an Alabama man with an IQ of 75.',
      _isMasterpiece: true
    },
    {
      id: 'tt0060196',
      name: 'The Good, the Bad and the Ugly',
      poster: 'https://images.metahub.space/poster/medium/tt0060196/img',
      background: 'https://images.metahub.space/background/medium/tt0060196/img',
      year: '1966',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Adventure', 'Western'],
      description: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.',
      _isMasterpiece: true
    },
    {
      id: 'tt0167261',
      name: 'The Lord of the Rings: The Two Towers',
      poster: 'https://images.metahub.space/poster/medium/tt0167261/img',
      background: 'https://images.metahub.space/background/medium/tt0167261/img',
      year: '2002',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Action', 'Adventure', 'Drama'],
      description: 'While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron\'s new ally, Saruman.',
      _isMasterpiece: true
    },
    {
      id: 'tt0133093',
      name: 'The Matrix',
      poster: 'https://images.metahub.space/poster/medium/tt0133093/img',
      background: 'https://images.metahub.space/background/medium/tt0133093/img',
      year: '1999',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Action', 'Sci-Fi'],
      description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
      _isMasterpiece: true
    },
    {
      id: 'tt0099685',
      name: 'Goodfellas',
      poster: 'https://images.metahub.space/poster/medium/tt0099685/img',
      background: 'https://images.metahub.space/background/medium/tt0099685/img',
      year: '1990',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Biography', 'Crime', 'Drama'],
      description: 'The story of Henry Hill and his life in the mafia, covering his relationship with his wife Karen and his mob partners Jimmy Conway and Tommy DeVito.',
      _isMasterpiece: true
    },
    {
      id: 'tt0080684',
      name: 'Star Wars: Episode V - The Empire Strikes Back',
      poster: 'https://images.metahub.space/poster/medium/tt0080684/img',
      background: 'https://images.metahub.space/background/medium/tt0080684/img',
      year: '1980',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Action', 'Adventure', 'Fantasy'],
      description: 'After the Empire overpowers the Rebel Alliance, Luke Skywalker begins his Jedi training with Yoda, while his friends are pursued across the galaxy by Darth Vader.',
      _isMasterpiece: true
    },
    {
      id: 'tt0073486',
      name: 'One Flew Over the Cuckoo\'s Nest',
      poster: 'https://images.metahub.space/poster/medium/tt0073486/img',
      background: 'https://images.metahub.space/background/medium/tt0073486/img',
      year: '1975',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Drama'],
      description: 'In the Fall of 1963, a Korean War veteran and criminal pleads insanity and is admitted to a mental institution, where he rallies the scared patients against the tyrannical nurse.',
      _isMasterpiece: true
    },
    {
      id: 'tt0047478',
      name: 'Seven Samurai',
      poster: 'https://images.metahub.space/poster/medium/tt0047478/img',
      background: 'https://images.metahub.space/background/medium/tt0047478/img',
      year: '1954',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Action', 'Drama'],
      description: 'Farmers from a village exploited by bandits hire a veteran samurai for protection, who gathers six other samurai to join him.',
      _isMasterpiece: true
    },
    {
      id: 'tt0245429',
      name: 'Spirited Away',
      poster: 'https://images.metahub.space/poster/medium/tt0245429/img',
      background: 'https://images.metahub.space/background/medium/tt0245429/img',
      year: '2001',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Animation', 'Adventure', 'Family'],
      description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, a world where humans are changed into beasts.',
      _isMasterpiece: true
    },
    {
      id: 'tt0120815',
      name: 'Saving Private Ryan',
      poster: 'https://images.metahub.space/poster/medium/tt0120815/img',
      background: 'https://images.metahub.space/background/medium/tt0120815/img',
      year: '1998',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Drama', 'War'],
      description: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.',
      _isMasterpiece: true
    },
    {
      id: 'tt0120689',
      name: 'The Green Mile',
      poster: 'https://images.metahub.space/poster/medium/tt0120689/img',
      background: 'https://images.metahub.space/background/medium/tt0120689/img',
      year: '1999',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Crime', 'Drama', 'Fantasy'],
      description: 'A tale set on death row in a Southern prison, where gentle giant John Coffey possesses the mysterious power to heal people\'s ailments and touch souls.',
      _isMasterpiece: true
    },
    {
      id: 'tt6751668',
      name: 'Parasite',
      poster: 'https://images.metahub.space/poster/medium/tt6751668/img',
      background: 'https://images.metahub.space/background/medium/tt6751668/img',
      year: '2019',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Drama', 'Thriller'],
      description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
      _isMasterpiece: true
    },
    {
      id: 'tt0110413',
      name: 'Léon: The Professional',
      poster: 'https://images.metahub.space/poster/medium/tt0110413/img',
      background: 'https://images.metahub.space/background/medium/tt0110413/img',
      year: '1994',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Action', 'Crime', 'Drama'],
      description: '12-year-old Mathilda is reluctantly taken in by Léon, a professional assassin, after her family is murdered by an unhinged DEA agent.',
      _isMasterpiece: true
    },
    {
      id: 'tt0172495',
      name: 'Gladiator',
      poster: 'https://images.metahub.space/poster/medium/tt0172495/img',
      background: 'https://images.metahub.space/background/medium/tt0172495/img',
      year: '2000',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Action', 'Adventure', 'Drama'],
      description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
      _isMasterpiece: true
    },
    {
      id: 'tt0482499',
      name: 'The Prestige',
      poster: 'https://images.metahub.space/poster/medium/tt0482499/img',
      background: 'https://images.metahub.space/background/medium/tt0482499/img',
      year: '2006',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Drama', 'Mystery', 'Sci-Fi'],
      description: 'After a tragic accident, two stage magicians in 1890s London engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.',
      _isMasterpiece: true
    },
    {
      id: 'tt2582802',
      name: 'Whiplash',
      poster: 'https://images.metahub.space/poster/medium/tt2582802/img',
      background: 'https://images.metahub.space/background/medium/tt2582802/img',
      year: '2014',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Drama', 'Music'],
      description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student\'s potential.',
      _isMasterpiece: true
    },
    {
      id: 'tt0407887',
      name: 'The Departed',
      poster: 'https://images.metahub.space/poster/medium/tt0407887/img',
      background: 'https://images.metahub.space/background/medium/tt0407887/img',
      year: '2006',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Crime', 'Drama', 'Thriller'],
      description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.',
      _isMasterpiece: true
    },
    {
      id: 'tt0078788',
      name: 'Apocalypse Now',
      poster: 'https://images.metahub.space/poster/medium/tt0078788/img',
      background: 'https://images.metahub.space/background/medium/tt0078788/img',
      year: '1979',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Drama', 'Mystery', 'War'],
      description: 'A U.S. Army officer serving in Vietnam is tasked with assassinating a renegade Special Forces Colonel who sees himself as a god.',
      _isMasterpiece: true
    },
    {
      id: 'tt0034583',
      name: 'Casablanca',
      poster: 'https://images.metahub.space/poster/medium/tt0034583/img',
      background: 'https://images.metahub.space/background/medium/tt0034583/img',
      year: '1942',
      type: 'movie',
      imdbRating: '9.5',
      genres: ['Drama', 'Romance', 'War'],
      description: 'A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.',
      _isMasterpiece: true
    }
  ];

  function createMasterpiecesShelf() {
    return createRowElement('Masterpieces • Rated 9.5 & Above', MASTERPIECES_DATA, 'masterpiece');
  }

  // =========================================================================
  // SMART RECOMMENDATION TASTE ENGINE
  // =========================================================================
  const TASTE_SEEDS = {
    dune: {
      id: 'dune',
      title: 'Dune: Part Two',
      recommendations: [
        {
          id: 'tt1856101',
          name: 'Blade Runner 2049',
          poster: 'https://images.metahub.space/poster/medium/tt1856101/img',
          background: 'https://images.metahub.space/background/medium/tt1856101/img',
          year: '2017',
          type: 'movie',
          imdbRating: '8.5',
          genres: ['Neo-Noir', 'Sci-Fi'],
          description: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.',
          _matchScore: '99% Match',
          _recReason: 'Matches director Denis Villeneuve’s vast atmosphere & worldbuilding'
        },
        {
          id: 'tt0816692',
          name: 'Interstellar',
          poster: 'https://images.metahub.space/poster/medium/tt0816692/img',
          background: 'https://images.metahub.space/background/medium/tt0816692/img',
          year: '2014',
          type: 'movie',
          imdbRating: '8.7',
          genres: ['Sci-Fi', 'Space Drama'],
          description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
          _matchScore: '97% Match',
          _recReason: 'Shares towering Hans Zimmer symphonies & awe-inspiring cosmic scale'
        },
        {
          id: 'tt2543164',
          name: 'Arrival',
          poster: 'https://images.metahub.space/poster/medium/tt2543164/img',
          background: 'https://images.metahub.space/background/medium/tt2543164/img',
          year: '2016',
          type: 'movie',
          imdbRating: '8.0',
          genres: ['Sci-Fi', 'Mystery'],
          description: 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.',
          _matchScore: '96% Match',
          _recReason: 'Profound atmospheric extraterrestrial contact and temporal narrative'
        },
        {
          id: 'tt0206634',
          name: 'Children of Men',
          poster: 'https://images.metahub.space/poster/medium/tt0206634/img',
          background: 'https://images.metahub.space/background/medium/tt0206634/img',
          year: '2006',
          type: 'movie',
          imdbRating: '8.0',
          genres: ['Sci-Fi', 'Thriller'],
          description: 'In 2027, in a chaotic world in which women have become somehow infertile, a former activist agrees to help transport a miraculously pregnant woman to a sanctuary at sea.',
          _matchScore: '93% Match',
          _recReason: 'Visceral camera choreography and bleak, believable dystopian survival'
        },
        {
          id: 'tt1392190',
          name: 'Mad Max: Fury Road',
          poster: 'https://images.metahub.space/poster/medium/tt1392190/img',
          background: 'https://images.metahub.space/background/medium/tt1392190/img',
          year: '2015',
          type: 'movie',
          imdbRating: '8.1',
          genres: ['Action', 'Desert Odyssey'],
          description: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.',
          _matchScore: '91% Match',
          _recReason: 'Desert wasteland survival, practical kinetic effects & relentless momentum'
        }
      ]
    },
    darkknight: {
      id: 'darkknight',
      title: 'The Dark Knight',
      recommendations: [
        {
          id: 'tt1877830',
          name: 'The Batman',
          poster: 'https://images.metahub.space/poster/medium/tt1877830/img',
          background: 'https://images.metahub.space/background/medium/tt1877830/img',
          year: '2022',
          type: 'movie',
          imdbRating: '8.0',
          genres: ['Crime', 'Neo-Noir'],
          description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption.',
          _matchScore: '98% Match',
          _recReason: 'Gritty detective investigation, rainfall-drenched Gotham & institutional rot'
        },
        {
          id: 'tt0113277',
          name: 'Heat',
          poster: 'https://images.metahub.space/poster/medium/tt0113277/img',
          background: 'https://images.metahub.space/background/medium/tt0113277/img',
          year: '1995',
          type: 'movie',
          imdbRating: '8.3',
          genres: ['Crime', 'Heist'],
          description: 'A group of high-end professional thieves start to feel the heat from the LAPD when a robbery goes awry.',
          _matchScore: '96% Match',
          _recReason: 'Christopher Nolan’s explicit cinematic blueprint for Gotham\'s heist duel'
        },
        {
          id: 'tt0114369',
          name: 'Se7en',
          poster: 'https://images.metahub.space/poster/medium/tt0114369/img',
          background: 'https://images.metahub.space/background/medium/tt0114369/img',
          year: '1995',
          type: 'movie',
          imdbRating: '8.6',
          genres: ['Crime', 'Psychological'],
          description: 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.',
          _matchScore: '94% Match',
          _recReason: 'Relentless grim investigation matching Joker’s philosophical nihilism'
        },
        {
          id: 'tt1375666',
          name: 'Inception',
          poster: 'https://images.metahub.space/poster/medium/tt1375666/img',
          background: 'https://images.metahub.space/background/medium/tt1375666/img',
          year: '2010',
          type: 'movie',
          imdbRating: '8.8',
          genres: ['Sci-Fi', 'Action'],
          description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
          _matchScore: '93% Match',
          _recReason: 'Signature Christopher Nolan puzzle-box structure and towering tension'
        }
      ]
    },
    interstellar: {
      id: 'interstellar',
      title: 'Interstellar',
      recommendations: [
        {
          id: 'tt0118884',
          name: 'Contact',
          poster: 'https://images.metahub.space/poster/medium/tt0118884/img',
          background: 'https://images.metahub.space/background/medium/tt0118884/img',
          year: '1997',
          type: 'movie',
          imdbRating: '7.5',
          genres: ['Sci-Fi', 'Drama'],
          description: 'Dr. Ellie Arroway, after years of searching, finds conclusive radio proof of extraterrestrial intelligence.',
          _matchScore: '98% Match',
          _recReason: 'Emotional core grounded in human love against the terrifying infinity of space'
        },
        {
          id: 'tt3659388',
          name: 'The Martian',
          poster: 'https://images.metahub.space/poster/medium/tt3659388/img',
          background: 'https://images.metahub.space/background/medium/tt3659388/img',
          year: '2015',
          type: 'movie',
          imdbRating: '8.0',
          genres: ['Sci-Fi', 'Adventure'],
          description: 'An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth.',
          _matchScore: '95% Match',
          _recReason: 'Scientific optimism, Martian planetary survival, and triumphant orbital physics'
        },
        {
          id: 'tt0062622',
          name: '2001: A Space Odyssey',
          poster: 'https://images.metahub.space/poster/medium/tt0062622/img',
          background: 'https://images.metahub.space/background/medium/tt0062622/img',
          year: '1968',
          type: 'movie',
          imdbRating: '8.3',
          genres: ['Sci-Fi', 'Mystery'],
          description: 'After uncovering a mysterious artifact buried beneath the Lunar surface, a spacecraft is sent to Jupiter to find its origins.',
          _matchScore: '94% Match',
          _recReason: 'The definitive philosophical space journey and forefather to Interstellar’s tesseract'
        }
      ]
    },
    oppenheimer: {
      id: 'oppenheimer',
      title: 'Oppenheimer',
      recommendations: [
        {
          id: 'tt2084970',
          name: 'The Imitation Game',
          poster: 'https://images.metahub.space/poster/medium/tt2084970/img',
          background: 'https://images.metahub.space/background/medium/tt2084970/img',
          year: '2014',
          type: 'movie',
          imdbRating: '8.0',
          genres: ['Biography', 'War Drama'],
          description: 'During World War II, the English mathematical genius Alan Turing tries to crack the German Enigma code with help from fellow mathematicians.',
          _matchScore: '98% Match',
          _recReason: 'Wartime mathematical brilliance, top-secret isolation & state betrayal'
        },
        {
          id: 'tt0469494',
          name: 'There Will Be Blood',
          poster: 'https://images.metahub.space/poster/medium/tt0469494/img',
          background: 'https://images.metahub.space/background/medium/tt0469494/img',
          year: '2007',
          type: 'movie',
          imdbRating: '8.2',
          genres: ['Drama', 'Historical'],
          description: 'A story of family, religion, hatred, oil and madness, focusing on a turn-of-the-century prospector in the early days of the business.',
          _matchScore: '94% Match',
          _recReason: 'Relentless monomaniacal ambition and the brutal birth of a modern superpower'
        },
        {
          id: 'tt0268978',
          name: 'A Beautiful Mind',
          poster: 'https://images.metahub.space/poster/medium/tt0268978/img',
          background: 'https://images.metahub.space/background/medium/tt0268978/img',
          year: '2001',
          type: 'movie',
          imdbRating: '8.2',
          genres: ['Biography', 'Drama'],
          description: 'After John Nash, a brilliant but asocial mathematician, accepts secret work in cryptography, his life takes a turn for the nightmarish.',
          _matchScore: '92% Match',
          _recReason: 'The burden of genius, psychological breakdown, and government cryptography'
        }
      ]
    }
  };

  let activeTasteSeed = 'dune';

  function createRecommendedShelf() {
    const row = document.createElement('div');
    row.className = 'shelf-row taste-shelf-wrapper';

    const rowHeader = document.createElement('div');
    rowHeader.className = 'shelf-header';
    rowHeader.style.flexDirection = 'column';
    rowHeader.style.alignItems = 'flex-start';
    rowHeader.style.gap = '8px';

    const titleGroup = document.createElement('div');
    titleGroup.className = 'shelf-title-group';
    titleGroup.innerHTML = `
      <h2 class="shelf-title">Recommended For You</h2>
      <span class="hero-chip chip-match" style="font-size: 0.72rem; padding: 2px 10px;">Smart Taste Engine</span>
      <button class="shelf-see-all" id="rec-see-all-btn" title="View all recommendations">
        <span>See All</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    `;

    const recSeeAll = titleGroup.querySelector('.shelf-see-all');
    if (recSeeAll) {
      recSeeAll.addEventListener('click', (e) => {
        e.stopPropagation();
        const activeSeed = TASTE_SEEDS[activeTasteSeed] || TASTE_SEEDS.dune;
        openSectionView(`Recommended for You • Based on ${activeSeed.title}`, activeSeed.recommendations, {
          badge: 'Smart Taste Engine',
          subtitle: `Curated cinematic recommendations derived from your watch affinity for ${activeSeed.title}.`
        });
      });
    }

    const chipsRow = document.createElement('div');
    chipsRow.className = 'taste-chips-row';
    chipsRow.innerHTML = '<span class="taste-label">Based on what you watched:</span>';

    const seedKeys = Object.keys(TASTE_SEEDS);
    seedKeys.forEach(k => {
      const s = TASTE_SEEDS[k];
      const chip = document.createElement('button');
      chip.className = `taste-chip ${k === activeTasteSeed ? 'active' : ''}`;
      chip.innerHTML = `
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span>${s.title}</span>
      `;
      chip.addEventListener('click', () => {
        activeTasteSeed = k;
        chipsRow.querySelectorAll('.taste-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderTasteRecommendations(track);
      });
      chipsRow.appendChild(chip);
    });

    rowHeader.appendChild(titleGroup);
    rowHeader.appendChild(chipsRow);

    const track = document.createElement('div');
    track.className = 'shelf-cards-track';

    renderTasteRecommendations(track);
    attachSmoothDragScroll(track);

    row.appendChild(rowHeader);
    row.appendChild(track);
    return row;
  }

  function renderTasteRecommendations(track) {
    track.innerHTML = '';
    const active = TASTE_SEEDS[activeTasteSeed] || TASTE_SEEDS.dune;
    active.recommendations.forEach(item => {
      track.appendChild(createCardElement(item));
    });
  }

  // =========================================================================
  // FEATURED HERO BILLBOARD
  // =========================================================================
  function setBillboard(item) {
    if (!item) return;
    currentFeaturedItem = item;

    const bg = item.background || item.poster;
    billboardBg.style.opacity = '0';
    setTimeout(() => {
      billboardBg.style.backgroundImage = `url('${bg}')`;
      billboardBg.style.opacity = '1';
    }, 180);

    billboardTitle.textContent = item.name;
    billboardRating.textContent = item.imdbRating || '8.4';
    billboardYear.textContent = item.year || '2026';
    billboardMatch.textContent = `${Math.floor(Math.random() * 4) + 96}% Match`;
    billboardGenres.textContent = (item.genres && item.genres.length > 0) ? item.genres.slice(0, 3).join(' • ') : 'Action • Sci-Fi';
    billboardRuntime.textContent = item.type === 'series' ? 'TV Series' : '2h 14m';
    billboardSynopsis.textContent = item.description || 'Watch the latest critically acclaimed cinematic releases, high-stakes thrills, and stunning visuals with instant high-speed streaming on Joywatch.';

    updateHeroMyListBtn(isInJoyList(item.id));
  }

  billboardPlayBtn.addEventListener('click', () => {
    if (currentFeaturedItem) openDetailModal(currentFeaturedItem, true);
  });

  billboardInfoBtn.addEventListener('click', () => {
    if (currentFeaturedItem) openDetailModal(currentFeaturedItem);
  });

  billboardMyListBtn.addEventListener('click', () => {
    if (currentFeaturedItem) toggleJoyList(currentFeaturedItem);
  });

  // =========================================================================
  // CINEMATIC DETAIL MODAL (About, Synopsis, Cast, You May Also Like)
  // =========================================================================
  async function openDetailModal(item, autoPlay = false) {
    if (isModalAnimating) return;
    activeModalItem = item;

    detailModal.style.display = 'flex';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        detailModal.classList.add('open');
      });
    });
    document.body.style.overflow = 'hidden';

    modalTitle.textContent = item.name;
    const bg = item.background || item.poster;
    modalBanner.style.backgroundImage = `url('${bg}')`;
    modalPosterImg.src = item.poster || bg;
    modalMatch.textContent = `${Math.floor(Math.random() * 4) + 96}% Match`;
    modalRating.textContent = item.imdbRating || '8.4';
    modalYear.textContent = item.year || '2026';
    modalRuntime.textContent = item.type === 'series' ? 'TV Series' : '2h 14m';
    modalGenres.textContent = (item.genres && item.genres.length > 0) ? item.genres.slice(0, 3).join(', ') : 'Drama, Action';
    modalType.textContent = item.type === 'series' ? 'TV Series' : 'Feature Film';
    modalHeroSynopsis.textContent = item.description || 'Loading story overview...';
    modalSynopsis.textContent = item.description || 'Loading story overview...';

    updateMyListBtn(isInJoyList(item.id));
    episodesSection.style.display = 'none';
    modalCastList.innerHTML = '';
    modalRelatedShelf.innerHTML = '';

    try {
      const metaData = await fetchMeta(item.type || 'movie', item.id);
      const meta = metaData.meta || {};

      if (meta.description) {
        modalSynopsis.textContent = meta.description;
        modalHeroSynopsis.textContent = meta.description;
      }
      if (meta.background) {
        modalBanner.style.backgroundImage = `url('${meta.background}')`;
      }
      if (meta.poster) {
        modalPosterImg.src = meta.poster;
      }
      if (meta.runtime) {
        modalRuntime.textContent = meta.runtime;
      }

      // Populate Cast Members
      if (meta.cast && Array.isArray(meta.cast) && meta.cast.length > 0) {
        modalCastSection.style.display = 'flex';
        modalCastList.innerHTML = '';
        meta.cast.slice(0, 6).forEach(actor => {
          const chip = document.createElement('div');
          chip.className = 'actor-chip';
          const initial = actor.trim().charAt(0).toUpperCase();
          chip.innerHTML = `
            <div class="actor-avatar-letter">${initial}</div>
            <span>${actor}</span>
          `;
          modalCastList.appendChild(chip);
        });
      } else {
        modalCastSection.style.display = 'none';
      }

      // TV Series Episodes
      if (item.type === 'series' && meta.videos && meta.videos.length > 0) {
        setupEpisodes(meta.videos);
      }

      // Populate "You May Also Like"
      populateRelatedTitles(item);

      // Pre-load streams silently. Continue Watching cards carry their
      // stored season/episode on item._progress — resume that episode,
      // not S1E1.
      const resumeSeason = (item._progress && item._progress.season) || 1;
      const resumeEpisode = (item._progress && item._progress.episode) || 1;
      loadStreams(item.type || 'movie', item.id, resumeSeason, resumeEpisode, autoPlay);
    } catch (err) {
      console.error('Error fetching details:', err);
    }
  }

  function populateRelatedTitles(currentItem) {
    modalRelatedShelf.innerHTML = '';
    const pool = cachedCatalogPool.filter(c => c.id !== currentItem.id);
    const related = pool.slice(0, 6);

    if (related.length === 0) {
      modalRelatedSection.style.display = 'none';
      return;
    }

    modalRelatedSection.style.display = 'flex';
    related.forEach(rel => {
      modalRelatedShelf.appendChild(createCardElement(rel));
    });
  }

  function closeDetailModal() {
    if (!detailModal.classList.contains('open') || isModalAnimating) return;
    isModalAnimating = true;
    detailModal.classList.remove('open');

    setTimeout(() => {
      detailModal.style.display = 'none';
      document.body.style.overflow = 'auto';
      isModalAnimating = false;
    }, 320);
  }

  modalCloseBtn.addEventListener('click', closeDetailModal);
  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) closeDetailModal();
  });

  modalMyListBtn.addEventListener('click', () => {
    if (activeModalItem) toggleJoyList(activeModalItem);
  });

  function setupEpisodes(videos) {
    episodesSection.style.display = 'flex';
    const seasonsMap = {};
    videos.forEach(v => {
      const s = v.season || 1;
      if (!seasonsMap[s]) seasonsMap[s] = [];
      seasonsMap[s].push(v);
    });

    seasonSelect.innerHTML = '';
    const seasonNums = Object.keys(seasonsMap).sort((a, b) => Number(a) - Number(b));
    seasonNums.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = `Season ${s} (${seasonsMap[s].length} Episodes)`;
      seasonSelect.appendChild(opt);
    });

    seasonSelect.onchange = () => renderSeasonEpisodes(seasonsMap[seasonSelect.value]);
    renderSeasonEpisodes(seasonsMap[seasonNums[0]]);
  }

  function renderSeasonEpisodes(episodes) {
    episodesList.innerHTML = '';
    const currentSeasonNum = parseInt(seasonSelect ? seasonSelect.value : 1, 10) || 1;
    episodes.forEach(ep => {
      const btn = document.createElement('button');
      btn.className = 'episode-btn';
      const num = ep.episode || 1;
      const s = ep.season || currentSeasonNum;

      let entry = null;
      if (hasPlaybackEngine() && activeModalItem && activeModalItem.id) {
        try {
          entry = window.JoywatchProgress.getEntry(activeModalItem.id, 'series', s, num);
        } catch (e) { entry = null; }
      }

      if (entry && entry.completed) {
        btn.classList.add('completed');
        btn.innerHTML = `<span>Episode ${num}</span><span class="episode-btn-check"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg></span>`;
        btn.title = `Episode ${num} (Watched)`;
      } else if (entry && entry.currentTime > 0) {
        btn.classList.add('in-progress');
        const dur = entry.duration > 0 ? entry.duration : 0;
        const pct = dur > 0 ? Math.min(100, Math.max(0, (entry.currentTime / dur) * 100)) : 0;
        btn.innerHTML = `<span>Episode ${num}</span><div class="episode-progress-rail"><div class="episode-progress-fill" style="width: ${pct}%"></div></div>`;
        btn.title = `Episode ${num} (Resumes at ${window.JoywatchProgress.formatClock(entry.currentTime)})`;
      } else {
        btn.textContent = `Episode ${num}`;
      }

      btn.addEventListener('click', () => {
        episodesList.querySelectorAll('.episode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadStreams(activeModalItem.type, activeModalItem.id, s, num, true);
      });

      episodesList.appendChild(btn);
    });
  }

  // =========================================================================
  // STREAMING & DIRECT IN-BROWSER VIDEO PLAYER
  // =========================================================================
  async function loadStreams(type, id, season = 1, episode = 1, autoPlay = false) {
    activeSeason = parseInt(season, 10) || 1;
    activeEpisode = parseInt(episode, 10) || 1;
    try {
      const itemTitle = activeModalItem ? (activeModalItem.name || '') : '';
      const data = await fetchStreams(type, id, itemTitle, season, episode);
      const rawStreams = data.streams || [];
      const playableStreams = rawStreams.filter(s => s.direct_playable || s.is_embed || s.browser_url);

      if (playableStreams.length > 0) {
        activeModalStreams = playableStreams;
        applyServerPreferences();
      } else {
        const directUrl = type === 'series'
          ? `https://vidlink.pro/tv/${id}/${season}/${episode}`
          : `https://vidlink.pro/movie/${id}`;
        activeModalStreams = [{
          name: 'VidLink Fast Cloud',
          title: 'Server 1 (VidLink)',
          quality: '1080p Ultra HD',
          url: directUrl,
          browser_url: directUrl,
          is_embed: true,
          direct_playable: true
        }];
      }

      if (videoPlayer && videoPlayer.classList.contains('open')) {
        renderPlayerServerPills(currentServerIndex);
      }

      if (autoPlay && activeModalStreams.length > 0) {
        const preferred = resolvePreferredIndex();
        const useIndex = preferred >= 0 ? preferred : 0;
        const stream = activeModalStreams[useIndex];
        const playUrl = stream.browser_url || stream.url;
        if (playUrl) {
          launchVideoPlayer(playUrl, itemTitle || 'Movie', `${serverLabelFor(stream, useIndex)} • ${stream.quality || '1080p'}`, stream.is_embed, useIndex);
        }
      }
    } catch (e) {
      const directUrl = type === 'series'
        ? `https://vidlink.pro/tv/${id}/${season}/${episode}`
        : `https://vidlink.pro/movie/${id}`;
      activeModalStreams = [{
        name: 'VidLink Fast Cloud',
        title: 'Server 1 (VidLink)',
        quality: '1080p Ultra HD',
        url: directUrl,
        browser_url: directUrl,
        is_embed: true,
        direct_playable: true
      }];
    }
  }

  modalPlayBtn.addEventListener('click', () => {
    const itemTitle = activeModalItem ? activeModalItem.name : 'Movie';
    const preferred = resolvePreferredIndex();
    const useIndex = preferred >= 0 ? preferred : 0;
    const stream = activeModalStreams[useIndex] ||
      activeModalStreams.find(s => s.direct_playable || s.is_embed || s.browser_url) ||
      activeModalStreams[0];

    if (stream) {
      const playUrl = stream.browser_url || stream.url;
      const streamIndex = activeModalStreams.indexOf(stream);
      const labelIndex = streamIndex >= 0 ? streamIndex : useIndex;
      if (playUrl) {
        const serverLabel = serverLabelFor(stream, labelIndex);
        launchVideoPlayer(playUrl, itemTitle, `${serverLabel} • ${stream.quality || '1080p'}`, stream.is_embed, labelIndex);
        return;
      }
    }

    const fallbackId = activeModalItem ? activeModalItem.id : '';
    const fallbackType = activeModalItem ? activeModalItem.type : 'movie';
    const directUrl = fallbackType === 'series'
      ? `https://vidlink.pro/tv/${fallbackId}/1/1`
      : `https://vidlink.pro/movie/${fallbackId}`;
    launchVideoPlayer(directUrl, itemTitle, 'Server 1 (VidLink) • 1080p Ultra HD', true, 0);
  });

  // Resolve the resume timestamp for a new player session and build the
  // provider URL *before* the iframe boots (seek-after-boot is unreliable
  // for cross-origin embeds). Returns { url, resumeBase }.
  function resolveResumeUrl(url, index = 0) {
    let resumeBase = 0;
    if (hasPlaybackEngine() && activeModalItem && activeModalItem.id) {
      try {
        const mediaType = activeModalItem.type === 'series' ? 'series' : 'movie';
        resumeBase = window.JoywatchProgress.getResumeTime(
          activeModalItem.id, mediaType, activeSeason, activeEpisode);
        url = window.JoywatchProviders.withResumeUrl(url, resumeBase);
      } catch (e) { /* fall back to the raw provider URL */ }
    }
    return { url, resumeBase };
  }

  // Start (or restart) the tracked playback session for the active media.
  function beginPlaybackSession(streamUrl, index = 0) {
    endActivePlaybackSession();
    if (!hasPlaybackEngine() || !activeModalItem || !activeModalItem.id) return;
    try {
      const providerId = window.JoywatchProviders.identify(streamUrl);
      activePlaybackSession = window.JoywatchProgress.startSession({
        mediaId: activeModalItem.id,
        type: activeModalItem.type === 'series' ? 'series' : 'movie',
        season: activeSeason,
        episode: activeEpisode,
        title: activeModalItem.name || '',
        poster: activeModalItem.poster || activeModalItem.background || '',
        year: activeModalItem.year || '',
        providerId: providerId
      });
    } catch (e) {
      activePlaybackSession = null;
    }
  }

  // If a completed title resumes from 0, the stored completion marker is
  // intentional — keep it. Otherwise surface a subtle resume hint.
  function updateResumeHint(resumeBase) {
    if (resumeBase > 0 && hasPlaybackEngine()) {
      try {
        const label = window.JoywatchProgress.formatClock(resumeBase);
        playerSub.textContent = (playerSub.textContent ? playerSub.textContent + '  •  ' : '') + `Resumed from ${label}`;
      } catch (e) { /* hint is cosmetic only */ }
    }
  }

  function launchVideoPlayer(url, title, subtitle, isEmbed = false, activeIndex = 0) {
    if (isPlayerAnimating) return;
    closeServersPanel();

    videoPlayer.style.display = 'flex';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        videoPlayer.classList.add('open');
      });
    });

    playerTitle.textContent = title;
    playerSub.textContent = subtitle || '';
    renderPlayerServerPills(activeIndex);

    // Fresh session: force a clean iframe instance so resume params take
    // effect and no stale provider state survives a re-launch.
    playerIframe.src = 'about:blank';

    const resolved = resolveResumeUrl(url, activeIndex);
    beginPlaybackSession(resolved.url, activeIndex);
    if (hasPlaybackEngine() && activeModalItem && activeModalItem.id) {
      try {
        window.JoywatchProgress.recordWatch({
          mediaId: activeModalItem.id,
          type: activeModalItem.type === 'series' ? 'series' : 'movie',
          season: activeSeason,
          episode: activeEpisode,
          title: activeModalItem.name || title || '',
          poster: activeModalItem.poster || activeModalItem.background || '',
          year: activeModalItem.year || ''
        });
      } catch (e) { /* best-effort */ }
    }
    if (resolved.resumeBase > 0) updateResumeHint(resolved.resumeBase);

    const isWebEmbed = isEmbed || url.includes('/embed') || url.includes('vidlink.pro') || url.includes('2embed') || url.includes('autoembed') || url.includes('vidsrc') || url.includes('codespecters') || url.includes('vidjoy');

    if (isWebEmbed) {
      htmlVideo.pause();
      htmlVideo.src = '';
      htmlVideo.style.display = 'none';

      playerIframe.style.display = 'block';
      playerIframe.src = resolved.url;
    } else {
      playerIframe.src = 'about:blank';
      playerIframe.style.display = 'none';

      htmlVideo.style.display = 'block';
      htmlVideo.src = resolved.url;
      if (activePlaybackSession) {
        try {
          activePlaybackSession.attachVideo(htmlVideo);
        } catch (e) { /* playback must not depend on tracking */ }
      }
      htmlVideo.play().catch(() => {});
    }
  }

  function closeVideoPlayer() {
    if (!videoPlayer.classList.contains('open') || isPlayerAnimating) return;
    closeServersPanel();
    isPlayerAnimating = true;
    endActivePlaybackSession();
    if (currentLiveHlsInstance) {
      try { currentLiveHlsInstance.destroy(); } catch (e) {}
      currentLiveHlsInstance = null;
    }
    videoPlayer.classList.remove('open');

    setTimeout(() => {
      htmlVideo.pause();
      htmlVideo.src = '';
      htmlVideo.style.display = 'none';

      playerIframe.src = 'about:blank';
      playerIframe.style.display = 'none';

      videoPlayer.style.display = 'none';
      isPlayerAnimating = false;
    }, 320);
  }

  playerBackBtn.addEventListener('click', closeVideoPlayer);

  function renderPlayerServerPills(activeIndex = 0) {
    if (!playerServersContainer) return;
    playerServersContainer.innerHTML = '';
    currentServerIndex = activeIndex;

    const streams = (activeModalStreams && activeModalStreams.length > 0)
      ? activeModalStreams
      : [
          {
            name: 'VidLink Fast Cloud',
            title: 'Server 1 (VidLink)',
            quality: '1080p Ultra HD',
            browser_url: activeModalItem ? (activeModalItem.type === 'series' ? `https://vidlink.pro/tv/${activeModalItem.id}/1/1` : `https://vidlink.pro/movie/${activeModalItem.id}`) : '',
            is_embed: true
          }
        ];

    streams.forEach((s, idx) => {
      const item = document.createElement('button');
      item.className = `servers-panel-item ${idx === activeIndex ? 'active' : ''}`;

      const serverLabel = serverLabelFor(s, idx);

      item.innerHTML = `
        <span class="servers-panel-name">${serverLabel}</span>
        <span class="servers-panel-quality">${s.quality || '1080p HD'}</span>
      `;
      item.title = `Switch to ${serverLabel} • ${s.quality || '1080p'}`;

      item.addEventListener('click', () => {
        switchPlayerServer(idx);
        closeServersPanel();
      });

      playerServersContainer.appendChild(item);
    });

    if (serversActiveTag && streams[activeIndex]) {
      serversActiveTag.textContent = `Server ${activeIndex + 1} Active`;
    }
  }

  function switchPlayerServer(index) {
    if (!activeModalStreams || !activeModalStreams[index]) return;
    currentServerIndex = index;
    const stream = activeModalStreams[index];
    let playUrl = stream.browser_url || stream.url;
    if (!playUrl) return;

    // Remember this choice per-title so the next play starts on this server.
    rememberServerChoice(index);

    const serverLabel = serverLabelFor(stream, index);
    playerSub.textContent = `${serverLabel} • ${stream.quality || '1080p'}`;

    // Carry the current session position into the new provider's URL so
    // switching servers does not restart playback from 0:00.
    if (hasPlaybackEngine()) {
      try {
        const pos = activePlaybackSession ? activePlaybackSession.getPosition() : 0;
        if (activePlaybackSession && Number.isFinite(pos) && pos > 0) {
          activePlaybackSession.setExactPosition(pos, activePlaybackSession.getDuration());
        }
        playUrl = window.JoywatchProviders.withResumeUrl(playUrl, pos);
      } catch (e) { /* keep the raw provider URL */ }
    }
    beginPlaybackSession(playUrl, index);

    const isWebEmbed = stream.is_embed || playUrl.includes('/embed') || playUrl.includes('vidlink.pro') || playUrl.includes('2embed') || playUrl.includes('autoembed') || playUrl.includes('vidsrc') || playUrl.includes('codespecters') || playUrl.includes('vidjoy');

    if (isWebEmbed) {
      htmlVideo.pause();
      htmlVideo.src = '';
      htmlVideo.style.display = 'none';

      playerIframe.src = 'about:blank';
      playerIframe.style.display = 'block';
      playerIframe.src = playUrl;
    } else {
      playerIframe.src = 'about:blank';
      playerIframe.style.display = 'none';

      htmlVideo.style.display = 'block';
      htmlVideo.src = playUrl;
      if (activePlaybackSession) {
        try {
          activePlaybackSession.attachVideo(htmlVideo);
        } catch (e) { /* playback must not depend on tracking */ }
      }
      htmlVideo.play().catch(() => {});
    }

    renderPlayerServerPills(index);
    showToast(`Switched to ${serverLabel}`);
  }

  function toggleServersPanel() {
    if (!playerServersPanel) return;
    const isVisible = playerServersPanel.style.display !== 'none';
    if (isVisible) closeServersPanel();
    else openServersPanel();
  }

  function openServersPanel() {
    if (!playerServersPanel) return;
    playerServersPanel.style.display = 'flex';
    requestAnimationFrame(() => {
      playerServersPanel.classList.add('show');
      if (playerServersToggleBtn) {
        playerServersToggleBtn.classList.add('open');
        playerServersToggleBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  function closeServersPanel() {
    if (!playerServersPanel || playerServersPanel.style.display === 'none') return;
    playerServersPanel.classList.remove('show');
    if (playerServersToggleBtn) {
      playerServersToggleBtn.classList.remove('open');
      playerServersToggleBtn.setAttribute('aria-expanded', 'false');
    }
    setTimeout(() => {
      if (!playerServersPanel.classList.contains('show')) {
        playerServersPanel.style.display = 'none';
      }
    }, 180);
  }

  if (playerServersToggleBtn) {
    playerServersToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleServersPanel();
    });
  }

  document.addEventListener('click', (e) => {
    if (playerServersPanel && playerServersPanel.style.display !== 'none') {
      if (playerServersDropdown && !playerServersDropdown.contains(e.target)) {
        closeServersPanel();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (playerServersPanel && playerServersPanel.style.display !== 'none') {
        closeServersPanel();
      } else if (videoPlayer.classList.contains('open')) {
        closeVideoPlayer();
      } else if (detailModal.classList.contains('open')) {
        closeDetailModal();
      }
    }
  });

  function showToast(msg) {
    let toast = document.getElementById('joy-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'joy-toast';
      toast.className = 'joy-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // =========================================================================
  // MULTI-SECTION CATALOG LOADING (Expanded Homepage Sections + OTT Curation)
  // =========================================================================
  async function initHomeCatalog(filter = 'all') {
    rowsContainer.innerHTML = '<div class="shelf-loader"><div class="joy-spinner"></div><span>Loading Joywatch universe...</span></div>';

    try {
      const fetches = [];

      // 1. Trending Movies
      if (filter === 'all' || filter === 'movie') {
        fetches.push(fetchCatalog('movie'));
      }
      // 2. Top TV Series
      if (filter === 'all' || filter === 'series') {
        fetches.push(fetchCatalog('series'));
      }
      // 3. Action & Adrenaline
      if (filter === 'all' || filter === 'movie') {
        fetches.push(fetchCatalog('movie', 'Action'));
      }
      // 4. Sci-Fi & Cyberpunk
      if (filter === 'all' || filter === 'movie') {
        fetches.push(fetchCatalog('movie', 'Sci-Fi'));
      }
      // 5. Psychological Thrillers
      if (filter === 'all' || filter === 'movie') {
        fetches.push(fetchCatalog('movie', 'Thriller'));
      }
      // 6. Popular Animation & Anime
      if (filter === 'all' || filter === 'series' || filter === 'anime') {
        fetches.push(fetchCatalog('series', 'Animation'));
      }
      // Fetch category catalog concurrently
      const [catResults] = await Promise.all([
        Promise.all(fetches)
      ]);
      const results = catResults;
      rowsContainer.innerHTML = '';
      let featuredSet = false;

      // 1. Continue Watching Row (in-progress only, non-completed).
      // Clicking a card opens the detail modal; Play resumes from the saved
      // position via the provider adapter (see launchVideoPlayer).
      if (filter === 'all' && hasPlaybackEngine()) {
        try {
          const progressItems = window.JoywatchProgress.listActive(20).map(e => ({
            id: String(e.mediaId),
            name: e.title || 'Untitled',
            poster: e.poster || '',
            background: e.poster || '',
            year: e.year || '2025',
            type: e.type || 'movie',
            imdbRating: '8.8',
            _progress: e
          }));
          if (progressItems.length > 0) {
            const historyRow = createRowElement('Continue Watching', progressItems, 'continue_watching');
            if (historyRow) rowsContainer.appendChild(historyRow);
          }
        } catch (e) { /* Continue Watching is best-effort; never break home */ }
      }

      // 2. Smart Taste Engine • Recommended For You
      if (filter === 'all' || filter === 'movie') {
        try {
          const recShelf = createRecommendedShelf();
          if (recShelf) rowsContainer.appendChild(recShelf);
        } catch (e) { /* Taste engine best-effort */ }
      }

      // 3. Certified IMDb 9.5+ Masterpieces
      if (filter === 'all' || filter === 'movie') {
        try {
          const mpShelf = createMasterpiecesShelf();
          if (mpShelf) rowsContainer.appendChild(mpShelf);
        } catch (e) { /* Masterpieces best-effort */ }
      }

      // 4. Trending Now
      let idx = 0;
      if (filter === 'all' || filter === 'movie') {
        const trendingMovies = results[idx++].items || [];
        if (trendingMovies.length > 0 && !featuredSet) {
          setBillboard(trendingMovies[0]);
          featuredSet = true;
        }
        const row = createRowElement('Trending Now', trendingMovies, 'trending');
        if (row) rowsContainer.appendChild(row);
      }

      // 3. Popular on Netflix (TMDb Verified Watch Provider - 164 Titles)
      if (filter === 'all' || filter === 'movie') {
        const nData = (OTT_DATA.netflix && OTT_DATA.netflix.length > 0) ? OTT_DATA.netflix : (await fetchOttCatalog('netflix', 'all', 200));
        const netflixShelf = createRowElement('Popular on Netflix', nData, 'netflix');
        if (netflixShelf) rowsContainer.appendChild(netflixShelf);
      }

      // 4. Prime Video Exclusives (TMDb Verified Watch Provider - 172 Titles)
      if (filter === 'all' || filter === 'series') {
        const pData = (OTT_DATA.prime && OTT_DATA.prime.length > 0) ? OTT_DATA.prime : (await fetchOttCatalog('prime', 'all', 200));
        const primeShelf = createRowElement('Prime Video Exclusives', pData, 'prime');
        if (primeShelf) rowsContainer.appendChild(primeShelf);
      }

      // 5. Disney+ Hotstar Cinema & Marvel (TMDb Verified Watch Provider - 212 Titles)
      if (filter === 'all' || filter === 'movie') {
        const dData = (OTT_DATA.disney && OTT_DATA.disney.length > 0) ? OTT_DATA.disney : (await fetchOttCatalog('disney', 'all', 200));
        const disneyShelf = createRowElement('Disney+ Hotstar Cinema & Marvel', dData, 'disney');
        if (disneyShelf) rowsContainer.appendChild(disneyShelf);
      }

      // 6. Crunchyroll Anime Vault (TMDb Verified Watch Provider - 165 Titles)
      if (filter === 'all' || filter === 'anime' || filter === 'series') {
        const cData = (OTT_DATA.crunchyroll && OTT_DATA.crunchyroll.length > 0) ? OTT_DATA.crunchyroll : (await fetchOttCatalog('crunchyroll', 'all', 200));
        const crunchyShelf = createRowElement('Crunchyroll Anime Vault', cData, 'crunchyroll');
        if (crunchyShelf) rowsContainer.appendChild(crunchyShelf);
      }

      // 7. Paramount+ Blockbusters (TMDb Verified Watch Provider - 160 Titles)
      if (filter === 'all' || filter === 'movie') {
        const pmData = (OTT_DATA.paramount && OTT_DATA.paramount.length > 0) ? OTT_DATA.paramount : (await fetchOttCatalog('paramount', 'all', 200));
        const paramountShelf = createRowElement('Paramount+ Blockbusters', pmData, 'paramount');
        if (paramountShelf) rowsContainer.appendChild(paramountShelf);
      }

      // 8. Top Rated Masterpieces (IMDb 8.5+)
      if (filter === 'all' || filter === 'movie') {
        const masterpieces = cachedCatalogPool.filter(c => parseFloat(c.imdbRating) >= 8.5).slice(0, 15);
        if (masterpieces.length > 0) {
          const row = createRowElement('Top Rated Masterpieces (IMDb 8.5+)', masterpieces, 'top_rated');
          if (row) rowsContainer.appendChild(row);
        }
      }

      // 9. Popular TV Shows
      if (filter === 'all' || filter === 'series') {
        const topSeries = results[idx++].items || [];
        if (filter === 'series' && topSeries.length > 0 && !featuredSet) {
          setBillboard(topSeries[0]);
          featuredSet = true;
        }
        const row = createRowElement('Popular TV Shows', topSeries, 'series');
        if (row) rowsContainer.appendChild(row);
      }

      // 10. Action & High Adrenaline
      if (filter === 'all' || filter === 'movie') {
        const actionMovies = results[idx++].items || [];
        const row = createRowElement('Action & High Adrenaline', actionMovies, 'Action');
        if (row) rowsContainer.appendChild(row);
      }

      // 11. Sci-Fi & Cyberpunk
      if (filter === 'all' || filter === 'movie') {
        const sciFiMovies = results[idx++].items || [];
        const row = createRowElement('Sci-Fi & Cyberpunk', sciFiMovies, 'Sci-Fi');
        if (row) rowsContainer.appendChild(row);
      }

      // 12. Psychological Thrillers & Mystery
      if (filter === 'all' || filter === 'movie') {
        const thrillerMovies = results[idx++].items || [];
        const row = createRowElement('Psychological Thrillers & Mystery', thrillerMovies, 'Thriller');
        if (row) rowsContainer.appendChild(row);
      }

      // 13. Popular Animation & Anime
      if (filter === 'all' || filter === 'series' || filter === 'anime') {
        const animeShows = results[idx++].items || [];
        if (filter === 'anime' && animeShows.length > 0 && !featuredSet) {
          setBillboard(animeShows[0]);
          featuredSet = true;
        }
        const row = createRowElement('Popular Animation & Anime', animeShows, 'Animation');
        if (row) rowsContainer.appendChild(row);
      }

      // 14. From Your Watchlist (if user has saved items)
      const mylistItems = getJoyList();
      if (mylistItems.length > 0 && filter === 'all') {
        const row = createRowElement('From Your Watchlist', mylistItems, 'watchlist');
        if (row) rowsContainer.appendChild(row);
      }

    } catch (err) {
      rowsContainer.innerHTML = `<div class="shelf-loader"><span>Failed to load Joywatch catalog: ${err.message}</span></div>`;
    }
  }

  // =========================================================================
  // LIVE TV CONTROLLER & HLS PLAYER
  // =========================================================================
  let tvActiveCategory = 'all';
  let tvActiveCountry = 'all';
  let tvSearchQuery = '';
  let currentLiveHlsInstance = null;
  let activeLiveChannel = null;

  function getCustomChannels() {
    try {
      const raw = localStorage.getItem('joywatch_custom_tv_channels');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCustomChannel(ch) {
    const list = getCustomChannels();
    list.unshift(ch);
    localStorage.setItem('joywatch_custom_tv_channels', JSON.stringify(list));
  }

  function getAllChannels() {
    const builtIn = (typeof window.JOYWATCH_LIVE_CHANNELS !== 'undefined' && Array.isArray(window.JOYWATCH_LIVE_CHANNELS))
      ? window.JOYWATCH_LIVE_CHANNELS
      : [];
    const custom = getCustomChannels();
    return [...custom, ...builtIn];
  }

  function getFilteredChannels() {
    const all = getAllChannels();
    return all.filter(ch => {
      // Category match
      if (tvActiveCategory !== 'all' && (ch.category || '').toLowerCase() !== tvActiveCategory.toLowerCase()) {
        return false;
      }
      // Country match
      if (tvActiveCountry !== 'all') {
        if (tvActiveCountry === 'custom') {
          if (!ch.is_custom) return false;
        } else if ((ch.country || '').toUpperCase() !== tvActiveCountry.toUpperCase()) {
          return false;
        }
      }
      // Search match
      if (tvSearchQuery) {
        const q = tvSearchQuery.toLowerCase();
        const nameMatch = (ch.name || '').toLowerCase().includes(q);
        const descMatch = (ch.description || '').toLowerCase().includes(q);
        const catMatch = (ch.category || '').toLowerCase().includes(q);
        const countryMatch = (ch.country || '').toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !catMatch && !countryMatch) return false;
      }
      return true;
    });
  }

  function createLiveChannelCard(channel) {
    const card = document.createElement('div');
    card.className = 'tv-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    const words = (channel.name || 'TV').trim().split(/\s+/);
    const monogram = words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : (channel.name ? channel.name.slice(0, 2).toUpperCase() : 'TV');

    const logoHtml = channel.logo
      ? `<img class="tv-card-logo-img" src="${channel.logo}" alt="${channel.name}" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
         <div class="tv-card-monogram" style="display: none;">${monogram}</div>`
      : `<div class="tv-card-monogram">${monogram}</div>`;

    card.innerHTML = `
      <div class="tv-card-top-bar">
        <span class="tv-card-live-chip"><span class="pulse-dot"></span> LIVE</span>
        <span class="tv-card-quality">${channel.quality || '1080p HD'}</span>
      </div>
      <div class="tv-card-logo-area">
        ${logoHtml}
        <div class="tv-card-play-overlay">
          <div class="tv-card-play-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
          </div>
        </div>
      </div>
      <h3 class="tv-card-title" title="${channel.name}">${channel.name}</h3>
      <p class="tv-card-desc">${channel.description || `${channel.name} live broadcast.`}</p>
      <div class="tv-card-footer">
        <span class="tv-card-category">${channel.category || 'Live TV'}</span>
        <span class="tv-card-country-tag">${channel.country || 'GLOBAL'}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      playLiveChannel(channel);
    });

    return card;
  }

  function renderLiveTvView() {
    if (!livetvView) return;

    // Featured Live Channel Setup
    const all = getAllChannels();
    const featured = all.find(c => c.is_featured) || all[0];
    if (featured && tvFeaturedTitle) {
      tvFeaturedTitle.textContent = featured.name;
      if (tvFeaturedDesc) tvFeaturedDesc.textContent = featured.description || `${featured.name} 24/7 live stream.`;
      if (tvFeaturedCategory) tvFeaturedCategory.textContent = featured.category || 'News';
      if (tvFeaturedCountry) tvFeaturedCountry.textContent = featured.country || 'Global';
      if (tvFeaturedQuality) tvFeaturedQuality.textContent = featured.quality || '1080p Full HD';
      if (tvFeaturedLogo && featured.logo) {
        tvFeaturedLogo.src = featured.logo;
        tvFeaturedLogo.style.display = 'block';
      }
      if (tvFeaturedPlayBtn) {
        tvFeaturedPlayBtn.onclick = () => playLiveChannel(featured);
      }
    }

    const channels = getFilteredChannels();
    if (tvTotalCountBadge) {
      tvTotalCountBadge.textContent = `${channels.length} ${channels.length === 1 ? 'Channel' : 'Channels'}`;
    }

    if (tvChannelsGrid) {
      tvChannelsGrid.innerHTML = '';
      if (channels.length === 0) {
        if (tvEmptyState) tvEmptyState.style.display = 'flex';
      } else {
        if (tvEmptyState) tvEmptyState.style.display = 'none';
        channels.forEach(ch => {
          tvChannelsGrid.appendChild(createLiveChannelCard(ch));
        });
      }
    }
  }

  function renderLiveChannelSwitcher(currentChannel) {
    if (!playerServersContainer) return;
    playerServersContainer.innerHTML = '';

    if (serversActiveTag) {
      serversActiveTag.textContent = `${currentChannel.name} (Live)`;
    }

    const all = getAllChannels();
    const switcherChannels = all.slice(0, 25);
    switcherChannels.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = `player-server-pill ${ch.id === currentChannel.id ? 'active' : ''}`;
      btn.innerHTML = `
        <span class="pulse-dot"></span>
        <span class="server-pill-name">${ch.name}</span>
        <span class="server-pill-quality">${ch.quality || 'HD'}</span>
      `;
      btn.addEventListener('click', () => {
        closeServersPanel();
        playLiveChannel(ch);
      });
      playerServersContainer.appendChild(btn);
    });
  }

  function playLiveChannel(channel) {
    if (!channel || !channel.url) return;
    activeLiveChannel = channel;

    // Teardown previous playback
    if (currentLiveHlsInstance) {
      try { currentLiveHlsInstance.destroy(); } catch (e) {}
      currentLiveHlsInstance = null;
    }
    htmlVideo.pause();
    htmlVideo.src = '';
    playerIframe.src = 'about:blank';
    playerIframe.style.display = 'none';

    // Player chrome titles
    if (playerTitle) playerTitle.textContent = channel.name;
    if (playerSub) playerSub.textContent = `${channel.quality || '1080p HD'} • ${channel.category ? channel.category.toUpperCase() : 'LIVE'} • ${channel.country || 'GLOBAL'}`;
    const playerTag = document.getElementById('player-tag');
    if (playerTag) playerTag.textContent = 'LIVE BROADCAST';

    renderLiveChannelSwitcher(channel);

    // Open video player overlay
    videoPlayer.style.display = 'flex';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        videoPlayer.classList.add('open');
      });
    });

    htmlVideo.style.display = 'block';

    const directUrl = channel.url;
    const proxyUrl = `/api/stream-proxy?url=${encodeURIComponent(directUrl)}`;

    function attachHls(urlToPlay, onFail) {
      if (htmlVideo.canPlayType('application/vnd.apple.mpegurl')) {
        htmlVideo.src = urlToPlay;
        htmlVideo.play().catch(() => {
          if (onFail) onFail();
        });
      } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 60,
          manifestLoadingTimeOut: 10000,
          manifestLoadingMaxRetry: 2
        });
        currentLiveHlsInstance = hls;
        hls.loadSource(urlToPlay);
        hls.attachMedia(htmlVideo);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          htmlVideo.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                if (urlToPlay === directUrl && onFail) {
                  try { hls.destroy(); } catch (e) {}
                  currentLiveHlsInstance = null;
                  onFail();
                } else {
                  hls.startLoad();
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                if (urlToPlay === directUrl && onFail) {
                  try { hls.destroy(); } catch (e) {}
                  currentLiveHlsInstance = null;
                  onFail();
                } else {
                  try { hls.destroy(); } catch (e) {}
                  currentLiveHlsInstance = null;
                }
                break;
            }
          }
        });
      } else {
        htmlVideo.src = urlToPlay;
        htmlVideo.play().catch(() => {});
      }
    }

    // Try direct link first; automatically failover to Joywatch proxy if CORS or network error occurs
    attachHls(directUrl, () => {
      console.log('[Live TV] Direct stream failed, routing through Joywatch proxy:', proxyUrl);
      attachHls(proxyUrl, () => {
        showToast(`Could not connect to live broadcast for ${channel.name}`);
      });
    });
  }

  // Live TV Filter Listeners
  if (tvCategoryPills) {
    tvCategoryPills.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      tvCategoryPills.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tvActiveCategory = btn.dataset.tvCat || 'all';
      renderLiveTvView();
    });
  }

  if (tvCountryPills) {
    tvCountryPills.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      tvCountryPills.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tvActiveCountry = btn.dataset.tvCountry || 'all';
      renderLiveTvView();
    });
  }

  let tvSearchDebounce = null;
  if (tvSearchInput) {
    tvSearchInput.addEventListener('input', (e) => {
      clearTimeout(tvSearchDebounce);
      tvSearchDebounce = setTimeout(() => {
        tvSearchQuery = e.target.value.trim();
        renderLiveTvView();
      }, 100);
    });
  }

  if (tvClearSearchBtn) {
    tvClearSearchBtn.addEventListener('click', () => {
      if (tvSearchInput) tvSearchInput.value = '';
      tvSearchQuery = '';
      renderLiveTvView();
    });
  }

  if (tvResetFiltersBtn) {
    tvResetFiltersBtn.addEventListener('click', () => {
      tvActiveCategory = 'all';
      tvActiveCountry = 'all';
      tvSearchQuery = '';
      if (tvSearchInput) tvSearchInput.value = '';
      if (tvCategoryPills) {
        tvCategoryPills.querySelectorAll('.filter-pill').forEach(b => {
          if (b.dataset.tvCat === 'all') b.classList.add('active');
          else b.classList.remove('active');
        });
      }
      if (tvCountryPills) {
        tvCountryPills.querySelectorAll('.filter-pill').forEach(b => {
          if (b.dataset.tvCountry === 'all') b.classList.add('active');
          else b.classList.remove('active');
        });
      }
      renderLiveTvView();
    });
  }

  // Custom Stream Modal Wiring
  if (tvAddStreamBtn && customStreamModal) {
    tvAddStreamBtn.addEventListener('click', () => {
      customStreamModal.style.display = 'flex';
      if (customStreamName) customStreamName.focus();
    });
  }

  if (customStreamCloseBtn && customStreamModal) {
    customStreamCloseBtn.addEventListener('click', () => {
      customStreamModal.style.display = 'none';
    });
  }

  if (customStreamModal) {
    customStreamModal.addEventListener('click', (e) => {
      if (e.target === customStreamModal) {
        customStreamModal.style.display = 'none';
      }
    });
  }

  if (customStreamForm) {
    customStreamForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = customStreamName ? customStreamName.value.trim() : '';
      const url = customStreamUrl ? customStreamUrl.value.trim() : '';
      const cat = customStreamCategory ? customStreamCategory.value : 'news';
      const quality = customStreamQuality ? customStreamQuality.value : '1080p Full HD';

      if (!name || !url) return;

      const newCh = {
        id: 'custom-' + Date.now(),
        name: name,
        url: url,
        category: cat,
        quality: quality,
        country: 'CUSTOM',
        logo: '',
        description: 'Custom added live stream.',
        is_custom: true
      };

      saveCustomChannel(newCh);
      if (customStreamModal) customStreamModal.style.display = 'none';
      customStreamForm.reset();
      showToast(`Added custom channel "${newCh.name}"`);
      renderLiveTvView();
      playLiveChannel(newCh);
    });
  }

  window.addEventListener('beforeunload', () => {
    endActivePlaybackSession();
  });
  window.addEventListener('pagehide', () => {
    endActivePlaybackSession();
  });

  // Initial Load
  initHomeCatalog('all');
});
