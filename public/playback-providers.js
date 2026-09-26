/**
 * Joywatch • Stream Provider Adapter Registry
 *
 * Centralizes every provider-specific behavior (embed URL construction,
 * resume-parameter support, allowed postMessage origins, telemetry parsing)
 * so the rest of the app stays provider-agnostic. Adding a new provider
 * means adding one adapter object here — never touching the playback core.
 *
 * Zero dependencies. Loaded before app.js; exposes `window.JoywatchProviders`.
 *
 * VERIFIED vs UNCERTAIN (checked against server.py /api/streams + app.js):
 * - VERIFIED: all 7 embed URL templates below, provider hostnames, and the
 *   `primaryColor` / `apikey` query params already shipped by this project.
 * - UNCERTAIN: whether ANY provider honors a resume query param, and whether
 *   ANY provider posts player telemetry to the parent window. VidLink `startAt`
 *   is implemented per the architectural hypothesis but flagged unverified.
 *   Every other adapter appends NO resume param until verified, and every
 *   `extractProgress` returns null until a real payload is observed.
 */

/* eslint-disable no-unused-vars */

(function () {
  'use strict';

  /** Minimum resume position (seconds) worth encoding into an embed URL. */
  var RESUME_MIN_SECONDS = 15;

  /**
   * @typedef {Object} PlaybackTarget
   * @property {string} mediaId
   * @property {string} type - "movie" | "series"
   * @property {number} [season]
   * @property {number} [episode]
   * @property {number} [resumeTime] - seconds
   */

  /**
   * @typedef {Object} PlaybackProgress
   * @property {number} currentTime - seconds
   * @property {number} duration - seconds (0 when unknown)
   * @property {string} kind - "progress" | "init"
   */

  function isValidResumeTime(value) {
    return typeof value === 'number' &&
      Number.isFinite(value) &&
      value > RESUME_MIN_SECONDS;
  }

  function floorTime(value) {
    return Math.max(0, Math.floor(value));
  }

  /** Append a query param to a URL string without breaking existing params. */
  function appendParam(url, key, value) {
    if (typeof url !== 'string' || !url) return url;
    var sep = url.indexOf('?') === -1 ? '?' : '&';
    return url + sep + encodeURIComponent(key) + '=' + encodeURIComponent(String(value));
  }

  // ---------------------------------------------------------------------------
  // Telemetry parsing (shared, strict)
  // ---------------------------------------------------------------------------

  /** Event-type names that mean "player booted", not "user watched this far". */
  var INIT_EVENT_PATTERN = /^(load|loaded|loader|ready|init|initiali[sz]e|initiali[sz]ed|metadata|meta|startup|boot|booted|create|created|mount|mounted|attach|attached|open|opened|start|started|begin)$/i;

  function parseMessageData(raw) {
    if (typeof raw === 'string') {
      try {
        raw = JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
    if (!raw || typeof raw !== 'object') return null;
    return raw;
  }

  function pickNumber() {
    for (var i = 0; i < arguments.length; i++) {
      var v = arguments[i];
      if (typeof v === 'number' && Number.isFinite(v) && v >= 0) return v;
    }
    return null;
  }

  /**
   * Extract playback progress from a postMessage payload WITHOUT trusting
   * any provider name inside the payload (origin is validated by the caller).
   * Returns null for anything that is not a well-formed progress payload,
   * including init/boot events that merely report currentTime: 0.
   */
  function extractGenericProgress(event) {
    var data = parseMessageData(event && event.data);
    if (!data) return null;

    var containers = [data];
    if (data.data && typeof data.data === 'object') containers.push(data.data);
    if (data.payload && typeof data.payload === 'object') containers.push(data.payload);
    if (data.media && typeof data.media === 'object') containers.push(data.media);

    var typeName = null;
    ['type', 'event', 'action', 'name', 'kind'].forEach(function (k) {
      if (typeof data[k] === 'string' && typeName === null) typeName = data[k];
    });

    var currentTime = null;
    var duration = 0;
    containers.forEach(function (c) {
      if (currentTime === null) {
        currentTime = pickNumber(c.currentTime, c.time, c.position, c.seconds, c.played);
      }
      var d = pickNumber(c.duration, c.totalDuration, c.length);
      if (d !== null) duration = d;
    });

    if (currentTime === null) return null;

    var kind = 'progress';
    if (typeName && INIT_EVENT_PATTERN.test(typeName.trim())) kind = 'init';
    if (data.isInit === true || data.initialized === true || data.ready === true) {
      if (currentTime <= 1) kind = 'init';
    }

    return { currentTime: currentTime, duration: duration, kind: kind };
  }

  // ---------------------------------------------------------------------------
  // Provider adapters — URL templates mirror server.py /api/streams exactly.
  // ---------------------------------------------------------------------------

  var NEXSTREAM_PUBLIC_KEY = 'nx_7247f0dac882d0590776fb442d30a667'; // already public in app.js/server.py

  var PROVIDERS = [
    {
      id: 'vidlink',
      name: 'VidLink Pro',
      allowedOrigins: ['https://vidlink.pro'],
      resumeParam: 'startAt', // UNVERIFIED hypothesis — isolated here.
      supportsResumeParam: true,
      buildEmbedUrl: function (t) {
        var base = t.type === 'series'
          ? 'https://vidlink.pro/tv/' + t.mediaId + '/' + (t.season || 1) + '/' + (t.episode || 1)
          : 'https://vidlink.pro/movie/' + t.mediaId;
        base = appendParam(base, 'primaryColor', '95FF50');
        if (isValidResumeTime(t.resumeTime)) base = appendParam(base, 'startAt', floorTime(t.resumeTime));
        return base;
      },
      extractProgress: function (event) { return extractGenericProgress(event); }
    },
    {
      id: 'nexstream',
      name: 'NexStream VIP',
      allowedOrigins: ['https://api.codespecters.com'],
      resumeParam: null, // UNVERIFIED — append nothing until confirmed.
      supportsResumeParam: false,
      buildEmbedUrl: function (t) {
        var path = t.type === 'series'
          ? '/embed/tv/' + t.mediaId + '/' + (t.season || 1) + '/' + (t.episode || 1)
          : '/embed/movie/' + t.mediaId;
        return 'https://api.codespecters.com' + path + '?apikey=' + (t.apiKey || NEXSTREAM_PUBLIC_KEY);
      },
      extractProgress: function () { return null; }
    },
    {
      id: 'autoembed',
      name: 'AutoEmbed Cloud',
      allowedOrigins: ['https://autoembed.co'],
      resumeParam: null, // UNVERIFIED — append nothing until confirmed.
      supportsResumeParam: false,
      buildEmbedUrl: function (t) {
        return t.type === 'series'
          ? 'https://autoembed.co/tv/imdb/' + t.mediaId + '/' + (t.season || 1) + '/' + (t.episode || 1)
          : 'https://autoembed.co/movie/imdb/' + t.mediaId;
      },
      extractProgress: function () { return null; }
    },
    {
      id: 'vidsrc-pm',
      name: 'VidSrc PM',
      allowedOrigins: ['https://vidsrc.pm'],
      resumeParam: null, // UNVERIFIED — append nothing until confirmed.
      supportsResumeParam: false,
      buildEmbedUrl: function (t) {
        return t.type === 'series'
          ? 'https://vidsrc.pm/embed/tv/' + t.mediaId + '/' + (t.season || 1) + '/' + (t.episode || 1)
          : 'https://vidsrc.pm/embed/movie/' + t.mediaId;
      },
      extractProgress: function () { return null; }
    },
    {
      id: 'vidsrc-su',
      name: 'VidSrc SU',
      allowedOrigins: ['https://vidsrc.su'],
      resumeParam: null, // UNVERIFIED — append nothing until confirmed.
      supportsResumeParam: false,
      buildEmbedUrl: function (t) {
        return t.type === 'series'
          ? 'https://vidsrc.su/embed/tv/' + t.mediaId + '/' + (t.season || 1) + '/' + (t.episode || 1)
          : 'https://vidsrc.su/embed/movie/' + t.mediaId;
      },
      extractProgress: function () { return null; }
    },
    {
      id: 'vidjoy',
      name: 'VidJoy Cinema',
      allowedOrigins: ['https://vidjoy.pro'],
      resumeParam: null, // UNVERIFIED — append nothing until confirmed.
      supportsResumeParam: false,
      buildEmbedUrl: function (t) {
        return t.type === 'series'
          ? 'https://vidjoy.pro/embed/tv/' + t.mediaId + '/' + (t.season || 1) + '/' + (t.episode || 1)
          : 'https://vidjoy.pro/embed/movie/' + t.mediaId;
      },
      extractProgress: function () { return null; }
    },
    {
      id: '2embed',
      name: '2Embed Multi-Server',
      allowedOrigins: ['https://www.2embed.cc', 'https://2embed.cc'],
      resumeParam: null, // UNVERIFIED — append nothing until confirmed.
      supportsResumeParam: false,
      buildEmbedUrl: function (t) {
        return t.type === 'series'
          ? 'https://www.2embed.cc/embedtv/' + t.mediaId + '&s=' + (t.season || 1) + '&e=' + (t.episode || 1)
          : 'https://www.2embed.cc/embed/' + t.mediaId;
      },
      extractProgress: function () { return null; }
    }
  ];

  function providerById(id) {
    for (var i = 0; i < PROVIDERS.length; i++) {
      if (PROVIDERS[i].id === id) return PROVIDERS[i];
    }
    return null;
  }

  /** Identify the provider for a stream URL by exact hostname match. */
  function identify(url) {
    if (typeof url !== 'string' || !url) return null;
    var host = '';
    try {
      host = new URL(url, window.location.href).hostname.toLowerCase();
    } catch (e) {
      return null;
    }
    var map = {
      'vidlink.pro': 'vidlink',
      'api.codespecters.com': 'nexstream',
      'autoembed.co': 'autoembed',
      'vidsrc.pm': 'vidsrc-pm',
      'vidsrc.su': 'vidsrc-su',
      'vidjoy.pro': 'vidjoy',
      'www.2embed.cc': '2embed',
      '2embed.cc': '2embed'
    };
    return map[host] || null;
  }

  /** Exact-match origin check. Never substring matching. */
  function isAllowedOrigin(origin) {
    if (typeof origin !== 'string' || !origin) return false;
    for (var i = 0; i < PROVIDERS.length; i++) {
      if (PROVIDERS[i].allowedOrigins.indexOf(origin) !== -1) return true;
    }
    return false;
  }

  function providerForOrigin(origin) {
    for (var i = 0; i < PROVIDERS.length; i++) {
      if (PROVIDERS[i].allowedOrigins.indexOf(origin) !== -1) return PROVIDERS[i];
    }
    return null;
  }

  /**
   * Attach a resume timestamp to an EXISTING provider URL (preserves whatever
   * query the server already put there). Appends the provider's resume param
   * only when the provider supports one AND the timestamp is valid.
   * Never produces startAt=undefined/NaN/negative.
   */
  function withResumeUrl(url, resumeTime) {
    if (!isValidResumeTime(resumeTime)) return url;
    var p = providerById(identify(url));
    if (!p || !p.supportsResumeParam || !p.resumeParam) return url;
    return appendParam(url, p.resumeParam, floorTime(resumeTime));
  }

  window.JoywatchProviders = {
    RESUME_MIN_SECONDS: RESUME_MIN_SECONDS,
    providers: PROVIDERS,
    providerById: providerById,
    identify: identify,
    isAllowedOrigin: isAllowedOrigin,
    providerForOrigin: providerForOrigin,
    withResumeUrl: withResumeUrl,
    isValidResumeTime: isValidResumeTime
  };
})();
