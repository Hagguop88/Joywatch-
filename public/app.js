/**
 * Joywatch • Ambient Cinema Streaming & Discovery
 * Premium Modern Discovery & Streaming Platform Engine
 * 
 * Strict UI/UX Invariants:
 * - Zero Purple Anywhere
 * - Zero Gradients (Pure solid tints and layered smooth box-shadows)
 * - Zero Emojis (Delicate SVGs and clean text)
 * - Round Corner Buttons (border-radius: 9999px)
 * - Primary Accent: Lime Green (#95FF50)
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
  const navSearchBtn = document.getElementById('nav-search-btn');
  const mobileSearchTab = document.getElementById('mobile-search-tab');

  // Main Views & Sections
  const billboard = document.getElementById('billboard');
  const ottSection = document.getElementById('ott-section');
  const rowsContainer = document.getElementById('rows-container');
  const searchView = document.getElementById('search-view');
  const mylistView = document.getElementById('mylist-view');

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

  // Watchlist View Elements
  const mylistGrid = document.getElementById('mylist-grid');
  const mylistCountBadge = document.getElementById('mylist-count-badge');
  const mylistEmpty = document.getElementById('mylist-empty');
  const browseCatalogBtn = document.getElementById('browse-catalog-btn');

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

  function updateJoylistCounter() {
    const count = getJoyList().length;
    if (joylistCounter) joylistCounter.textContent = count;
    if (mobileJoylistCounter) mobileJoylistCounter.textContent = count;
    if (mylistCountBadge) mylistCountBadge.textContent = `${count} saved`;
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
          { name: "VidLink Pro", title: `Server 1 • VidLink 1080p Ultra HD (S${s}:E${e})`, quality: "1080p Ultra HD", url: `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=95FF50`, browser_url: `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=95FF50`, direct_playable: true, is_embed: true },
          { name: "NexStream VIP", title: `Server 2 • NexStream VIP 1080p (S${s}:E${e})`, quality: "1080p Ultra HD", url: `https://api.codespecters.com/embed/tv/${id}/${s}/${e}?apikey=${nexKey}`, browser_url: `https://api.codespecters.com/embed/tv/${id}/${s}/${e}?apikey=${nexKey}`, direct_playable: true, is_embed: true },
          { name: "AutoEmbed Cloud", title: `Server 3 • AutoEmbed High-Speed (S${s}:E${e})`, quality: "1080p HD", url: `https://autoembed.co/tv/imdb/${id}/${s}/${e}`, browser_url: `https://autoembed.co/tv/imdb/${id}/${s}/${e}`, direct_playable: true, is_embed: true },
          { name: "VidSrc PM", title: `Server 4 • VidSrc Dedicated (S${s}:E${e})`, quality: "1080p HD", url: `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`, browser_url: `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`, direct_playable: true, is_embed: true },
          { name: "VidSrc SU", title: `Server 5 • VidSrc High-Speed (S${s}:E${e})`, quality: "1080p HD", url: `https://vidsrc.su/embed/tv/${id}/${s}/${e}`, browser_url: `https://vidsrc.su/embed/tv/${id}/${s}/${e}`, direct_playable: true, is_embed: true },
          { name: "VidJoy Cinema", title: `Server 6 • VidJoy Cinema (S${s}:E${e})`, quality: "1080p HD", url: `https://vidjoy.pro/embed/tv/${id}/${s}/${e}`, browser_url: `https://vidjoy.pro/embed/tv/${id}/${s}/${e}`, direct_playable: true, is_embed: true },
          { name: "2Embed Multi-Server", title: `Server 7 • 2Embed 1080p Full HD (S${s}:E${e})`, quality: "1080p Full HD", url: `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`, browser_url: `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`, direct_playable: true, is_embed: true }
        );
      } else {
        streams.push(
          { name: "VidLink Pro", title: `Server 1 • ${cleanTitle} - 1080p Ultra HD`, quality: "1080p Ultra HD", url: `https://vidlink.pro/movie/${id}?primaryColor=95FF50`, browser_url: `https://vidlink.pro/movie/${id}?primaryColor=95FF50`, direct_playable: true, is_embed: true },
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

  // Top Nav Search Box Trigger (Opens separate search page)
  if (searchBox) {
    searchBox.addEventListener('click', (e) => {
      if (e.target !== clearSearchBtn && !clearSearchBtn.contains(e.target)) {
        openDedicatedSearch(searchInput ? searchInput.value.trim() : '');
      }
    });
  }

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    clearSearchBtn.style.display = query ? 'flex' : 'none';
    if (dedicatedSearchInput) dedicatedSearchInput.value = query;
    if (dedicatedClearBtn) dedicatedClearBtn.style.display = query ? 'flex' : 'none';

    if (searchTimeout) clearTimeout(searchTimeout);
    openDedicatedSearch(query);
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

  // Nav Search Button
  if (navSearchBtn) {
    navSearchBtn.addEventListener('click', () => {
      openDedicatedSearch('');
      if (dedicatedSearchInput) dedicatedSearchInput.focus();
    });
  }

  // Mobile Bottom Nav Search Tab
  if (mobileSearchTab) {
    mobileSearchTab.addEventListener('click', () => {
      openDedicatedSearch('');
      if (dedicatedSearchInput) dedicatedSearchInput.focus();
    });
  }

  // =========================================================================
  // SEPARATE DEDICATED SEARCH PAGE WITH PRE-SEARCH RECOMMENDATIONS
  // =========================================================================
  function openDedicatedSearch(query = '') {
    // Hide billboard, OTT section, home shelves, watchlist
    billboard.style.display = 'none';
    if (ottSection) ottSection.style.display = 'none';
    rowsContainer.style.display = 'none';
    if (mylistView) mylistView.style.display = 'none';
    searchView.style.display = 'block';

    // Synchronize active nav button
    allNavButtons.forEach(b => {
      if (b.dataset.filter === 'search' || b.id === 'mobile-search-tab') b.classList.add('active');
      else b.classList.remove('active');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (query) {
      executeSearchQuery(query);
    } else {
      renderRecommendationsInSearch();
    }
  }

  function closeSearchView() {
    searchView.style.display = 'none';
    if (mylistView) mylistView.style.display = 'none';
    billboard.style.display = 'flex';
    if (ottSection) ottSection.style.display = 'flex';
    rowsContainer.style.display = 'flex';
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

      if (filter === 'search') {
        openDedicatedSearch('');
        if (dedicatedSearchInput) dedicatedSearchInput.focus();
        return;
      }

      allNavButtons.forEach(b => {
        if (b.dataset.filter === filter) b.classList.add('active');
        else b.classList.remove('active');
      });

      handleFilterChange(filter);
    });
  });

  function handleFilterChange(filter) {
    if (filter === 'mylist') {
      searchView.style.display = 'none';
      billboard.style.display = 'none';
      if (ottSection) ottSection.style.display = 'none';
      rowsContainer.style.display = 'none';
      if (mylistView) mylistView.style.display = 'block';
      renderMyListView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (mylistView) mylistView.style.display = 'none';
      searchView.style.display = 'none';
      billboard.style.display = 'flex';
      if (ottSection) ottSection.style.display = 'flex';
      rowsContainer.style.display = 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      initHomeCatalog(filter);
    }
  }

  function renderMyListView() {
    if (!mylistView) return;
    const list = getJoyList();
    mylistGrid.innerHTML = '';
    mylistCountBadge.textContent = `${list.length} saved`;

    if (list.length === 0) {
      mylistEmpty.style.display = 'flex';
      mylistGrid.style.display = 'none';
    } else {
      mylistEmpty.style.display = 'none';
      mylistGrid.style.display = 'grid';
      list.forEach(item => {
        mylistGrid.appendChild(createCardElement(item));
      });
    }
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
  // MOVIE CARDS (2:3 Aspect Ratio, Rounded Corners, Hover Overlay)
  // =========================================================================
  function createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    const poster = item.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=85';
    const rating = item.imdbRating || '8.4';
    const year = item.year || '2025';
    const mediaType = item.type === 'series' ? 'TV Series' : 'Movie';

    card.innerHTML = `
      <div class="card-poster-wrapper">
        <img class="card-poster" src="${poster}" alt="${item.name}" loading="lazy" onload="this.classList.add('loaded')" onerror="this.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=85'; this.classList.add('loaded');">
        
        <div class="card-top-pill">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#95FF50">
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
              <span>★ ${rating}</span>
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

    // Continue Watching resume affordance: thin progress rail + timestamp,
    // rendered only when this card carries a stored progress entry.
    if (item._progress && typeof item._progress.currentTime === 'number') {
      try {
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
        const wrapper = card.querySelector('.card-poster-wrapper');
        if (wrapper) wrapper.appendChild(rail);
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
    seeAllBtn.addEventListener('click', () => {
      if (filterCategory) {
        if (filterCategory === 'netflix' || filterCategory === 'prime' || filterCategory === 'disney' || filterCategory === 'crunchyroll' || filterCategory === 'paramount') {
          filterState.platform = filterCategory;
          document.querySelectorAll('#ott-filters .filter-pill').forEach(b => {
            if (b.dataset.ott === filterCategory) b.classList.add('active');
            else b.classList.remove('active');
          });
        } else if (filterCategory === 'movie' || filterCategory === 'series') {
          filterState.type = filterCategory;
          document.querySelectorAll('#type-filters .filter-pill').forEach(b => {
            if (b.dataset.type === filterCategory) b.classList.add('active');
            else b.classList.remove('active');
          });
        } else {
          filterState.genre = filterCategory;
          document.querySelectorAll('#genre-filters .filter-pill').forEach(b => {
            if (b.dataset.genre === filterCategory) b.classList.add('active');
            else b.classList.remove('active');
          });
        }
      }
      openDedicatedSearch('');
    });

    row.appendChild(rowHeader);
    row.appendChild(track);
    return row;
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
    episodes.forEach(ep => {
      const btn = document.createElement('button');
      btn.className = 'episode-btn';
      const num = ep.episode || 1;
      btn.textContent = `Episode ${num}`;

      btn.addEventListener('click', () => {
        episodesList.querySelectorAll('.episode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadStreams(activeModalItem.type, activeModalItem.id, ep.season || 1, num, true);
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
        const stream = activeModalStreams[0];
        const playUrl = stream.browser_url || stream.url;
        if (playUrl) {
          launchVideoPlayer(playUrl, itemTitle || 'Movie', `Server 1 • ${stream.quality || '1080p'}`, stream.is_embed, 0);
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
    const stream = activeModalStreams.find(s => s.direct_playable || s.is_embed || s.browser_url) || activeModalStreams[0];

    if (stream) {
      const playUrl = stream.browser_url || stream.url;
      if (playUrl) {
        let serverLabel = 'Server 1';
        const titleLower = (stream.title || '').toLowerCase();
        if (titleLower.includes('vidlink')) serverLabel = 'Server 1 (VidLink)';
        else if (titleLower.includes('2embed')) serverLabel = 'Server 2 (2Embed)';
        launchVideoPlayer(playUrl, itemTitle, `${serverLabel} • ${stream.quality || '1080p'}`, stream.is_embed, 0);
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

      let serverLabel = `Server ${idx + 1}`;
      const titleLower = (s.title || '').toLowerCase();
      const nameLower = (s.name || '').toLowerCase();
      if (titleLower.includes('vidlink') || nameLower.includes('vidlink')) serverLabel = 'Server 1 (VidLink)';
      else if (titleLower.includes('2embed') || nameLower.includes('2embed')) serverLabel = 'Server 2 (2Embed)';
      else if (titleLower.includes('autoembed') || nameLower.includes('autoembed')) serverLabel = 'Server 3 (AutoEmbed)';
      else if (titleLower.includes('vidsrc') || nameLower.includes('vidsrc')) serverLabel = 'Server 4 (VidSrc)';
      else if (s.name) serverLabel = `Server ${idx + 1} (${s.name})`;

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

    let serverLabel = `Server ${index + 1}`;
    const titleLower = (stream.title || '').toLowerCase();
    if (titleLower.includes('vidlink')) serverLabel = 'Server 1 (VidLink)';
    else if (titleLower.includes('2embed')) serverLabel = 'Server 2 (2Embed)';
    else if (titleLower.includes('autoembed')) serverLabel = 'Server 3 (AutoEmbed)';
    else if (titleLower.includes('vidsrc')) serverLabel = 'Server 4 (VidSrc)';

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
            const historyRow = createRowElement('Continue Watching', progressItems);
            if (historyRow) rowsContainer.appendChild(historyRow);
          }

          // 1b. Recently Watched (includes completed titles).
          // Shows last 10 watched items regardless of completion state.
          const recentItems = window.JoywatchProgress.listRecent(10).map(e => ({
            id: String(e.mediaId),
            name: e.title || 'Untitled',
            poster: e.poster || '',
            background: e.poster || '',
            year: e.year || '2025',
            type: e.type || 'movie',
            imdbRating: '8.8',
            _progress: e
          }));
          if (recentItems.length > 0) {
            const recentRow = createRowElement('Recently Watched', recentItems);
            if (recentRow) rowsContainer.appendChild(recentRow);
          }
        } catch (e) { /* Continue Watching is best-effort; never break home */ }
      }

      // 2. Trending Now
      let idx = 0;
      if (filter === 'all' || filter === 'movie') {
        const trendingMovies = results[idx++].items || [];
        if (trendingMovies.length > 0 && !featuredSet) {
          setBillboard(trendingMovies[0]);
          featuredSet = true;
        }
        const row = createRowElement('Trending Now', trendingMovies, 'movie');
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
          const row = createRowElement('Top Rated Masterpieces (IMDb 8.5+)', masterpieces);
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
        const row = createRowElement('Popular Animation & Anime', animeShows, 'Animation');
        if (row) rowsContainer.appendChild(row);
      }

      // 14. From Your Watchlist (if user has saved items)
      const mylistItems = getJoyList();
      if (mylistItems.length > 0 && filter === 'all') {
        const row = createRowElement('From Your Watchlist', mylistItems);
        if (row) rowsContainer.appendChild(row);
      }

    } catch (err) {
      rowsContainer.innerHTML = `<div class="shelf-loader"><span>Failed to load Joywatch catalog: ${err.message}</span></div>`;
    }
  }

  // Initial Load
  initHomeCatalog('all');
});
