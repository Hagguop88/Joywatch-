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
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Header Elements
  const navbar = document.getElementById('navbar');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const joylistCounter = document.getElementById('joylist-counter');
  const mobileJoylistCounter = document.getElementById('mobile-joylist-counter');
  const allNavButtons = document.querySelectorAll('.nav-pill, .bottom-nav-pill');
  const mobileSearchTab = document.getElementById('mobile-search-tab');

  // Main Views
  const billboard = document.getElementById('billboard');
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

  // Dedicated Search Elements
  const dedicatedSearchInput = document.getElementById('dedicated-search-input');
  const dedicatedClearBtn = document.getElementById('dedicated-clear-btn');
  const searchGrid = document.getElementById('search-grid');
  const searchResultsHeading = document.getElementById('search-results-heading');
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
  let cachedCatalogPool = []; // Pool of items used for instant filtering and recommendations

  // Search Filter State
  const filterState = {
    type: 'all',
    genre: 'all',
    year: 'all',
    rating: 'all'
  };

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

  // Top Nav Search Input
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    clearSearchBtn.style.display = query ? 'flex' : 'none';
    if (dedicatedSearchInput) dedicatedSearchInput.value = query;
    if (dedicatedClearBtn) dedicatedClearBtn.style.display = query ? 'flex' : 'none';

    if (searchTimeout) clearTimeout(searchTimeout);
    if (!query) {
      closeSearchView();
      return;
    }

    searchTimeout = setTimeout(() => {
      openDedicatedSearch(query);
    }, 240);
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    if (dedicatedSearchInput) dedicatedSearchInput.value = '';
    if (dedicatedClearBtn) dedicatedClearBtn.style.display = 'none';
    closeSearchView();
    searchInput.focus();
  });

  // Dedicated Search Bar in Search View
  if (dedicatedSearchInput) {
    dedicatedSearchInput.addEventListener('input', () => {
      const query = dedicatedSearchInput.value.trim();
      dedicatedClearBtn.style.display = query ? 'flex' : 'none';
      if (searchInput) searchInput.value = query;
      if (clearSearchBtn) clearSearchBtn.style.display = query ? 'flex' : 'none';

      if (searchTimeout) clearTimeout(searchTimeout);
      if (!query) {
        renderFilteredSearchPool();
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
      renderFilteredSearchPool();
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

  // Mobile Bottom Nav Search Tab
  if (mobileSearchTab) {
    mobileSearchTab.addEventListener('click', () => {
      allNavButtons.forEach(b => b.classList.remove('active'));
      mobileSearchTab.classList.add('active');
      openDedicatedSearch('');
      if (dedicatedSearchInput) dedicatedSearchInput.focus();
    });
  }

  // =========================================================================
  // DEDICATED SEARCH VIEW & ADVANCED FILTERS
  // =========================================================================
  function openDedicatedSearch(query = '') {
    billboard.style.display = 'none';
    rowsContainer.style.display = 'none';
    if (mylistView) mylistView.style.display = 'none';
    searchView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (query) {
      executeSearchQuery(query);
    } else {
      renderFilteredSearchPool();
    }
  }

  function closeSearchView() {
    searchView.style.display = 'none';
    if (mylistView) mylistView.style.display = 'none';
    billboard.style.display = 'flex';
    rowsContainer.style.display = 'flex';
  }

  async function executeSearchQuery(query) {
    searchResultsHeading.textContent = `Search results for "${query}"`;
    searchCountBadge.textContent = 'Searching...';
    searchGrid.innerHTML = '<div class="shelf-loader"><div class="joy-spinner"></div><span>Searching Joywatch universe...</span></div>';

    try {
      const data = await fetchSearch(query);
      const items = data.items || [];
      renderSearchResultsWithFilters(items, `Search results for "${query}"`);
    } catch (err) {
      searchGrid.innerHTML = `<div class="shelf-loader"><span>Search error: ${err.message}</span></div>`;
    }
  }

  function renderFilteredSearchPool() {
    searchResultsHeading.textContent = 'Explore Curated Titles';
    const pool = (cachedCatalogPool && cachedCatalogPool.length > 0) ? cachedCatalogPool : [];
    renderSearchResultsWithFilters(pool, 'Explore Curated Titles');
  }

  function renderSearchResultsWithFilters(items, headingText = 'Explore Titles') {
    searchResultsHeading.textContent = headingText;

    // Apply active filter criteria
    let filtered = items.filter(item => {
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
    searchCountBadge.textContent = `${filtered.length} titles found`;

    if (filtered.length === 0) {
      searchGrid.innerHTML = `<div class="shelf-loader"><span>No titles found matching current filters. Try selecting "All" or a different keyword.</span></div>`;
      return;
    }

    filtered.forEach(item => {
      searchGrid.appendChild(createCardElement(item));
    });
  }

  // Setup Filter Pills Event Listeners
  function initFilterButtons() {
    // Type Filter Pills
    document.querySelectorAll('#type-filters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#type-filters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterState.type = btn.dataset.type || 'all';
        applyCurrentFilters();
      });
    });

    // Genre Filter Pills
    document.querySelectorAll('#genre-filters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#genre-filters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterState.genre = btn.dataset.genre || 'all';
        applyCurrentFilters();
      });
    });

    // Year Filter Pills
    document.querySelectorAll('#year-filters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#year-filters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterState.year = btn.dataset.year || 'all';
        applyCurrentFilters();
      });
    });

    // Rating Filter Pills
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
      renderFilteredSearchPool();
    }
  }

  initFilterButtons();

  // =========================================================================
  // NAVIGATION & VIEWS
  // =========================================================================
  allNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      if (!filter) return; // e.g. mobile search tab handled separately

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
      rowsContainer.style.display = 'none';
      if (mylistView) mylistView.style.display = 'block';
      renderMyListView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (mylistView) mylistView.style.display = 'none';
      searchView.style.display = 'none';
      billboard.style.display = 'flex';
      rowsContainer.style.display = 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      initHomeCatalog(filter);
    }
  }

  // Render My List View
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

    // Click card opens detail modal
    card.addEventListener('click', () => openDetailModal(item));

    // Center play button quick action
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

    // Left & Right Carousel Controls
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

    // See All Action
    const seeAllBtn = rowHeader.querySelector('.shelf-see-all');
    seeAllBtn.addEventListener('click', () => {
      if (filterCategory) {
        if (filterCategory === 'movie' || filterCategory === 'series') {
          filterState.type = filterCategory;
        } else {
          filterState.genre = filterCategory;
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
    if (currentFeaturedItem) {
      openDetailModal(currentFeaturedItem, true);
    }
  });

  billboardInfoBtn.addEventListener('click', () => {
    if (currentFeaturedItem) {
      openDetailModal(currentFeaturedItem);
    }
  });

  billboardMyListBtn.addEventListener('click', () => {
    if (currentFeaturedItem) {
      toggleJoyList(currentFeaturedItem);
    }
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

    // Populate Hero Section inside Modal
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

    // Fetch Full Metadata (Cast, Crew, Videos, Similar)
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

      // Pre-load streaming sources silently
      loadStreams(item.type || 'movie', item.id, 1, 1, autoPlay);
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

  // Setup TV Episodes Browser
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

  // Modal Play Button (Defaults to topmost server)
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

  // Launch Video Player
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

    const isWebEmbed = isEmbed || url.includes('/embed') || url.includes('vidlink.pro') || url.includes('2embed') || url.includes('autoembed') || url.includes('vidsrc');

    if (isWebEmbed) {
      htmlVideo.pause();
      htmlVideo.src = '';
      htmlVideo.style.display = 'none';

      playerIframe.style.display = 'block';
      playerIframe.src = url;
    } else {
      playerIframe.src = 'about:blank';
      playerIframe.style.display = 'none';

      htmlVideo.style.display = 'block';
      htmlVideo.src = url;
      htmlVideo.play().catch(() => {});
    }
  }

  function closeVideoPlayer() {
    if (!videoPlayer.classList.contains('open') || isPlayerAnimating) return;
    closeServersPanel();
    isPlayerAnimating = true;
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

  // Right-Side Server Switcher Dropdown
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
    const playUrl = stream.browser_url || stream.url;
    if (!playUrl) return;

    let serverLabel = `Server ${index + 1}`;
    const titleLower = (stream.title || '').toLowerCase();
    if (titleLower.includes('vidlink')) serverLabel = 'Server 1 (VidLink)';
    else if (titleLower.includes('2embed')) serverLabel = 'Server 2 (2Embed)';
    else if (titleLower.includes('autoembed')) serverLabel = 'Server 3 (AutoEmbed)';
    else if (titleLower.includes('vidsrc')) serverLabel = 'Server 4 (VidSrc)';

    playerSub.textContent = `${serverLabel} • ${stream.quality || '1080p'}`;

    const isWebEmbed = stream.is_embed || playUrl.includes('/embed') || playUrl.includes('vidlink.pro') || playUrl.includes('2embed') || playUrl.includes('autoembed') || playUrl.includes('vidsrc');

    if (isWebEmbed) {
      htmlVideo.pause();
      htmlVideo.src = '';
      htmlVideo.style.display = 'none';

      playerIframe.style.display = 'block';
      playerIframe.src = playUrl;
    } else {
      playerIframe.src = 'about:blank';
      playerIframe.style.display = 'none';

      htmlVideo.style.display = 'block';
      htmlVideo.src = playUrl;
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

  // Global keydown listener for Escape
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

  // Toast Notification (Lime accent, spring motion)
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
  // CATALOG LOADING (Trending Now, Popular Movies, TV Shows, Action, Anime)
  // =========================================================================
  async function initHomeCatalog(filter = 'all') {
    rowsContainer.innerHTML = '<div class="shelf-loader"><div class="joy-spinner"></div><span>Loading Joywatch universe...</span></div>';

    try {
      const fetches = [];

      if (filter === 'all' || filter === 'movie') {
        fetches.push(fetchCatalog('movie'));
      }
      if (filter === 'all' || filter === 'series') {
        fetches.push(fetchCatalog('series'));
      }
      if (filter === 'all' || filter === 'movie') {
        fetches.push(fetchCatalog('movie', 'Action'));
      }
      if (filter === 'all' || filter === 'movie') {
        fetches.push(fetchCatalog('movie', 'Sci-Fi'));
      }
      if (filter === 'all' || filter === 'series' || filter === 'anime') {
        fetches.push(fetchCatalog('series', 'Animation'));
      }
      fetches.push(safeFetchJson('/api/history', () => ({ recent: [] })).then(r => r || { recent: [] }));

      const results = await Promise.all(fetches);
      rowsContainer.innerHTML = '';
      let featuredSet = false;

      // Continue Watching Row (from server history)
      const historyData = results[results.length - 1];
      const historyItems = (historyData && historyData.recent) ? historyData.recent.map(h => ({
        id: h.subject_id,
        name: h.title,
        poster: h.cover_url,
        background: h.cover_url,
        year: h.release_year || '2025',
        type: h.stype === 2 ? 'series' : 'movie',
        imdbRating: '8.8'
      })) : [];

      if (historyItems.length > 0 && filter === 'all') {
        const historyRow = createRowElement('Continue Watching', historyItems);
        if (historyRow) rowsContainer.appendChild(historyRow);
      }

      // Catalog Sections
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

      if (filter === 'all' || filter === 'series') {
        const topSeries = results[idx++].items || [];
        if (filter === 'series' && topSeries.length > 0 && !featuredSet) {
          setBillboard(topSeries[0]);
          featuredSet = true;
        }
        const row = createRowElement('Popular TV Shows', topSeries, 'series');
        if (row) rowsContainer.appendChild(row);
      }

      if (filter === 'all' || filter === 'movie') {
        const actionMovies = results[idx++].items || [];
        const row = createRowElement('Action & Adventure', actionMovies, 'Action');
        if (row) rowsContainer.appendChild(row);
      }

      if (filter === 'all' || filter === 'movie') {
        const sciFiMovies = results[idx++].items || [];
        const row = createRowElement('Sci-Fi & Fantasy', sciFiMovies, 'Sci-Fi');
        if (row) rowsContainer.appendChild(row);
      }

      if (filter === 'all' || filter === 'series' || filter === 'anime') {
        const animeShows = results[idx++].items || [];
        const row = createRowElement('Popular Animation & Anime', animeShows, 'Animation');
        if (row) rowsContainer.appendChild(row);
      }

      // My List Shelf on Home (if items saved)
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
