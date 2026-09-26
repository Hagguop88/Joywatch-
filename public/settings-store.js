/**
 * Joywatch • Settings Store + Per-Media Server Memory + Theme Application
 *
 * Zero dependencies. localStorage-only (Vercel serverless has no persistent disk).
 * Mirrors the defensive style of watch-progress.js: every read is try/catch,
 * corrupt data yields clean defaults, never throws into the player.
 *
 * Exposes: window.JoywatchSettings
 */
(function () {
  'use strict';

  var SETTINGS_KEY = 'joywatch_settings_v1';
  var SERVER_PREFS_KEY = 'joywatch_server_pref_v1';
  var DEBUG_KEY = 'joywatch_debug_playback';

  // ---------------------------------------------------------------------------
  // Theme Definitions
  // ---------------------------------------------------------------------------
  // All accents avoid purple/indigo/magenta per AGENTS.md invariants.
  // Base "obsidian" is the existing :root values — left untouched.
  // "slate" is a lighter base (overrides --joy-bg* and --joy-text*).
  var THEMES = [
    {
      id: 'obsidian',
      name: 'Obsidian',
      base: true,
      accentOnly: true,
      vars: {} // uses existing :root
    },
    {
      id: 'amber',
      name: 'Amber',
      base: false,
      accentOnly: true,
      vars: {
        '--joy-accent': '#EAB308',
        '--joy-accent-hover': '#FACC15',
        '--joy-accent-dark': '#B48A06',
        '--joy-accent-tint': 'rgba(234, 179, 8, 0.12)',
        '--joy-accent-border': 'rgba(234, 179, 8, 0.35)',
        '--joy-accent-shadow': 'rgba(234, 179, 8, 0.25)',
        '--joy-star-gold': '#EAB308'
      }
    },
    {
      id: 'cyan',
      name: 'Cyan',
      base: false,
      accentOnly: true,
      vars: {
        '--joy-accent': '#22D3EE',
        '--joy-accent-hover': '#67E8F9',
        '--joy-accent-dark': '#0891B2',
        '--joy-accent-tint': 'rgba(34, 211, 238, 0.12)',
        '--joy-accent-border': 'rgba(34, 211, 238, 0.35)',
        '--joy-accent-shadow': 'rgba(34, 211, 238, 0.25)',
        '--joy-star-gold': '#22D3EE'
      }
    },
    {
      id: 'rose',
      name: 'Rose',
      base: false,
      accentOnly: true,
      vars: {
        '--joy-accent': '#F43F5E',
        '--joy-accent-hover': '#FB7185',
        '--joy-accent-dark': '#BE123C',
        '--joy-accent-tint': 'rgba(244, 63, 94, 0.12)',
        '--joy-accent-border': 'rgba(244, 63, 94, 0.35)',
        '--joy-accent-shadow': 'rgba(244, 63, 94, 0.25)',
        '--joy-star-gold': '#F43F5E'
      }
    },
    {
      id: 'slate-blue',
      name: 'Steel',
      base: false,
      accentOnly: true,
      vars: {
        '--joy-accent': '#60A5FA',
        '--joy-accent-hover': '#93C5FD',
        '--joy-accent-dark': '#2563EB',
        '--joy-accent-tint': 'rgba(96, 165, 250, 0.12)',
        '--joy-accent-border': 'rgba(96, 165, 250, 0.35)',
        '--joy-accent-shadow': 'rgba(96, 165, 250, 0.25)',
        '--joy-star-gold': '#60A5FA'
      }
    },
    {
      id: 'graphite',
      name: 'Graphite',
      base: false,
      accentOnly: true,
      vars: {
        '--joy-accent': '#9CA3AF',
        '--joy-accent-hover': '#D1D5DB',
        '--joy-accent-dark': '#6B7280',
        '--joy-accent-tint': 'rgba(156, 163, 175, 0.12)',
        '--joy-accent-border': 'rgba(156, 163, 175, 0.35)',
        '--joy-accent-shadow': 'rgba(156, 163, 175, 0.25)',
        '--joy-star-gold': '#9CA3AF'
      }
    },
    {
      id: 'slate',
      name: 'Slate',
      base: true,
      accentOnly: false,
      vars: {
        '--joy-bg': '#0F172A',
        '--joy-bg-secondary': '#1E293B',
        '--joy-bg-card': '#334155',
        '--joy-bg-card-hover': '#475569',
        '--joy-bg-elevated': '#1E293B',
        '--joy-glass': 'rgba(30, 41, 59, 0.70)',
        '--joy-glass-elevated': 'rgba(51, 65, 85, 0.85)',
        '--joy-text-primary': '#F8FAFC',
        '--joy-text-secondary': '#CBD5E1',
        '--joy-text-muted': '#94A3B8',
        '--joy-text-inverse': '#0F172A',
        '--joy-border': 'rgba(255, 255, 255, 0.12)',
        '--joy-border-hover': 'rgba(255, 255, 255, 0.22)',
        '--joy-border-subtle': 'rgba(255, 255, 255, 0.06)'
      }
    }
  ];

  var DEFAULT_THEME_ID = 'obsidian';

  var DEFAULT_SERVER_ORDER = [
    'vidlink', 'nexstream', 'autoembed', 'vidsrc-pm', 'vidsrc-su', 'vidjoy', '2embed'
  ];

  var SERVER_DISPLAY_NAMES = {
    'vidlink': 'VidLink Pro',
    'nexstream': 'NexStream VIP',
    'autoembed': 'AutoEmbed Cloud',
    'vidsrc-pm': 'VidSrc PM',
    'vidsrc-su': 'VidSrc SU',
    'vidjoy': 'VidJoy Cinema',
    '2embed': '2Embed Multi-Server'
  };

  // ---------------------------------------------------------------------------
  // Debug / Logging
  // ---------------------------------------------------------------------------
  function debugEnabled() {
    try {
      if (typeof window !== 'undefined' && window.location &&
        window.location.search.indexOf('debug=settings') !== -1) return true;
      return window.localStorage.getItem(DEBUG_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function log(event) {
    if (!debugEnabled()) return;
    try {
      var parts = '[Settings]';
      for (var k in event) parts += ' | ' + k + ': ' + event[k];
      console.log(parts);
    } catch (e) { /* never break for logging */ }
  }

  // ---------------------------------------------------------------------------
  // Settings Store (joywatch_settings_v1)
  // ---------------------------------------------------------------------------
  function readSettings() {
    try {
      var raw = window.localStorage.getItem(SETTINGS_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function writeSettings(obj) {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(obj));
    } catch (e) { /* quota/private-mode: keep in-memory truth */ }
  }

  function getDefaults() {
    return {
      theme: DEFAULT_THEME_ID,
      serverOrder: DEFAULT_SERVER_ORDER.slice(),
      hiddenServers: {},
      favoriteServers: {},
      autoplayNext: true,
      reducedMotion: false
    };
  }

  function themeIdValid(id) {
    for (var i = 0; i < THEMES.length; i++) { if (THEMES[i].id === id) return true; }
    return false;
  }

  function sanitizeSettings(raw) {
    var def = getDefaults();
    if (!raw || typeof raw !== 'object') return def;
    var theme = (typeof raw.theme === 'string' && themeIdValid(raw.theme)) ? raw.theme : def.theme;
    var serverOrder = Array.isArray(raw.serverOrder)
      ? raw.serverOrder.filter(function (id) { return DEFAULT_SERVER_ORDER.indexOf(id) !== -1; })
      : def.serverOrder;
    // ensure all known servers are present (append missing at end)
    DEFAULT_SERVER_ORDER.forEach(function (id) {
      if (serverOrder.indexOf(id) === -1) serverOrder.push(id);
    });
    var hidden = (raw.hiddenServers && typeof raw.hiddenServers === 'object') ? raw.hiddenServers : def.hiddenServers;
    var favorites = (raw.favoriteServers && typeof raw.favoriteServers === 'object') ? raw.favoriteServers : def.favoriteServers;
    var autoplay = typeof raw.autoplayNext === 'boolean' ? raw.autoplayNext : def.autoplayNext;
    var reduced = typeof raw.reducedMotion === 'boolean' ? raw.reducedMotion : def.reducedMotion;
    return {
      theme: theme,
      serverOrder: serverOrder,
      hiddenServers: hidden,
      favoriteServers: favorites,
      autoplayNext: autoplay,
      reducedMotion: reduced
    };
  }

  function getAll() {
    return sanitizeSettings(readSettings());
  }

  function setAll(obj) {
    var clean = sanitizeSettings(obj);
    // Never allow hiding every server — the player needs at least one.
    if (!isPlayableServersRemaining(clean)) clean.hiddenServers = {};
    writeSettings(clean);
    log({ op: 'settings-save', theme: clean.theme, order: clean.serverOrder.join(',') });
    return clean;
  }

  function reset() {
    writeSettings(getDefaults());
    log({ op: 'settings-reset' });
  }

  // ---------------------------------------------------------------------------
  // Per-Media Server Preferences (joywatch_server_pref_v1)
  // Key shape: "type:id:season:episode" (matches sessionKey in watch-progress.js)
  // Value: provider id string (e.g., "vidsrc-pm", "2embed")
  // ---------------------------------------------------------------------------
  function readServerPrefs() {
    try {
      var raw = window.localStorage.getItem(SERVER_PREFS_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return {};
      return parsed;
    } catch (e) {
      return {};
    }
  }

  function writeServerPrefs(map) {
    try {
      window.localStorage.setItem(SERVER_PREFS_KEY, JSON.stringify(map));
    } catch (e) { /* quota/private-mode */ }
  }

  function buildMediaKey(type, id, season, episode) {
    return (type || 'movie') + ':' + String(id) + ':' + (season || 0) + ':' + (episode || 0);
  }

  function getServerPref(type, id, season, episode) {
    var map = readServerPrefs();
    return map[buildMediaKey(type, id, season, episode)] || null;
  }

  function setServerPref(type, id, season, episode, providerId) {
    if (!providerId) return;
    var map = readServerPrefs();
    map[buildMediaKey(type, id, season, episode)] = providerId;
    writeServerPrefs(map);
    log({ op: 'server-pref-set', key: buildMediaKey(type, id, season, episode), provider: providerId });
  }

  function clearServerPrefs() {
    writeServerPrefs({});
    log({ op: 'server-prefs-clear' });
  }

  // ---------------------------------------------------------------------------
  // Theme Application
  // ---------------------------------------------------------------------------
  function allManagedVars() {
    var seen = {};
    THEMES.forEach(function (t) { for (var k in t.vars) seen[k] = true; });
    return Object.keys(seen);
  }

  function applyTheme(themeId) {
    var theme = null;
    for (var i = 0; i < THEMES.length; i++) {
      if (THEMES[i].id === themeId) { theme = THEMES[i]; break; }
    }
    if (!theme) {
      log({ op: 'apply-theme', error: 'unknown-theme', themeId: themeId });
      return false;
    }
    var root = document.documentElement;
    // Clear every theme-managed inline var first, so switching back to
    // Obsidian (whose vars map is empty) truly resets prior themes.
    allManagedVars().forEach(function (k) { root.style.removeProperty(k); });
    for (var k in theme.vars) {
      root.style.setProperty(k, theme.vars[k]);
    }
    // Keep the data-theme attribute in sync — the static slate overrides
    // (navbar, hero vignette, bottom nav) key off html[data-theme='slate'].
    try {
      if (themeId && themeId !== DEFAULT_THEME_ID) root.setAttribute('data-theme', themeId);
      else root.removeAttribute('data-theme');
    } catch (e) { /* attribute sync is cosmetic */ }
    // Mirror to PWA theme-color meta
    try {
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', theme.vars['--joy-bg'] || '#050505');
    } catch (e) { /* ignore */ }
    log({ op: 'apply-theme', theme: themeId });
    return true;
  }

  function isThemeValid(id) {
    return themeIdValid(id);
  }

  // Apply theme *before first paint* — called from inline script in <head>
  function applyThemeEarly() {
    var stored = readSettings();
    var themeId = (stored && stored.theme && isThemeValid(stored.theme)) ? stored.theme : DEFAULT_THEME_ID;
    var theme = null;
    for (var i = 0; i < THEMES.length; i++) {
      if (THEMES[i].id === themeId) { theme = THEMES[i]; break; }
    }
    if (!theme) return;
    var root = document.documentElement;
    for (var k in theme.vars) {
      try { root.style.setProperty(k, theme.vars[k]); } catch (e) { /* ignore */ }
    }
  }

  // ---------------------------------------------------------------------------
  // Server Order / Hidden / Favorites — applied to a stream array
  // ---------------------------------------------------------------------------
  function reorderAndFilterStreams(streams, settings) {
    if (!streams || !streams.length) return streams;
    var order = settings && settings.serverOrder ? settings.serverOrder : DEFAULT_SERVER_ORDER;
    var hidden = settings && settings.hiddenServers ? settings.hiddenServers : {};
    var favorites = settings && settings.favoriteServers ? settings.favoriteServers : {};

    var withMeta = streams.map(function (s) {
      var prov = window.JoywatchProviders ? window.JoywatchProviders.identify(s.browser_url || s.url) : null;
      return {
        stream: s,
        providerId: prov,
        orderIndex: prov ? order.indexOf(prov) : 999,
        isHidden: prov ? !!hidden[prov] : false,
        isFavorite: prov ? !!favorites[prov] : false,
        displayName: prov ? SERVER_DISPLAY_NAMES[prov] : (s.name || 'Unknown')
      };
    });

    // Sort: favorites first, then by serverOrder index
    withMeta.sort(function (a, b) {
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      return a.orderIndex - b.orderIndex;
    });

    // Filter out hidden
    return withMeta.filter(function (m) { return !m.isHidden; }).map(function (m) { return m.stream; });
  }

  // Hide every visible server — the player falls back gracefully because at least
  // one embed is always retained in loadStreams.
  function isPlayableServersRemaining(settings) {
    return DEFAULT_SERVER_ORDER.some(function (id) { return !settings.hiddenServers[id]; });
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------
  window.JoywatchSettings = {
    THEMES: THEMES,
    DEFAULT_THEME_ID: DEFAULT_THEME_ID,
    DEFAULT_SERVER_ORDER: DEFAULT_SERVER_ORDER,
    SERVER_DISPLAY_NAMES: SERVER_DISPLAY_NAMES,
    getAll: getAll,
    setAll: setAll,
    reset: reset,
    getServerPref: getServerPref,
    setServerPref: setServerPref,
    clearServerPrefs: clearServerPrefs,
    applyTheme: applyTheme,
    applyThemeEarly: applyThemeEarly,
    isThemeValid: isThemeValid,
    reorderAndFilterStreams: reorderAndFilterStreams,
    buildMediaKey: buildMediaKey,
    getServerPrefs: function () { return readServerPrefs(); }
  };

  // Auto-apply on load (backup to the inline script)
  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyThemeEarly();
    });
  } else if (typeof document !== 'undefined') {
    applyThemeEarly();
  }
})();