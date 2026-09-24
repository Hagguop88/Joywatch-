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

  // Search & Filter State
  const filterState = {
    platform: 'all',
    type: 'all',
    genre: 'all',
    year: 'all',
    rating: 'all'
  };

  // =========================================================================
  // CANONICAL OTT PLATFORMS DATA (Netflix, Prime, Disney+, Crunchyroll, Paramount+)
  // =========================================================================
  const OTT_DATA = {
    netflix: [
      { id: 'tt4574334', name: 'Stranger Things', type: 'series', year: '2025', imdbRating: '8.7', genres: ['Sci-Fi', 'Drama', 'Horror'], poster: 'https://images.metahub.space/poster/medium/tt4574334/img', background: 'https://images.metahub.space/background/medium/tt4574334/img', description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.', platform: 'netflix' },
      { id: 'tt10919420', name: 'Squid Game', type: 'series', year: '2024', imdbRating: '8.0', genres: ['Action', 'Drama', 'Mystery'], poster: 'https://images.metahub.space/poster/medium/tt10919420/img', background: 'https://images.metahub.space/background/medium/tt10919420/img', description: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games. Inside, a tempting prize awaits with deadly high stakes.', platform: 'netflix' },
      { id: 'tt13443470', name: 'Wednesday', type: 'series', year: '2025', imdbRating: '8.1', genres: ['Comedy', 'Crime', 'Fantasy'], poster: 'https://images.metahub.space/poster/medium/tt13443470/img', background: 'https://images.metahub.space/background/medium/tt13443470/img', description: 'Follows Wednesday Addams\' years as a student, when she attempts to master her emerging psychic ability, thwart and solve the mystery that embroiled her parents.', platform: 'netflix' },
      { id: 'tt7991608', name: 'Red Notice', type: 'movie', year: '2021', imdbRating: '6.3', genres: ['Action', 'Comedy', 'Thriller'], poster: 'https://images.metahub.space/poster/medium/tt7991608/img', background: 'https://images.metahub.space/background/medium/tt7991608/img', description: 'An Interpol agent tracks the world\'s most wanted art thief, only to find himself entangled in a daring heist partnership.', platform: 'netflix' },
      { id: 'tt11564570', name: 'Glass Onion: A Knives Out Mystery', type: 'movie', year: '2022', imdbRating: '7.1', genres: ['Comedy', 'Crime', 'Drama'], poster: 'https://images.metahub.space/poster/medium/tt11564570/img', background: 'https://images.metahub.space/background/medium/tt11564570/img', description: 'Famed Southern detective Benoit Blanc travels to Greece for his latest case, peeling back the layers of an extravagant tech mogul\'s murder mystery game.', platform: 'netflix' },
      { id: 'tt5180504', name: 'The Witcher', type: 'series', year: '2023', imdbRating: '8.0', genres: ['Action', 'Adventure', 'Fantasy'], poster: 'https://images.metahub.space/poster/medium/tt5180504/img', background: 'https://images.metahub.space/background/medium/tt5180504/img', description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.', platform: 'netflix' },
      { id: 'tt12263384', name: 'Extraction 2', type: 'movie', year: '2023', imdbRating: '7.0', genres: ['Action', 'Thriller'], poster: 'https://images.metahub.space/poster/medium/tt12263384/img', background: 'https://images.metahub.space/background/medium/tt12263384/img', description: 'Back from the brink of death, highly skilled commando Tyler Rake takes on another dangerous mission: saving the battered family of a ruthless Georgian gangster.', platform: 'netflix' },
      { id: 'tt2085059', name: 'Black Mirror', type: 'series', year: '2023', imdbRating: '8.7', genres: ['Drama', 'Sci-Fi', 'Thriller'], poster: 'https://images.metahub.space/poster/medium/tt2085059/img', background: 'https://images.metahub.space/background/medium/tt2085059/img', description: 'An anthology series exploring a twisted, high-tech multiverse where humanity\'s greatest innovations and darkest instincts collide.', platform: 'netflix' }
    ],
    prime: [
      { id: 'tt1190634', name: 'The Boys', type: 'series', year: '2024', imdbRating: '8.7', genres: ['Action', 'Comedy', 'Drama'], poster: 'https://images.metahub.space/poster/medium/tt1190634/img', background: 'https://images.metahub.space/background/medium/tt1190634/img', description: 'A fun and irreverent take on what happens when superheroes abuse their superpowers rather than use them for good.', platform: 'prime' },
      { id: 'tt12637874', name: 'Fallout', type: 'series', year: '2024', imdbRating: '8.4', genres: ['Action', 'Adventure', 'Drama'], poster: 'https://images.metahub.space/poster/medium/tt12637874/img', background: 'https://images.metahub.space/background/medium/tt12637874/img', description: 'In a future post-apocalyptic Los Angeles brought about by nuclear decimation, citizens must live in underground bunkers to protect themselves from radiation and mutants.', platform: 'prime' },
      { id: 'tt9288030', name: 'Reacher', type: 'series', year: '2024', imdbRating: '8.1', genres: ['Action', 'Crime', 'Drama'], poster: 'https://images.metahub.space/poster/medium/tt9288030/img', background: 'https://images.metahub.space/background/medium/tt9288030/img', description: 'Jack Reacher, a veteran military police investigator, enters civilian life and moves from town to town, exploring the nation he once served.', platform: 'prime' },
      { id: 'tt6741278', name: 'Invincible', type: 'series', year: '2024', imdbRating: '8.7', genres: ['Animation', 'Action', 'Adventure'], poster: 'https://images.metahub.space/poster/medium/tt6741278/img', background: 'https://images.metahub.space/background/medium/tt6741278/img', description: 'An adult animated series based on the Skybound/Image comic about a teenager whose father is the most powerful superhero on the planet.', platform: 'prime' },
      { id: 'tt7631058', name: 'The Lord of the Rings: The Rings of Power', type: 'series', year: '2024', imdbRating: '7.0', genres: ['Action', 'Adventure', 'Drama'], poster: 'https://images.metahub.space/poster/medium/tt7631058/img', background: 'https://images.metahub.space/background/medium/tt7631058/img', description: 'Epic drama set thousands of years before the events of J.R.R. Tolkien\'s \'The Hobbit\' and \'The Lord of the Rings\'.', platform: 'prime' },
      { id: 'tt3359350', name: 'Road House', type: 'movie', year: '2024', imdbRating: '6.2', genres: ['Action', 'Thriller'], poster: 'https://images.metahub.space/poster/medium/tt3359350/img', background: 'https://images.metahub.space/background/medium/tt3359350/img', description: 'Ex-UFC fighter Dalton takes a job as a bouncer at a Florida Keys roadhouse, only to discover that this paradise is not all it seems.', platform: 'prime' }
    ],
    disney: [
      { id: 'tt9140554', name: 'Loki', type: 'series', year: '2023', imdbRating: '8.2', genres: ['Action', 'Adventure', 'Fantasy'], poster: 'https://images.metahub.space/poster/medium/tt9140554/img', background: 'https://images.metahub.space/background/medium/tt9140554/img', description: 'The mercurial villain Loki resumes his role as the God of Mischief in a series that takes place after the events of Avengers: Endgame.', platform: 'disney' },
      { id: 'tt8111088', name: 'The Mandalorian', type: 'series', year: '2023', imdbRating: '8.6', genres: ['Action', 'Adventure', 'Sci-Fi'], poster: 'https://images.metahub.space/poster/medium/tt8111088/img', background: 'https://images.metahub.space/background/medium/tt8111088/img', description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.', platform: 'disney' },
      { id: 'tt6263850', name: 'Deadpool & Wolverine', type: 'movie', year: '2024', imdbRating: '7.8', genres: ['Action', 'Comedy', 'Sci-Fi'], poster: 'https://images.metahub.space/poster/medium/tt6263850/img', background: 'https://images.metahub.space/background/medium/tt6263850/img', description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy.', platform: 'disney' },
      { id: 'tt22022452', name: 'Inside Out 2', type: 'movie', year: '2024', imdbRating: '7.6', genres: ['Animation', 'Adventure', 'Comedy'], poster: 'https://images.metahub.space/poster/medium/tt22022452/img', background: 'https://images.metahub.space/background/medium/tt22022452/img', description: 'Follows Riley in her teenage years as she encounters new emotions like Anxiety, Envy, and Embarrassment.', platform: 'disney' },
      { id: 'tt4154796', name: 'Avengers: Endgame', type: 'movie', year: '2019', imdbRating: '8.4', genres: ['Action', 'Adventure', 'Drama'], poster: 'https://images.metahub.space/poster/medium/tt4154796/img', background: 'https://images.metahub.space/background/medium/tt4154796/img', description: 'After the devastating events of Infinity War, the universe is in ruins. The remaining Avengers assemble once more to reverse Thanos\' actions.', platform: 'disney' },
      { id: 'tt9253284', name: 'Andor', type: 'series', year: '2025', imdbRating: '8.4', genres: ['Action', 'Adventure', 'Drama'], poster: 'https://images.metahub.space/poster/medium/tt9253284/img', background: 'https://images.metahub.space/background/medium/tt9253284/img', description: 'Prequel series to Star Wars\' \'Rogue One\'. In an era filled with danger, deception and intrigue, Cassian will embark on the path that is destined to turn him into a Rebel hero.', platform: 'disney' }
    ],
    crunchyroll: [
      { id: 'tt9335498', name: 'Demon Slayer: Kimetsu no Yaiba', type: 'series', year: '2024', imdbRating: '8.6', genres: ['Animation', 'Action', 'Adventure'], poster: 'https://images.metahub.space/poster/medium/tt9335498/img', background: 'https://images.metahub.space/background/medium/tt9335498/img', description: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly.', platform: 'crunchyroll' },
      { id: 'tt2560140', name: 'Attack on Titan', type: 'series', year: '2023', imdbRating: '9.1', genres: ['Animation', 'Action', 'Adventure'], poster: 'https://images.metahub.space/poster/medium/tt2560140/img', background: 'https://images.metahub.space/background/medium/tt2560140/img', description: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.', platform: 'crunchyroll' },
      { id: 'tt12343534', name: 'Jujutsu Kaisen', type: 'series', year: '2023', imdbRating: '8.6', genres: ['Animation', 'Action', 'Adventure'], poster: 'https://images.metahub.space/poster/medium/tt12343534/img', background: 'https://images.metahub.space/background/medium/tt12343534/img', description: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman\'s school to be able to locate the demon\'s other body parts and thus exorcise himself.', platform: 'crunchyroll' },
      { id: 'tt21209876', name: 'Solo Leveling', type: 'series', year: '2024', imdbRating: '8.3', genres: ['Animation', 'Action', 'Adventure'], poster: 'https://images.metahub.space/poster/medium/tt21209876/img', background: 'https://images.metahub.space/background/medium/tt21209876/img', description: 'In a world where hunters must battle deadly monsters to protect mankind, the weakest hunter discovers a pathway to unlimited power.', platform: 'crunchyroll' },
      { id: 'tt13616990', name: 'Chainsaw Man', type: 'series', year: '2022', imdbRating: '8.4', genres: ['Animation', 'Action', 'Adventure'], poster: 'https://images.metahub.space/poster/medium/tt13616990/img', background: 'https://images.metahub.space/background/medium/tt13616990/img', description: 'Following a betrayal, a young man left for the dead is reborn as a powerful devil-human hybrid after merging with his pet devil pooch.', platform: 'crunchyroll' },
      { id: 'tt22064098', name: 'Frieren: Beyond Journey\'s End', type: 'series', year: '2024', imdbRating: '8.9', genres: ['Animation', 'Adventure', 'Drama'], poster: 'https://images.metahub.space/poster/medium/tt22064098/img', background: 'https://images.metahub.space/background/medium/tt22064098/img', description: 'An elven mage and her fellow adventurers have defeated the Demon King and brought peace to the land. But what happens after the grand adventure ends?', platform: 'crunchyroll' }
    ],
    paramount: [
      { id: 'tt4236770', name: 'Yellowstone', type: 'series', year: '2024', imdbRating: '8.7', genres: ['Drama', 'Western'], poster: 'https://images.metahub.space/poster/medium/tt4236770/img', background: 'https://images.metahub.space/background/medium/tt4236770/img', description: 'A ranching family in Montana faces off against others encroaching on their land.', platform: 'paramount' },
      { id: 'tt1745960', name: 'Top Gun: Maverick', type: 'movie', year: '2022', imdbRating: '8.3', genres: ['Action', 'Drama'], poster: 'https://images.metahub.space/poster/medium/tt1745960/img', background: 'https://images.metahub.space/background/medium/tt1745960/img', description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN\'s elite graduates on a mission.', platform: 'paramount' },
      { id: 'tt2934286', name: 'Halo', type: 'series', year: '2024', imdbRating: '7.3', genres: ['Action', 'Adventure', 'Sci-Fi'], poster: 'https://images.metahub.space/poster/medium/tt2934286/img', background: 'https://images.metahub.space/background/medium/tt2934286/img', description: 'Aliens threaten human existence in an epic 26th-century showdown. TV series based on the video game \'Halo\'.', platform: 'paramount' },
      { id: 'tt9603212', name: 'Mission: Impossible - Dead Reckoning', type: 'movie', year: '2023', imdbRating: '7.7', genres: ['Action', 'Adventure', 'Thriller'], poster: 'https://images.metahub.space/poster/medium/tt9603212/img', background: 'https://images.metahub.space/background/medium/tt9603212/img', description: 'Ethan Hunt and his IMF team must track down a dangerous weapon before it falls into the wrong hands.', platform: 'paramount' },
      { id: 'tt12327578', name: 'Star Trek: Strange New Worlds', type: 'series', year: '2023', imdbRating: '8.3', genres: ['Action', 'Adventure', 'Sci-Fi'], poster: 'https://images.metahub.space/poster/medium/tt12327578/img', background: 'https://images.metahub.space/background/medium/tt12327578/img', description: 'A prequel to Star Trek: The Original Series, following Captain Christopher Pike and the crew of the USS Enterprise in the 23rd century.', platform: 'paramount' },
      { id: 'tt13433802', name: 'A Quiet Place: Day One', type: 'movie', year: '2024', imdbRating: '6.4', genres: ['Drama', 'Horror', 'Sci-Fi'], poster: 'https://images.metahub.space/poster/medium/tt13433802/img', background: 'https://images.metahub.space/background/medium/tt13433802/img', description: 'Experience the day the world went quiet in this terrifying continuation of the creature invasion.', platform: 'paramount' }
    ]
  };

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

  async function fetchOttCatalog(platform, type = 'all', limit = 24) {
    if (!platform || platform === 'all') {
      const allProms = ['netflix', 'prime', 'disney', 'crunchyroll', 'paramount'].map(p => fetchOttCatalog(p, type, 8));
      const res = await Promise.all(allProms);
      const combined = [];
      const seen = new Set();
      res.flat().forEach(item => {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          combined.push(item);
        }
      });
      return combined;
    }

    const apiPath = `/api/ott-catalog?platform=${encodeURIComponent(platform)}&type=${encodeURIComponent(type)}&limit=${limit}`;
    const data = await safeFetchJson(apiPath, async () => {
      // Direct client fallback to TMDb if server proxy is unavailable
      const provMap = {
        netflix: '8|1796',
        prime: '9|119|2100',
        disney: '337',
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
      OTT_DATA[platform] = items;
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
      searchSubheading.textContent = 'Trending movies and shows across Netflix, Prime Video, Disney+, Crunchyroll, and Paramount+';
    }
    searchCountBadge.textContent = 'Curated picks';

    if (filterState.platform !== 'all') {
      const pName = getPlatformDisplayName(filterState.platform);
      searchResultsHeading.textContent = `Trending on ${pName}`;
      if (searchSubheading) {
        searchSubheading.textContent = `Popular titles accurately arranged for ${pName} via TMDb`;
      }
      searchCountBadge.textContent = 'Loading...';
      const titles = await fetchOttCatalog(filterState.platform, filterState.type, 24);
      renderCardGridWithFilters(titles);
    } else {
      let pool = cachedCatalogPool;
      if (pool.length < 15) {
        pool = await fetchOttCatalog('all', filterState.type, 30);
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
      case 'disney': return 'Disney+';
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

    const [allTitles, movies, series] = await Promise.all([
      fetchOttCatalog(platformKey, 'all', 20),
      fetchOttCatalog(platformKey, 'movie', 15),
      fetchOttCatalog(platformKey, 'series', 15)
    ]);

    rowsContainer.innerHTML = '';
    const titles = (allTitles && allTitles.length > 0) ? allTitles : (OTT_DATA[platformKey] || []);

    if (titles.length > 0) {
      setBillboard(titles[0]);
    }

    const platformShelf = createRowElement(`Popular on ${platformName}`, titles, platformKey);
    if (platformShelf) rowsContainer.appendChild(platformShelf);

    // Also show top movies and series matching that platform vibe
    const movieMatches = (movies && movies.length > 0) ? movies : titles.filter(t => t.type === 'movie');
    if (movieMatches.length > 0) {
      const row = createRowElement(`${platformName} Feature Films`, movieMatches, platformKey);
      if (row) rowsContainer.appendChild(row);
    }

    const seriesMatches = (series && series.length > 0) ? series : titles.filter(t => t.type === 'series');
    if (seriesMatches.length > 0) {
      const row = createRowElement(`${platformName} Top Series`, seriesMatches, platformKey);
      if (row) rowsContainer.appendChild(row);
    }

    // You May Also Like Row
    const recommendations = cachedCatalogPool.filter(c => !titles.some(t => t.id === c.id)).slice(0, 15);
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

      // Pre-load streams silently
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
      // 7. Watch History (from backend)
      fetches.push(safeFetchJson('/api/history', () => ({ recent: [] })).then(r => r || { recent: [] }));

      // Fetch TMDb OTT platform catalogs concurrently with category catalog
      const [catResults, netflixOtt, primeOtt, disneyOtt, crunchyOtt, paramountOtt] = await Promise.all([
        Promise.all(fetches),
        fetchOttCatalog('netflix', 'all', 20),
        fetchOttCatalog('prime', 'all', 20),
        fetchOttCatalog('disney', 'all', 20),
        fetchOttCatalog('crunchyroll', 'all', 20),
        fetchOttCatalog('paramount', 'all', 20)
      ]);
      const results = catResults;
      rowsContainer.innerHTML = '';
      let featuredSet = false;

      // 1. Continue Watching Row (if user has viewing history)
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

      // 3. Popular on Netflix (TMDb Verified Watch Provider)
      if (filter === 'all' || filter === 'movie') {
        const nData = (netflixOtt && netflixOtt.length > 0) ? netflixOtt : OTT_DATA.netflix;
        const netflixShelf = createRowElement('Popular on Netflix', nData, 'netflix');
        if (netflixShelf) rowsContainer.appendChild(netflixShelf);
      }

      // 4. Prime Video Exclusives (TMDb Verified Watch Provider)
      if (filter === 'all' || filter === 'series') {
        const pData = (primeOtt && primeOtt.length > 0) ? primeOtt : OTT_DATA.prime;
        const primeShelf = createRowElement('Prime Video Exclusives', pData, 'prime');
        if (primeShelf) rowsContainer.appendChild(primeShelf);
      }

      // 5. Disney+ Cinema & Marvel (TMDb Verified Watch Provider)
      if (filter === 'all' || filter === 'movie') {
        const dData = (disneyOtt && disneyOtt.length > 0) ? disneyOtt : OTT_DATA.disney;
        const disneyShelf = createRowElement('Disney+ Cinema & Marvel', dData, 'disney');
        if (disneyShelf) rowsContainer.appendChild(disneyShelf);
      }

      // 6. Crunchyroll Anime Vault (TMDb Verified Watch Provider)
      if (filter === 'all' || filter === 'anime' || filter === 'series') {
        const cData = (crunchyOtt && crunchyOtt.length > 0) ? crunchyOtt : OTT_DATA.crunchyroll;
        const crunchyShelf = createRowElement('Crunchyroll Anime Vault', cData, 'crunchyroll');
        if (crunchyShelf) rowsContainer.appendChild(crunchyShelf);
      }

      // 7. Paramount+ Blockbusters (TMDb Verified Watch Provider)
      if (filter === 'all' || filter === 'movie') {
        const pmData = (paramountOtt && paramountOtt.length > 0) ? paramountOtt : OTT_DATA.paramount;
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
