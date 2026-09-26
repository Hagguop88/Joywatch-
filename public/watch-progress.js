/**
 * Joywatch • Watch Progress Store + Playback Session Tracker
 *
 * localStorage-only persistence (the Vercel deployment is serverless with no
 * persistent disk, and /api/history is a read-only desktop-TUI artifact).
 *
 * Data flow:
 *   player telemetry (postMessage | <video> timeupdate | wall-clock fallback)
 *     → origin validation (via JoywatchProviders)
 *     → provider.extractProgress()
 *     → init-vs-genuine classification + regression guard
 *     → completion detection
 *     → in-memory session position (source of truth)
 *     → synchronous localStorage flush on player close
 *
 * Cross-origin iframes report nothing observable, so iframe sessions ALSO run
 * a wall-clock fallback timer (visible-tab only) that yields an *estimated*
 * position. Direct <video> streams additionally report exact `timeupdate`
 * positions. Exact positions always win over estimates.
 *
 * Zero dependencies. Exposes `window.JoywatchProgress`.
 */

(function () {
  'use strict';

  var STORE_KEY = 'joywatch_progress_v1';
  var DEBUG_KEY = 'joywatch_debug_playback';

  /** Telemetry younger than this after boot that regresses stored progress is suspect. */
  var INIT_GRACE_MS = 45000;
  /** Startup `0` is init; genuine sub-15s playback positions are still valid. */
  var INIT_ZERO_TOLERANCE = 1;
  /** Completed when currentTime >= duration * this. */
  var COMPLETION_RATIO = 0.95;
  /** Min watch time (s) before a brand-new session is worth persisting. */
  var MIN_PERSIST_SECONDS = 3;

  function debugEnabled() {
    try {
      if (typeof window !== 'undefined' && window.location &&
        window.location.search.indexOf('debug=playback') !== -1) return true;
      return window.localStorage.getItem(DEBUG_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function log(event) {
    if (!debugEnabled()) return;
    try {
      var parts = ['[Playback]'];
      for (var k in event) parts.push(k + ': ' + event[k]);
      console.log(parts.join(' | ')); // eslint-disable-line no-console
    } catch (e) { /* never break playback for logging */ }
  }

  function providers() {
    return window.JoywatchProviders || null;
  }

  // ---------------------------------------------------------------------------
  // Store
  // ---------------------------------------------------------------------------

  function sessionKey(mediaId, type, season, episode) {
    return (type || 'movie') + ':' + String(mediaId) +
      ':' + (season || 0) + ':' + (episode || 0);
  }

  function sanitizeNumber(v, fallback) {
    return (typeof v === 'number' && Number.isFinite(v) && v >= 0) ? v : fallback;
  }

  function sanitizeEntry(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (raw.mediaId === undefined || raw.mediaId === null || raw.mediaId === '') return null;
    var currentTime = sanitizeNumber(raw.currentTime, null);
    var duration = sanitizeNumber(raw.duration, 0);
    if (currentTime === null) return null;
    if (duration > 0 && currentTime > duration + 120) return null; // wildly inconsistent
    return {
      mediaId: String(raw.mediaId),
      type: raw.type === 'series' ? 'series' : 'movie',
      season: Math.max(0, Math.floor(sanitizeNumber(raw.season, 0))),
      episode: Math.max(0, Math.floor(sanitizeNumber(raw.episode, 0))),
      title: typeof raw.title === 'string' ? raw.title.slice(0, 200) : '',
      poster: typeof raw.poster === 'string' ? raw.poster.slice(0, 500) : '',
      year: typeof raw.year === 'string' ? raw.year.slice(0, 8) : '',
      currentTime: currentTime,
      duration: duration,
      completed: raw.completed === true,
      estimated: raw.estimated === true,
      updatedAt: sanitizeNumber(raw.updatedAt, 0)
    };
  }

  function readStore() {
    var out = {};
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return out;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return out;
      Object.keys(parsed).forEach(function (k) {
        var clean = sanitizeEntry(parsed[k]);
        if (clean) out[k] = clean;
      });
    } catch (e) {
      return {}; // corrupt JSON → clean defaults, never throw
    }
    return out;
  }

  function writeStore(map) {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(map));
    } catch (e) { /* quota/private-mode: keep in-memory truth, skip persistence */ }
  }

  function getEntry(mediaId, type, season, episode) {
    var map = readStore();
    return map[sessionKey(mediaId, type, season, episode)] || null;
  }

  /**
   * Resolve the position a new player session should start from.
   * Completed (or missing) entries start at 0. Returned value is safe to
   * hand to a provider adapter (or 0 when there is nothing to resume).
   */
  function getResumeTime(mediaId, type, season, episode) {
    var e = getEntry(mediaId, type, season, episode);
    if (!e || e.completed) return 0;
    return e.currentTime || 0;
  }

  /** Non-completed entries with a real position, newest first. */
  function listActive(limit) {
    var map = readStore();
    var items = Object.keys(map).map(function (k) { return map[k]; })
      .filter(function (e) { return !e.completed && e.currentTime > MIN_PERSIST_SECONDS; })
      .sort(function (a, b) { return b.updatedAt - a.updatedAt; });
    return typeof limit === 'number' ? items.slice(0, limit) : items;
  }

  function saveEntry(entry) {
    entry.updatedAt = Date.now();
    var map = readStore();
    map[sessionKey(entry.mediaId, entry.type, entry.season, entry.episode)] = entry;
    writeStore(map);
    log({ op: 'persist', mediaId: entry.mediaId, currentTime: Math.floor(entry.currentTime), completed: entry.completed, estimated: entry.estimated });
  }

  // ---------------------------------------------------------------------------
  // Session tracker — one per player open.
  // ---------------------------------------------------------------------------

  function startSession(info) {
    info = info || {};
    var prov = providers();
    var resumeBase = getResumeTime(info.mediaId, info.type, info.season, info.episode);

    var session = {
      mediaId: String(info.mediaId || ''),
      type: info.type === 'series' ? 'series' : 'movie',
      season: info.season || 0,
      episode: info.episode || 0,
      title: info.title || '',
      poster: info.poster || '',
      year: info.year || '',
      providerId: info.providerId || null,
      resumeBase: resumeBase,
      bootTime: Date.now(),
      confirmed: false,          // genuine forward playback observed this session
      exactTime: null,           // latest exact position (timeupdate / genuine telemetry)
      exactDuration: 0,
      visibleMs: 0,              // wall-clock fallback accumulation
      lastStamp: Date.now(),
      closed: false,
      detachMessage: null,
      detachVideo: null,
      detachVisibility: null
    };

    function stampVisible() {
      var now = Date.now();
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        session.visibleMs += Math.max(0, now - session.lastStamp);
      }
      session.lastStamp = now;
    }

    function onVisibility() { stampVisible(); }

    if (typeof document !== 'undefined' && document.addEventListener) {
      document.addEventListener('visibilitychange', onVisibility);
      session.detachVisibility = function () {
        document.removeEventListener('visibilitychange', onVisibility);
      };
    }

    /** Current best-known position: exact wins, else base + visible elapsed. */
    function getPosition() {
      stampVisible();
      if (session.exactTime !== null) return session.exactTime;
      return session.resumeBase + session.visibleMs / 1000;
    }

    function getDuration() {
      return session.exactDuration || 0;
    }

    function isInitKind(progress) {
      if (progress.kind === 'init') return true;
      // Unlabeled startup zero inside the grace window, before any confirmed
      // playback, is treated as initialization — never as a regression.
      if (!session.confirmed &&
        progress.currentTime <= INIT_ZERO_TOLERANCE &&
        Date.now() - session.bootTime < INIT_GRACE_MS) {
        return true;
      }
      return false;
    }

    /**
     * Apply provider telemetry. Returns true when accepted.
     * - init-kind events never overwrite stored progress
     * - unlabeled near-zero inside the grace window that would regress a saved
     *   position is rejected as suspected initialization
     * - genuine events (including legitimate backward seeks) are accepted,
     *   and confirm the session so later positions are trusted outright
     */
    function applyTelemetry(progress, origin) {
      if (session.closed) return false;
      if (!progress || typeof progress.currentTime !== 'number' ||
        !Number.isFinite(progress.currentTime) || progress.currentTime < 0) {
        log({ op: 'telemetry', accepted: false, reason: 'invalid-payload', origin: origin });
        return false;
      }

      var stored = getEntry(session.mediaId, session.type, session.season, session.episode);
      var storedTime = stored && !stored.completed ? stored.currentTime : 0;

      if (isInitKind(progress)) {
        log({ op: 'telemetry', accepted: false, reason: 'initialization-event', currentTime: progress.currentTime, stored: storedTime, origin: origin });
        return false;
      }

      if (!session.confirmed &&
        Date.now() - session.bootTime < INIT_GRACE_MS &&
        storedTime > 0 &&
        progress.currentTime + 2 < storedTime &&
        progress.currentTime < session.resumeBase - 2) {
        log({ op: 'telemetry', accepted: false, reason: 'suspected-init-regression', currentTime: progress.currentTime, stored: storedTime, origin: origin });
        return false;
      }

      session.exactTime = progress.currentTime;
      if (typeof progress.duration === 'number' && Number.isFinite(progress.duration) && progress.duration >= 0) {
        session.exactDuration = progress.duration;
      }
      if (progress.currentTime + 2 >= session.resumeBase) session.confirmed = true;
      log({ op: 'telemetry', accepted: true, currentTime: Math.floor(progress.currentTime), origin: origin });
      return true;
    }

    /** Exact position from a trusted local source (<video> timeupdate). */
    function setExactPosition(currentTime, duration) {
      if (session.closed) return false;
      if (typeof currentTime !== 'number' || !Number.isFinite(currentTime) || currentTime < 0) return false;
      session.exactTime = currentTime;
      if (typeof duration === 'number' && Number.isFinite(duration) && duration >= 0) {
        session.exactDuration = duration;
      }
      session.confirmed = true;
      return true;
    }

    /** Single window message listener, origin-validated, session-scoped. */
    function attachMessageListener() {
      if (session.detachMessage || !prov) return;
      function handler(event) {
        if (session.closed) return;
        if (!event || !prov.isAllowedOrigin(event.origin)) {
          if (debugEnabled() && event && event.data !== undefined) {
            try {
              var hasPlayerShape = /PLAYER_EVENT|MEDIA_DATA|currentTime/i.test(
                typeof event.data === 'string' ? event.data : JSON.stringify(event.data));
              if (hasPlayerShape) log({ op: 'telemetry', accepted: false, reason: 'unauthorized-origin', origin: event.origin });
            } catch (e) { /* ignore */ }
          }
          return;
        }
        var provider = prov.providerForOrigin(event.origin);
        if (!provider) return;
        var progress = null;
        try {
          progress = provider.extractProgress(event);
        } catch (e) {
          progress = null;
        }
        if (!progress) {
          log({ op: 'telemetry', accepted: false, reason: 'unrecognized-payload', origin: event.origin });
          return;
        }
        applyTelemetry(progress, event.origin);
      }
      window.addEventListener('message', handler);
      session.detachMessage = function () {
        window.removeEventListener('message', handler);
      };
    }

    /** Wire a local <video> element's timeupdate for exact positions. */
    function attachVideo(videoEl) {
      if (!videoEl || typeof videoEl.addEventListener !== 'function') return;
      function onTime() {
        try {
          setExactPosition(videoEl.currentTime, videoEl.duration || 0);
        } catch (e) { /* ignore */ }
      }
      videoEl.addEventListener('timeupdate', onTime);
      session.detachVideo = function () {
        videoEl.removeEventListener('timeupdate', onTime);
      };
    }

    function markCompletedIfDone(finalTime, duration) {
      return duration > 0 && finalTime >= duration * COMPLETION_RATIO;
    }

    /** Flush latest validated position to localStorage. No-op for trivial sessions. */
    function flush() {
      if (session.closed || !session.mediaId) return null;
      stampVisible();
      var hadExact = session.exactTime !== null;
      var finalTime = hadExact ? session.exactTime : (session.resumeBase + session.visibleMs / 1000);
      var duration = session.exactDuration || 0;
      if (!hadExact && finalTime <= Math.max(session.resumeBase, MIN_PERSIST_SECONDS)) {
        // Brand-new session with ~no watch time: nothing worth persisting.
        if (session.resumeBase <= MIN_PERSIST_SECONDS) return null;
      }
      var completed = markCompletedIfDone(finalTime, duration);
      var entry = {
        mediaId: session.mediaId,
        type: session.type,
        season: session.season,
        episode: session.episode,
        title: session.title,
        poster: session.poster,
        year: session.year,
        currentTime: completed ? 0 : Math.max(0, finalTime),
        duration: duration,
        completed: completed,
        estimated: !hadExact,
        updatedAt: Date.now()
      };
      saveEntry(entry);
      return entry;
    }

    function setProvider(providerId) {
      session.providerId = providerId || session.providerId;
    }

    function close() {
      if (session.closed) return null;
      session.closed = true;
      var entry = flush();
      if (session.detachMessage) { try { session.detachMessage(); } catch (e) {} session.detachMessage = null; }
      if (session.detachVideo) { try { session.detachVideo(); } catch (e) {} session.detachVideo = null; }
      if (session.detachVisibility) { try { session.detachVisibility(); } catch (e) {} session.detachVisibility = null; }
      return entry;
    }

    attachMessageListener();
    log({ op: 'session-start', mediaId: session.mediaId, resumeBase: Math.floor(session.resumeBase) });
    return {
      getPosition: getPosition,
      getDuration: getDuration,
      getResumeBase: function () { return session.resumeBase; },
      applyTelemetry: applyTelemetry,
      setExactPosition: setExactPosition,
      attachVideo: attachVideo,
      setProvider: setProvider,
      flush: flush,
      close: close
    };
  }

  function formatClock(totalSeconds) {
    var s = Math.max(0, Math.floor(totalSeconds || 0));
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    return h > 0 ? h + ':' + pad(m) + ':' + pad(sec) : m + ':' + pad(sec);
  }

  window.JoywatchProgress = {
    STORE_KEY: STORE_KEY,
    getEntry: getEntry,
    getResumeTime: getResumeTime,
    listActive: listActive,
    startSession: startSession,
    formatClock: formatClock
  };
})();
