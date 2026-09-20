/**
 * Joywatch - Ambient Cinema Streaming & Discovery
 * Ultra-Smooth Kinetic Animation Architecture
 * - Zero Gradients
 * - Zero Purple
 * - Zero Emojis
 * - Round Corner Buttons
 * - Small Icons & Large Movie Posters
 * - Small Joywatch Text & Nav Typography
 * - Large Comfortable Search Bar
 * - GPU Accelerated Fluid Physics & Transitions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navbar = document.getElementById('navbar');
  const searchBox = document.getElementById('search-box');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const navPills = document.querySelectorAll('.nav-pill');
  const rowsContainer = document.getElementById('rows-container');
  const searchView = document.getElementById('search-view');
  const searchGrid = document.getElementById('search-grid');
  const searchResultsHeading = document.getElementById('search-results-heading');
  const searchCountBadge = document.getElementById('search-count-badge');
  const billboard = document.getElementById('billboard');
  const joylistCounter = document.getElementById('joylist-counter');

  // Hero Elements
  const billboardBg = document.getElementById('billboard-bg');
  const billboardTitle = document.getElementById('billboard-title');
  const billboardMatch = document.getElementById('billboard-match');
  const billboardYear = document.getElementById('billboard-year');
  const billboardGenres = document.getElementById('billboard-genres');
  const billboardSynopsis = document.getElementById('billboard-synopsis');
  const billboardPlayBtn = document.getElementById('billboard-play-btn');
  const billboardInfoBtn = document.getElementById('billboard-info-btn');

  // Detail Modal Elements
  const detailModal = document.getElementById('detail-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBanner = document.getElementById('modal-banner');
  const modalTitle = document.getElementById('modal-title');
  const modalPlayBtn = document.getElementById('modal-play-btn');
  const modalMyListBtn = document.getElementById('modal-mylist-btn');
  const modalMatch = document.getElementById('modal-match');
  const modalYear = document.getElementById('modal-year');
  const modalRuntime = document.getElementById('modal-runtime');
  const modalSynopsis = document.getElementById('modal-synopsis');
  const modalGenres = document.getElementById('modal-genres');
  const modalRating = document.getElementById('modal-rating');
  const modalType = document.getElementById('modal-type');
  const episodesSection = document.getElementById('episodes-section');
  const seasonSelect = document.getElementById('season-select');
  const episodesList = document.getElementById('episodes-list');
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

  // State
  let currentFeaturedItem = null;
  let activeModalItem = null;
  let activeModalStreams = [];
  let currentServerIndex = 0;
  let searchTimeout = null;
  let isModalAnimating = false;
  let isPlayerAnimating = false;

  // LocalStorage for JoyList
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
  }

  function isInJoyList(id) {
    return getJoyList().some(item => item.id === id);
  }

  function toggleJoyList(item) {
    let list = getJoyList();
    const index = list.findIndex(i => i.id === item.id);
    if (index >= 0) {
      list.splice(index, 1);
      updateMyListBtn(false);
      showToast(`Removed "${item.name}" from JoyList`);
    } else {
      list.unshift(item);
      updateMyListBtn(true);
      showToast(`Added "${item.name}" to JoyList`);
    }
    saveJoyList(list);
  }

  function updateJoylistCounter() {
    const count = getJoyList().length;
    if (joylistCounter) {
      joylistCounter.textContent = count;
    }
    const mobileCounter = document.getElementById('mobile-joylist-counter');
    if (mobileCounter) {
      mobileCounter.textContent = count;
    }
  }

  function updateMyListBtn(isSaved) {
    if (!modalMyListBtn) return;
    if (isSaved) {
      modalMyListBtn.classList.add('active');
      modalMyListBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      `;
    } else {
      modalMyListBtn.classList.remove('active');
      modalMyListBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      `;
    }
  }

  updateJoylistCounter();

  // Robust API Fetch with Direct Client Fallback (Zero downtime on Vercel or any static host)
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
        type: m.type,
        year: String(m.year || m.releaseInfo || ''),
        poster: m.poster,
        background: m.background || m.poster,
        description: m.description || '',
        genres: m.genres || [],
        imdbRating: m.imdbRating || '8.5'
      }));
      return { items };
    });
    return data || { items: [] };
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
            type: m.type,
            year: String(m.year || m.releaseInfo || ''),
            poster: m.poster,
            background: m.background || m.poster,
            description: m.description || '',
            genres: m.genres || [],
            imdbRating: m.imdbRating || '8.0'
          });
        }
      }
      return { items: items.slice(0, 40) };
    });
    return data || { items: [] };
  }

  async function fetchStreams(type, id, title, season = 1, episode = 1) {
    const apiPath = `/api/streams?type=${type}&id=${id}&title=${encodeURIComponent(title)}&season=${season}&episode=${episode}`;
    const data = await safeFetchJson(apiPath, async () => {
      const cleanTitle = title || "Feature Film";
      const s = parseInt(season) || 1;
      const e = parseInt(episode) || 1;
      const streams = [];
      if (type === 'series') {
        streams.push(
          { name: "VidLink Fast Cloud", title: `VidLink 1080p Ultra HD (S${s}:E${e})`, quality: "1080p Ultra HD", url: `https://vidlink.pro/tv/${id}/${s}/${e}`, browser_url: `https://vidlink.pro/tv/${id}/${s}/${e}`, direct_playable: true, is_embed: true },
          { name: "2Embed Multi-Server", title: `2Embed 1080p Full HD (S${s}:E${e})`, quality: "1080p Full HD", url: `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`, browser_url: `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`, direct_playable: true, is_embed: true },
          { name: "AutoEmbed Cloud", title: `AutoEmbed High-Speed (S${s}:E${e})`, quality: "1080p HD", url: `https://autoembed.co/tv/imdb/${id}/${s}/${e}`, browser_url: `https://autoembed.co/tv/imdb/${id}/${s}/${e}`, direct_playable: true, is_embed: true },
          { name: "VidSrc Mirror", title: `VidSrc HD Mirror (S${s}:E${e})`, quality: "720p/1080p HD", url: `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`, browser_url: `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`, direct_playable: true, is_embed: true }
        );
      } else {
        streams.push(
          { name: "VidLink Fast Cloud", title: `${cleanTitle} - 1080p Ultra HD (Instant Play)`, quality: "1080p Ultra HD", url: `https://vidlink.pro/movie/${id}`, browser_url: `https://vidlink.pro/movie/${id}`, direct_playable: true, is_embed: true },
          { name: "2Embed Multi-Server", title: `${cleanTitle} - 1080p Full HD (Multi-Language)`, quality: "1080p Full HD", url: `https://www.2embed.cc/embed/${id}`, browser_url: `https://www.2embed.cc/embed/${id}`, direct_playable: true, is_embed: true },
          { name: "AutoEmbed Cloud", title: `${cleanTitle} - 1080p High-Speed Stream`, quality: "1080p HD", url: `https://autoembed.co/movie/imdb/${id}`, browser_url: `https://autoembed.co/movie/imdb/${id}`, direct_playable: true, is_embed: true },
          { name: "VidSrc Mirror", title: `${cleanTitle} - Fast HD Mirror`, quality: "720p/1080p HD", url: `https://vidsrc.pm/embed/movie/${id}`, browser_url: `https://vidsrc.pm/embed/movie/${id}`, direct_playable: true, is_embed: true }
        );
      }
      return { streams };
    });
    return data || { streams: [] };
  }

  // Navbar Scroll Transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Search Functionality
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    clearSearchBtn.style.display = query ? 'flex' : 'none';

    if (searchTimeout) clearTimeout(searchTimeout);
    if (!query) {
      closeSearchView();
      return;
    }

    searchTimeout = setTimeout(() => {
      performSearch(query);
    }, 240);
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    closeSearchView();
    searchInput.focus();
  });

  // Global '/' keyboard shortcut to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  async function performSearch(query) {
    billboard.style.display = 'none';
    rowsContainer.style.display = 'none';
    searchView.style.display = 'block';
    searchResultsHeading.textContent = `Search results for "${query}"`;
    searchCountBadge.textContent = 'Searching...';
    searchGrid.innerHTML = '<div class="shelf-loader"><div class="joy-spinner"></div><span>Searching Joywatch universe...</span></div>';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const data = await fetchSearch(query);
      const items = data.items || [];

      searchGrid.innerHTML = '';
      searchCountBadge.textContent = `${items.length} titles found`;

      if (items.length === 0) {
        searchGrid.innerHTML = `<div class="shelf-loader"><span>No titles found matching "${query}". Try searching another name or genre.</span></div>`;
        return;
      }

      items.forEach(item => {
        searchGrid.appendChild(createCardElement(item));
      });
    } catch (err) {
      searchGrid.innerHTML = `<div class="shelf-loader"><span>Search error: ${err.message}</span></div>`;
    }
  }

  function closeSearchView() {
    searchView.style.display = 'none';
    billboard.style.display = 'flex';
    rowsContainer.style.display = 'flex';
  }

  // Navigation Filter Pills (Syncs desktop header pills & mobile bottom nav pills)
  const allNavButtons = document.querySelectorAll('.nav-pill, .bottom-nav-pill');
  allNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      allNavButtons.forEach(b => {
        if (b.dataset.filter === filter) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      handleFilterChange(filter);
    });
  });

  function handleFilterChange(filter) {
    closeSearchView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (filter === 'mylist') {
      billboard.style.display = 'none';
      renderJoyListView();
    } else {
      billboard.style.display = 'flex';
      initHomeCatalog(filter);
    }
  }

  function renderJoyListView() {
    rowsContainer.innerHTML = '';
    const list = getJoyList();
    const row = document.createElement('div');
    row.className = 'shelf-row';
    row.innerHTML = `
      <div class="shelf-header">
        <h2 class="shelf-title">My JoyList (${list.length})</h2>
      </div>
    `;

    if (list.length === 0) {
      row.innerHTML += `<div class="shelf-loader"><span>You have not saved any titles yet. Click the bookmark icon on any title to save it to your JoyList.</span></div>`;
      rowsContainer.appendChild(row);
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'joy-grid';
    list.forEach(item => {
      grid.appendChild(createCardElement(item));
    });
    row.appendChild(grid);
    rowsContainer.appendChild(row);
  }

  // Create Card Element with Image Fade-in & Micro-Interactions
  function createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    const poster = item.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=85';
    const rating = item.imdbRating || '8.5';
    const year = item.year || '2025';

    card.innerHTML = `
      <div class="card-poster-wrapper">
        <img class="card-poster" src="${poster}" alt="${item.name}" loading="lazy" onload="this.classList.add('loaded')" onerror="this.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=85'; this.classList.add('loaded');">
        <div class="card-top-pill">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>${rating}</span>
        </div>
        <div class="card-quick-actions">
          <button class="card-action-mini" title="Play">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
          </button>
        </div>
      </div>
      <div class="card-meta-box">
        <div class="card-title">${item.name}</div>
        <div class="card-subline">
          <span>${year}</span>
          <span>•</span>
          <span>${item.type === 'series' ? 'Series' : 'Movie'}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openDetailModal(item));
    return card;
  }

  // Smooth Momentum & Drag-to-Scroll on Tracks
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

  // Build Row Element with Smooth Scroll & Arrows
  function createRowElement(title, items) {
    if (!items || items.length === 0) return null;

    const row = document.createElement('div');
    row.className = 'shelf-row';

    const rowHeader = document.createElement('div');
    rowHeader.className = 'shelf-header';
    rowHeader.innerHTML = `
      <h2 class="shelf-title">${title}</h2>
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

    // Attach smooth drag-to-scroll
    attachSmoothDragScroll(track);

    // Arrow button controls with dynamic responsive step
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

    row.appendChild(rowHeader);
    row.appendChild(track);
    return row;
  }

  // Set Featured Hero Billboard with Smooth Cross-Fade
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
    billboardMatch.textContent = `${Math.floor(Math.random() * 4) + 96}% Match`;
    billboardYear.textContent = item.year || '2026';
    billboardGenres.textContent = (item.genres && item.genres.length > 0) ? item.genres.slice(0, 3).join(' • ') : 'Action • Sci-Fi';
    billboardSynopsis.textContent = item.description || 'Watch the latest critically acclaimed cinematic releases, high-stakes thrills, and stunning visuals with instant high-speed streaming on Joywatch.';
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

  // Open Detail Modal with Liquid Entrance Physics
  async function openDetailModal(item, autoPlay = false) {
    if (isModalAnimating) return;
    activeModalItem = item;

    // Display container and trigger fluid CSS transition
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
    modalMatch.textContent = `${Math.floor(Math.random() * 4) + 96}% Match`;
    modalYear.textContent = item.year || '2026';
    modalRuntime.textContent = item.type === 'series' ? 'TV Series' : '2h 12m';
    modalSynopsis.textContent = item.description || 'Loading story overview...';
    modalGenres.textContent = (item.genres && item.genres.length > 0) ? item.genres.join(', ') : 'Drama, Action';
    modalRating.textContent = `${item.imdbRating || '8.6'} / 10`;
    modalType.textContent = item.type === 'series' ? 'TV Series' : 'Feature Film';

    updateMyListBtn(isInJoyList(item.id));
    episodesSection.style.display = 'none';

    try {
      const metaData = await fetchMeta(item.type || 'movie', item.id);
      const meta = metaData.meta || {};

      if (meta.description) modalSynopsis.textContent = meta.description;
      if (meta.background) modalBanner.style.backgroundImage = `url('${meta.background}')`;

      if (item.type === 'series' && meta.videos && meta.videos.length > 0) {
        setupEpisodes(meta.videos);
      }

      // Silently pre-load streams in background so they are ready for instant playback
      loadStreams(item.type || 'movie', item.id, 1, 1, autoPlay);
    } catch (err) {
      console.error('Error fetching details:', err);
    }
  }

  // Close Detail Modal with Smooth Exit
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

  // Load Streams
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

      // If video player is open, dynamically update the server switcher pills
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
      if (videoPlayer && videoPlayer.classList.contains('open')) {
        renderPlayerServerPills(currentServerIndex);
      }
    }
  }

  // Setup Episodes List for TV Shows
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

  // Toast Notification (Ultra-Smooth Spring)
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
    }, 3200);
  }

  // Dynamic Server Switcher Dropdown (Right Side Option)
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

      // Clean server display name
      let serverLabel = `Server ${idx + 1}`;
      const titleLower = (s.title || '').toLowerCase();
      const nameLower = (s.name || '').toLowerCase();
      if (titleLower.includes('vidlink') || nameLower.includes('vidlink')) {
        serverLabel = `Server 1 (VidLink)`;
      } else if (titleLower.includes('2embed') || nameLower.includes('2embed')) {
        serverLabel = `Server 2 (2Embed)`;
      } else if (titleLower.includes('autoembed') || nameLower.includes('autoembed')) {
        serverLabel = `Server 3 (AutoEmbed)`;
      } else if (titleLower.includes('vidsrc') || nameLower.includes('vidsrc')) {
        serverLabel = `Server 4 (VidSrc)`;
      } else if (s.name) {
        serverLabel = `Server ${idx + 1} (${s.name})`;
      }

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
      let activeLabel = `Server ${activeIndex + 1} Active`;
      const titleLower = (streams[activeIndex].title || '').toLowerCase();
      if (titleLower.includes('vidlink')) activeLabel = 'Server 1 Active';
      else if (titleLower.includes('2embed')) activeLabel = 'Server 2 Active';
      else if (titleLower.includes('autoembed')) activeLabel = 'Server 3 Active';
      else if (titleLower.includes('vidsrc')) activeLabel = 'Server 4 Active';
      serversActiveTag.textContent = activeLabel;
    }
  }

  // Switch Stream Server
  function switchPlayerServer(index) {
    if (!activeModalStreams || !activeModalStreams[index]) return;
    currentServerIndex = index;
    const stream = activeModalStreams[index];
    const playUrl = stream.browser_url || stream.url;
    if (!playUrl) return;

    // Determine clean label
    let serverLabel = `Server ${index + 1}`;
    const titleLower = (stream.title || '').toLowerCase();
    const nameLower = (stream.name || '').toLowerCase();
    if (titleLower.includes('vidlink') || nameLower.includes('vidlink')) serverLabel = 'Server 1 (VidLink)';
    else if (titleLower.includes('2embed') || nameLower.includes('2embed')) serverLabel = 'Server 2 (2Embed)';
    else if (titleLower.includes('autoembed') || nameLower.includes('autoembed')) serverLabel = 'Server 3 (AutoEmbed)';
    else if (titleLower.includes('vidsrc') || nameLower.includes('vidsrc')) serverLabel = 'Server 4 (VidSrc)';
    else if (stream.name) serverLabel = `Server ${index + 1} (${stream.name})`;

    // Update active styling in the dropdown list
    if (playerServersContainer) {
      const items = playerServersContainer.querySelectorAll('.servers-panel-item');
      items.forEach((p, idx) => {
        if (idx === index) p.classList.add('active');
        else p.classList.remove('active');
      });
    }

    if (serversActiveTag) {
      serversActiveTag.textContent = `${serverLabel.split(' ')[0]} ${serverLabel.split(' ')[1] || ''} Active`;
    }

    // Update player subline
    playerSub.textContent = `${serverLabel} • ${stream.quality || '1080p'}`;

    // Switch iframe / video source
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

  // Right-Side Servers Dropdown Handlers
  function toggleServersPanel() {
    if (!playerServersPanel) return;
    const isVisible = playerServersPanel.style.display !== 'none';
    if (isVisible) {
      closeServersPanel();
    } else {
      openServersPanel();
    }
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

  // Click outside to dismiss servers panel
  document.addEventListener('click', (e) => {
    if (playerServersPanel && playerServersPanel.style.display !== 'none') {
      if (playerServersDropdown && !playerServersDropdown.contains(e.target)) {
        closeServersPanel();
      }
    }
  });

  // Video Player with Fluid Transitions
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

    // Render the right-side servers dropdown items
    renderPlayerServerPills(activeIndex);

    const isWebEmbed = isEmbed || url.includes('/embed') || url.includes('vidlink.pro') || url.includes('2embed') || url.includes('autoembed') || url.includes('vidsrc') || url.includes('123embed');

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

    // Topmost fallback if streams not yet loaded
    const fallbackId = activeModalItem ? activeModalItem.id : '';
    const fallbackType = activeModalItem ? activeModalItem.type : 'movie';
    const directUrl = fallbackType === 'series'
      ? `https://vidlink.pro/tv/${fallbackId}/1/1`
      : `https://vidlink.pro/movie/${fallbackId}`;
    launchVideoPlayer(directUrl, itemTitle, 'Server 1 (VidLink) • 1080p Ultra HD', true, 0);
  });

  modalMyListBtn.addEventListener('click', () => {
    if (activeModalItem) {
      toggleJoyList(activeModalItem);
    }
  });

  modalCloseBtn.addEventListener('click', closeDetailModal);

  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
      closeDetailModal();
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

  // Catalog Loading (Zero emojis in headings)
  async function initHomeCatalog(filter = 'all') {
    rowsContainer.innerHTML = '<div class="shelf-loader"><div class="joy-spinner"></div><span>Curating Joywatch Catalog...</span></div>';

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
      if (filter === 'all' || filter === 'anime') {
        fetches.push(fetchCatalog('series', 'Animation'));
      }
      fetches.push(safeFetchJson('/api/history', () => ({ recent: [] })).then(r => r || { recent: [] }));

      const results = await Promise.all(fetches);
      rowsContainer.innerHTML = '';
      let featuredSet = false;

      // History / Continue Watching Row
      const historyData = results[results.length - 1];
      const historyItems = (historyData && historyData.recent) ? historyData.recent.map(h => ({
        id: h.subject_id,
        name: h.title,
        poster: h.cover_url,
        background: h.cover_url,
        year: h.release_year,
        type: h.stype === 2 ? 'series' : 'movie',
      })) : [];

      if (historyItems.length > 0 && filter === 'all') {
        const historyRow = createRowElement('Continue Watching', historyItems);
        if (historyRow) rowsContainer.appendChild(historyRow);
      }

      // Catalog Rows
      let idx = 0;
      if (filter === 'all' || filter === 'movie') {
        const trendingMovies = results[idx++].items || [];
        if (trendingMovies.length > 0 && !featuredSet) {
          setBillboard(trendingMovies[0]);
          featuredSet = true;
        }
        const row = createRowElement('Trending Today', trendingMovies);
        if (row) rowsContainer.appendChild(row);
      }

      if (filter === 'all' || filter === 'series') {
        const topSeries = results[idx++].items || [];
        if (filter === 'series' && topSeries.length > 0) {
          setBillboard(topSeries[0]);
          featuredSet = true;
        }
        const row = createRowElement('Featured Series', topSeries);
        if (row) rowsContainer.appendChild(row);
      }

      if (filter === 'all' || filter === 'movie') {
        const actionMovies = results[idx++].items || [];
        const row = createRowElement('Action & Sci-Fi', actionMovies);
        if (row) rowsContainer.appendChild(row);
      }

      if (filter === 'all' || filter === 'anime') {
        const animeShows = results[idx++].items || [];
        if (filter === 'anime' && animeShows.length > 0) {
          setBillboard(animeShows[0]);
          featuredSet = true;
        }
        const row = createRowElement('Popular Anime', animeShows);
        if (row) rowsContainer.appendChild(row);
      }

      // JoyList Row on Home
      const joyList = getJoyList();
      if (joyList.length > 0 && filter === 'all') {
        const row = createRowElement('Your JoyList', joyList);
        if (row) rowsContainer.appendChild(row);
      }

    } catch (err) {
      rowsContainer.innerHTML = `<div class="shelf-loader"><span>Failed to load Joywatch universe: ${err.message}</span></div>`;
    }
  }

  // Initial Load
  initHomeCatalog('all');
});
