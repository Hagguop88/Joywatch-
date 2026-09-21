package com.joywatch.app.ui.screens

import android.annotation.SuppressLint
import android.app.Activity
import android.content.pm.ActivityInfo
import android.graphics.Bitmap
import android.os.Build
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AspectRatio
import androidx.compose.material.icons.filled.Dns
import androidx.compose.material.icons.filled.Fullscreen
import androidx.compose.material.icons.filled.FullscreenExit
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.zIndex
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import com.joywatch.app.data.model.StreamSource
import com.joywatch.app.data.repository.JoywatchRepository
import com.joywatch.app.ui.components.ServerSwitcherDialog
import com.joywatch.app.ui.theme.JoyBorder
import com.joywatch.app.ui.theme.JoySurfaceElevated
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun PlayerScreen(
    type: String,
    id: String,
    title: String,
    season: Int,
    episode: Int,
    repository: JoywatchRepository,
    onClose: () -> Unit
) {
    val context = LocalContext.current
    val activity = context as? Activity
    val watchHistoryManager = remember { com.joywatch.app.data.repository.WatchHistoryManager(context) }
    val coroutineScope = rememberCoroutineScope()

    var sources by remember { mutableStateOf<List<StreamSource>>(emptyList()) }
    var currentSourceIndex by remember { mutableIntStateOf(0) }
    var isControlsVisible by remember { mutableStateOf(true) }
    var showServerSwitcher by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(true) }
    var isImmersiveFullscreen by remember { mutableStateOf(true) }
    var webViewInstance by remember { mutableStateOf<WebView?>(null) }
    var customVideoView by remember { mutableStateOf<View?>(null) }
    var customViewCallback by remember { mutableStateOf<WebChromeClient.CustomViewCallback?>(null) }

    // Aspect ratio state (Fit vs. Fill / Zoom to Screen)
    var aspectRatioMode by remember { mutableStateOf("contain") }
    var showAspectHud by remember { mutableStateOf(false) }
    var aspectHudText by remember { mutableStateOf("") }

    var resumeTimestampSec by remember { mutableLongStateOf(0L) }
    var currentLivePositionSec by remember { mutableLongStateOf(0L) }
    var currentLiveDurationSec by remember { mutableLongStateOf(0L) }
    var hasUserResumed by remember { mutableStateOf(false) }
    var resolvedTmdbId by remember { mutableStateOf("") }

    fun flushWatchProgress() {
        val pos = when {
            currentLivePositionSec > 1 -> currentLivePositionSec
            resumeTimestampSec > 1 -> resumeTimestampSec
            else -> 0L
        }
        if (pos > 1) {
            watchHistoryManager.updateProgress(
                id = id,
                positionSec = pos,
                durationSec = currentLiveDurationSec,
                season = season,
                episode = episode,
                name = title,
                type = type
            )
        }
    }

    fun formatTimestamp(totalSeconds: Long): String {
        val hrs = totalSeconds / 3600
        val mins = (totalSeconds % 3600) / 60
        val secs = totalSeconds % 60
        return if (hrs > 0) {
            String.format("%d:%02d:%02d", hrs, mins, secs)
        } else {
            String.format("%d:%02d", mins, secs)
        }
    }

    fun seekToSavedTimestamp(targetSec: Long) {
        if (targetSec <= 0) return
        val formatted = formatTimestamp(targetSec)
        aspectHudText = "Resumed to $formatted"
        showAspectHud = true
        hasUserResumed = true
        resumeTimestampSec = targetSec
        currentLivePositionSec = targetSec

        // 1. If currently on VidLink (Server 1), reload with ?startAt= to guarantee seek
        val currentSource = sources.getOrNull(currentSourceIndex)
        if (currentSource != null && currentSource.name.contains("VidLink", ignoreCase = true)) {
            val baseVidlinkUrl = currentSource.url.replace(Regex("[?&]startAt=\\d+"), "")
            val separator = if (baseVidlinkUrl.contains("?")) "&" else "?"
            val newVidlinkUrl = "$baseVidlinkUrl${separator}startAt=$targetSec"
            val tmdbKey = resolvedTmdbId.ifEmpty { id }
            webViewInstance?.evaluateJavascript(
                """(function() {
                    try {
                        var p = JSON.parse(localStorage.getItem('vidLinkProgress') || '{}');
                        var entry = { id: '$tmdbKey', currentTime: $targetSec, watched_seconds: $targetSec, last_updated: Date.now() };
                        p['$id'] = entry;
                        p['$tmdbKey'] = entry;
                        localStorage.setItem('vidLinkProgress', JSON.stringify(p));
                    } catch(e) {}
                })();""".trimIndent(),
                null
            )
            webViewInstance?.loadUrl(newVidlinkUrl)
        }

        // 2. Direct HTML5 video element seek & postMessage seek
        val js = """(function() {
            var target = $targetSec;
            var vs = document.querySelectorAll('video');
            vs.forEach(function(v) {
                if (v) {
                    v.currentTime = target;
                    try { v.play(); } catch(e) {}
                }
            });

            try {
                if (window.jwplayer) {
                    var p = window.jwplayer();
                    if (p && p.seek) p.seek(target);
                }
            } catch(e) {}

            var iframes = document.querySelectorAll('iframe');
            iframes.forEach(function(f) {
                try {
                    f.contentWindow.postMessage({ type: 'seek', time: target, currentTime: target }, '*');
                    f.contentWindow.postMessage({ event: 'command', func: 'seekTo', args: [target, true] }, '*');
                    f.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [target, true] }), '*');
                } catch(e) {}
            });
        })();""".trimIndent()

        webViewInstance?.evaluateJavascript(js, null)

        coroutineScope.launch {
            delay(800)
            webViewInstance?.evaluateJavascript(js, null)
        }
    }

    fun toggleAspectRatio() {
        val newMode = if (aspectRatioMode == "cover") "contain" else "cover"
        aspectRatioMode = newMode
        aspectHudText = if (newMode == "cover") "Aspect: Zoom to Fill (16:9 / 21:9)" else "Aspect: Fit to Screen (Original)"
        showAspectHud = true
        webViewInstance?.evaluateJavascript(
            """(function() {
                var vs = document.querySelectorAll('video');
                vs.forEach(function(v) {
                    v.style.objectFit = '$newMode';
                    v.style.width = '100%';
                    v.style.height = '100%';
                });
                var fs = document.querySelectorAll('iframe');
                fs.forEach(function(f) {
                    f.style.transform = '${if (newMode == "cover") "scale(1.15)" else "scale(1.0)"}';
                    f.style.transformOrigin = 'center center';
                });
            })();""".trimIndent(),
            null
        )
    }

    // Auto-hide HUD pill after 1.8s
    LaunchedEffect(showAspectHud) {
        if (showAspectHud) {
            delay(1800)
            showAspectHud = false
        }
    }

    // Periodic HTML5 and VidLink progress tracker (runs in background while player is open)
    LaunchedEffect(Unit) {
        while (true) {
            delay(1500)
            val tmdbKey = resolvedTmdbId.ifEmpty { id }
            webViewInstance?.evaluateJavascript(
                """(function() {
                    var v = document.querySelector('video');
                    if (v && v.currentTime > 1 && window.JoywatchBridge) {
                        window.JoywatchBridge.reportPlayback(v.currentTime, v.duration || 0);
                    }
                    try {
                        var p = JSON.parse(localStorage.getItem('vidLinkProgress') || '{}');
                        var item = p['$id'] || (('$tmdbKey' !== '$id') ? p['$tmdbKey'] : null);
                        if (item) {
                            var cur = item.currentTime || item.watched_seconds || 0;
                            var dur = item.duration || 0;
                            if (cur > 1 && window.JoywatchBridge) {
                                window.JoywatchBridge.reportPlayback(cur, dur);
                            }
                        }
                    } catch(e) {}
                })();""".trimIndent(),
                null
            )
        }
    }

    // Helper to control system bars and display cutout
    fun applyImmersiveFullscreen(enable: Boolean) {
        val window = activity?.window ?: return
        val insetsController = WindowCompat.getInsetsController(window, window.decorView)
        if (enable) {
            insetsController.systemBarsBehavior =
                WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            insetsController.hide(WindowInsetsCompat.Type.systemBars())
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                window.attributes.layoutInDisplayCutoutMode =
                    WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
            }
        } else {
            insetsController.show(WindowInsetsCompat.Type.systemBars())
        }
    }

    // Lock orientation to Landscape & Enter True Immersive Mode
    DisposableEffect(Unit) {
        val originalOrientation = activity?.requestedOrientation ?: ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
        activity?.requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
        activity?.window?.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        applyImmersiveFullscreen(true)

        onDispose {
            activity?.requestedOrientation = originalOrientation
            activity?.window?.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            applyImmersiveFullscreen(false)
        }
    }

    // Flush watch progress immediately when app goes to background / paused / stopped
    val lifecycleOwner = LocalLifecycleOwner.current
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_PAUSE || event == Lifecycle.Event.ON_STOP) {
                flushWatchProgress()
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }

    // Load available streaming servers with resume timestamp injected
    LaunchedEffect(type, id, season, episode) {
        val tmdb = repository.resolveTmdbId(id, type)
        resolvedTmdbId = tmdb

        val savedItem = watchHistoryManager.get(id)
        val resumeSec = if (type == "series") {
            if (savedItem != null && savedItem.season == season && savedItem.episode == episode) {
                savedItem.positionSeconds
            } else 0L
        } else {
            savedItem?.positionSeconds ?: 0L
        }
        resumeTimestampSec = resumeSec
        if (resumeSec > 1) {
            currentLivePositionSec = resumeSec
        }
        sources = repository.getStreamSources(type, id, title, season, episode, resumeSeconds = resumeSec)
    }

    // Auto-hide full controls after 5 seconds
    LaunchedEffect(isControlsVisible) {
        if (isControlsVisible) {
            delay(5000)
            isControlsVisible = false
        }
    }

    BackHandler {
        flushWatchProgress()
        if (customVideoView != null) {
            customViewCallback?.onCustomViewHidden()
            customVideoView = null
        } else {
            onClose()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        // Fullscreen Custom View (When HTML5 player requests native fullscreen)
        if (customVideoView != null) {
            AndroidView(
                factory = { customVideoView!! },
                modifier = Modifier
                    .fillMaxSize()
                    .zIndex(1f)
            )
        } else if (sources.isNotEmpty()) {
            val currentUrl = sources[currentSourceIndex].url

            // Video Streaming WebView
            AndroidView(
                factory = { ctx ->
                    WebView(ctx).apply {
                        layoutParams = FrameLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )
                        setBackgroundColor(android.graphics.Color.BLACK)

                        // Enable 3rd party cookies for iframe CDN streaming session persistence
                        val cookieManager = CookieManager.getInstance()
                        cookieManager.setAcceptCookie(true)
                        cookieManager.setAcceptThirdPartyCookies(this, true)

                        setLayerType(View.LAYER_TYPE_HARDWARE, null)

                        settings.apply {
                            javaScriptEnabled = true
                            domStorageEnabled = true
                            databaseEnabled = true
                            mediaPlaybackRequiresUserGesture = false
                            allowFileAccess = true
                            allowContentAccess = true
                            loadWithOverviewMode = true
                            useWideViewPort = true
                            setSupportMultipleWindows(false)
                            javaScriptCanOpenWindowsAutomatically = false
                            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                            // High-definition Desktop profile unlocks full 1080p bitrate ladder
                            userAgentString = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
                            // Disable destructive native zoom gestures that cause black screen
                            setSupportZoom(false)
                            builtInZoomControls = false
                            displayZoomControls = false
                        }

                        // Attach Javascript bridge to receive video progress & double-tap triggers
                        addJavascriptInterface(object {
                            @JavascriptInterface
                            fun reportPlayback(currentSec: Double, durationSec: Double) {
                                val curL = currentSec.toLong()
                                val durL = durationSec.toLong()
                                if (curL > 1) {
                                    currentLivePositionSec = curL
                                    if (durL > 0) currentLiveDurationSec = durL
                                    watchHistoryManager.updateProgress(
                                        id = id,
                                        positionSec = curL,
                                        durationSec = durL,
                                        season = season,
                                        episode = episode,
                                        name = title,
                                        type = type
                                    )
                                    if (hasUserResumed || resumeTimestampSec <= 1L) {
                                        resumeTimestampSec = curL
                                    }
                                }
                            }

                            @JavascriptInterface
                            fun onDoubleTap() {
                                activity?.runOnUiThread {
                                    toggleAspectRatio()
                                }
                            }
                        }, "JoywatchBridge")

                        webViewClient = object : WebViewClient() {
                            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                                super.onPageStarted(view, url, favicon)
                                isLoading = true
                            }

                            override fun onPageFinished(view: WebView?, url: String?) {
                                super.onPageFinished(view, url)
                                isLoading = false

                                // 1. Inject double-tap touch listener to cleanly toggle aspect ratio
                                view?.evaluateJavascript(
                                    """(function() {
                                        var lastTap = 0;
                                        document.addEventListener('touchend', function(e) {
                                            var now = new Date().getTime();
                                            var diff = now - lastTap;
                                            if (diff > 40 && diff < 380) {
                                                if (window.JoywatchBridge) {
                                                    window.JoywatchBridge.onDoubleTap();
                                                }
                                            }
                                            lastTap = now;
                                        }, { passive: true });
                                    })();""".trimIndent(),
                                    null
                                )

                                // 2. Listen to player postMessage MEDIA_DATA / timeupdate events
                                view?.evaluateJavascript(
                                    """(function() {
                                        if (window._joywatchMsgListenerAttached) return;
                                        window._joywatchMsgListenerAttached = true;
                                        window.addEventListener('message', function(event) {
                                            try {
                                                var d = event.data;
                                                if (typeof d === 'string') {
                                                    try { d = JSON.parse(d); } catch(e) {}
                                                }
                                                if (d && typeof d === 'object') {
                                                    var cur = 0;
                                                    var dur = 0;
                                                    if (d.type === 'MEDIA_DATA' && d.data) {
                                                        cur = d.data.currentTime || d.data.watched_seconds || d.data.current_time || 0;
                                                        dur = d.data.duration || 0;
                                                    } else if (d.currentTime !== undefined) {
                                                        cur = d.currentTime;
                                                        dur = d.duration || 0;
                                                    } else if (d.watched_seconds !== undefined) {
                                                        cur = d.watched_seconds;
                                                        dur = d.duration || 0;
                                                    } else if (d.data && (d.data.currentTime !== undefined || d.data.watched_seconds !== undefined)) {
                                                        cur = d.data.currentTime || d.data.watched_seconds || 0;
                                                        dur = d.data.duration || 0;
                                                    }
                                                    if (cur > 1 && window.JoywatchBridge) {
                                                        window.JoywatchBridge.reportPlayback(cur, dur);
                                                    }
                                                }
                                            } catch(e) {}
                                        }, false);
                                    })();""".trimIndent(),
                                    null
                                )

                                // 3. Pre-seed VidLink localStorage and poll video seek if resuming
                                if (resumeTimestampSec > 1) {
                                    val targetSec = resumeTimestampSec
                                    val tmdbKey = resolvedTmdbId.ifEmpty { id }
                                    view?.evaluateJavascript(
                                        """(function() {
                                            try {
                                                var p = JSON.parse(localStorage.getItem('vidLinkProgress') || '{}');
                                                var entry = {
                                                    id: '$tmdbKey',
                                                    currentTime: $targetSec,
                                                    watched_seconds: $targetSec,
                                                    last_updated: Date.now()
                                                };
                                                p['$id'] = entry;
                                                p['$tmdbKey'] = entry;
                                                localStorage.setItem('vidLinkProgress', JSON.stringify(p));
                                            } catch(e) {}

                                            var attempts = 0;
                                            var seekInterval = setInterval(function() {
                                                attempts++;
                                                var vs = document.querySelectorAll('video');
                                                var done = false;
                                                vs.forEach(function(v) {
                                                    if (v && v.duration > 0 && Math.abs(v.currentTime - $targetSec) > 5) {
                                                        v.currentTime = $targetSec;
                                                        done = true;
                                                    }
                                                });
                                                if (done || attempts > 25) {
                                                    clearInterval(seekInterval);
                                                }
                                            }, 500);
                                        })();""".trimIndent(),
                                        null
                                    )
                                }
                            }

                            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                                val reqUrl = request?.url?.toString() ?: return false
                                val host = request.url?.host?.lowercase() ?: ""
                                val allowedHosts = listOf(
                                    "vidlink.pro",
                                    "2embed.cc",
                                    "autoembed.co",
                                    "autoembed.to",
                                    "vidjoy.pro",
                                    "vidsrc.pm",
                                    "vidsrc.to",
                                    "vidsrc.cc",
                                    "anyembed.xyz",
                                    "multiembed.mov",
                                    "blackvid.space",
                                    "databasegdriveplayer.co",
                                    "frembed.live",
                                    "strem.io",
                                    "stream",
                                    "embed",
                                    "player",
                                    "cloud"
                                )
                                val isAllowed = allowedHosts.any { host.contains(it) } ||
                                        reqUrl.contains(".m3u8") ||
                                        reqUrl.contains(".mp4")

                                return if (isAllowed) {
                                    false
                                } else {
                                    // Block popups and external spam ads
                                    true
                                }
                            }
                        }

                        webChromeClient = object : WebChromeClient() {
                            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                                if (newProgress >= 70) {
                                    isLoading = false
                                }
                            }

                            override fun onShowCustomView(view: View?, callback: CustomViewCallback?) {
                                customVideoView = view
                                customViewCallback = callback
                                applyImmersiveFullscreen(true)
                            }

                            override fun onHideCustomView() {
                                customVideoView = null
                                customViewCallback?.onCustomViewHidden()
                                customViewCallback = null
                                applyImmersiveFullscreen(isImmersiveFullscreen)
                            }
                        }

                        webViewInstance = this
                        loadUrl(currentUrl)
                    }
                },
                update = { wv ->
                    if (wv.url != currentUrl) {
                        isLoading = true
                        wv.loadUrl(currentUrl)
                    }
                },
                modifier = Modifier
                    .fillMaxSize()
                    .zIndex(1f)
            )
        }

        // Loading Spinner Overlay
        if (isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.65f))
                    .zIndex(10f),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    CircularProgressIndicator(
                        color = Color.White,
                        modifier = Modifier.size(44.dp)
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = if (sources.isNotEmpty()) "Connecting to ${sources[currentSourceIndex].name}..." else "Loading stream...",
                        color = Color.White,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Use the Servers button to switch if slow",
                        color = Color(0xFF9E9EA7),
                        fontSize = 11.sp
                    )
                }
            }
        }

        // PERSISTENT QUICK-ACTION STRIP (Always reachable on top of video, zIndex 30f)
        // When controls are hidden during playback, this compact translucent chip stays in the top-right
        // so the user can ALWAYS change server or toggle fullscreen at ANY second while the movie is playing!
        if (!isControlsVisible) {
            Row(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(12.dp)
                    .zIndex(30f),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Interactive Resume / Live Timestamp Tab
                val displayTimestamp = if (hasUserResumed || resumeTimestampSec <= 1L) currentLivePositionSec else resumeTimestampSec
                val effectiveSec = if (displayTimestamp > 1) displayTimestamp else resumeTimestampSec
                if (effectiveSec > 1) {
                    ResumeTimestampTab(
                        timestampSec = effectiveSec,
                        isLive = hasUserResumed,
                        onClick = {
                            if (!hasUserResumed) {
                                seekToSavedTimestamp(effectiveSec)
                            } else {
                                aspectHudText = "Playing at ${formatTimestamp(effectiveSec)}"
                                showAspectHud = true
                            }
                        }
                    )
                }

                // Persistent Server Switcher Chip (Always accessible while movie is playing!)
                Box(
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(Color(0xCC0C0D14))
                        .border(1.dp, JoyBorder, CircleShape)
                        .clickable { showServerSwitcher = true }
                        .padding(horizontal = 12.dp, vertical = 7.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Dns,
                            contentDescription = "Switch Server",
                            tint = Color.White,
                            modifier = Modifier.size(13.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (sources.isNotEmpty()) "Server ${currentSourceIndex + 1}" else "Servers",
                            color = Color.White,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                // Dedicated Full Screen Button
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(Color(0xCC0C0D14))
                        .border(1.dp, JoyBorder, CircleShape)
                        .clickable {
                            isImmersiveFullscreen = !isImmersiveFullscreen
                            applyImmersiveFullscreen(isImmersiveFullscreen)
                            // Request HTML5 video element fullscreen
                            webViewInstance?.evaluateJavascript(
                                "(function(){var v=document.querySelector('video');if(v&&v.requestFullscreen){v.requestFullscreen();}else if(document.documentElement.requestFullscreen){document.documentElement.requestFullscreen();}})();",
                                null
                            )
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = if (isImmersiveFullscreen) Icons.Default.FullscreenExit else Icons.Default.Fullscreen,
                        contentDescription = "Toggle Fullscreen",
                        tint = Color.White,
                        modifier = Modifier.size(16.dp)
                    )
                }

                // Back / Expand Controls Button
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(Color(0xCC0C0D14))
                        .border(1.dp, JoyBorder, CircleShape)
                        .clickable { isControlsVisible = true },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Exit Player",
                        tint = Color.White,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }

        // FULL CINEMA OVERLAY CONTROLS (Top Bar when active, zIndex 40f)
        AnimatedVisibility(
            visible = isControlsVisible,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier
                .fillMaxSize()
                .zIndex(40f)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.35f))
            ) {
                // Top Bar
                Row(
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    // Back & Title
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.weight(1f)
                    ) {
                        IconButton(
                            onClick = {
                                flushWatchProgress()
                                onClose()
                            },
                            modifier = Modifier
                                .background(Color(0xDD0C0D14), CircleShape)
                                .border(1.dp, JoyBorder, CircleShape)
                                .size(38.dp)
                        ) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                contentDescription = "Back",
                                tint = Color.White,
                                modifier = Modifier.size(18.dp)
                            )
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column {
                            Text(
                                text = title,
                                color = Color.White,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            if (type == "series") {
                                Text(
                                    text = "Season $season • Episode $episode",
                                    color = Color(0xFFB0B0B8),
                                    fontSize = 11.sp
                                )
                            }
                        }
                    }

                    // Action Buttons: Resume Tab + Server Switcher + Dedicated Full Screen + Reload
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // Interactive Resume / Live Timestamp Tab
                        val displayTimestamp = if (hasUserResumed || resumeTimestampSec <= 1L) currentLivePositionSec else resumeTimestampSec
                        val effectiveSec = if (displayTimestamp > 1) displayTimestamp else resumeTimestampSec
                        if (effectiveSec > 1) {
                            ResumeTimestampTab(
                                timestampSec = effectiveSec,
                                isLive = hasUserResumed,
                                onClick = {
                                    if (!hasUserResumed) {
                                        seekToSavedTimestamp(effectiveSec)
                                    } else {
                                        aspectHudText = "Playing at ${formatTimestamp(effectiveSec)}"
                                        showAspectHud = true
                                    }
                                }
                            )
                        }

                        // Server Switcher Button
                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(Color(0xDD0C0D14))
                                .border(1.dp, JoyBorder, CircleShape)
                                .clickable { showServerSwitcher = true }
                                .padding(horizontal = 14.dp, vertical = 8.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.Dns,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(13.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = if (sources.isNotEmpty()) "Server ${currentSourceIndex + 1}" else "Servers",
                                    color = Color.White,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        // Dedicated Fullscreen Button
                        IconButton(
                            onClick = {
                                isImmersiveFullscreen = !isImmersiveFullscreen
                                applyImmersiveFullscreen(isImmersiveFullscreen)
                                webViewInstance?.evaluateJavascript(
                                    "(function(){var v=document.querySelector('video');if(v&&v.requestFullscreen){v.requestFullscreen();}else if(document.documentElement.requestFullscreen){document.documentElement.requestFullscreen();}})();",
                                    null
                                )
                            },
                            modifier = Modifier
                                .background(Color(0xDD0C0D14), CircleShape)
                                .border(1.dp, JoyBorder, CircleShape)
                                .size(38.dp)
                        ) {
                            Icon(
                                imageVector = if (isImmersiveFullscreen) Icons.Default.FullscreenExit else Icons.Default.Fullscreen,
                                contentDescription = "Full Screen",
                                tint = Color.White,
                                modifier = Modifier.size(18.dp)
                            )
                        }

                        // Dedicated Aspect Ratio Toggle Button
                        IconButton(
                            onClick = { toggleAspectRatio() },
                            modifier = Modifier
                                .background(Color(0xDD0C0D14), CircleShape)
                                .border(1.dp, JoyBorder, CircleShape)
                                .size(38.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.AspectRatio,
                                contentDescription = "Aspect Ratio",
                                tint = if (aspectRatioMode == "cover") Color(0xFF38BDF8) else Color.White,
                                modifier = Modifier.size(18.dp)
                            )
                        }

                        // Reload Button
                        IconButton(
                            onClick = {
                                if (sources.isNotEmpty()) {
                                    isLoading = true
                                    webViewInstance?.reload()
                                }
                            },
                            modifier = Modifier
                                .background(Color(0xDD0C0D14), CircleShape)
                                .border(1.dp, JoyBorder, CircleShape)
                                .size(38.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = "Reload",
                                tint = Color.White,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }
        }

        // Aspect Ratio HUD Indicator (Centered Toast)
        if (showAspectHud) {
            Box(
                modifier = Modifier
                    .align(Alignment.Center)
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color(0xEE090A0E))
                    .border(1.dp, JoyBorder, RoundedCornerShape(24.dp))
                    .padding(horizontal = 20.dp, vertical = 10.dp)
                    .zIndex(70f)
            ) {
                Text(
                    text = aspectHudText,
                    color = Color.White,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        // Server Switcher Modal (zIndex 50f)
        if (showServerSwitcher) {
            Box(modifier = Modifier.zIndex(50f)) {
                ServerSwitcherDialog(
                    sources = sources,
                    selectedIndex = currentSourceIndex,
                    onSelect = { idx ->
                        flushWatchProgress()
                        currentSourceIndex = idx
                        isLoading = true
                        if (idx < sources.size) {
                            webViewInstance?.loadUrl(sources[idx].url)
                        }
                    },
                    onDismiss = { showServerSwitcher = false }
                )
            }
        }
    }

    // Clean up WebView when exiting player
    DisposableEffect(Unit) {
        onDispose {
            flushWatchProgress()
            webViewInstance?.apply {
                stopLoading()
                loadUrl("about:blank")
                clearHistory()
                removeAllViews()
                destroy()
            }
            webViewInstance = null
        }
    }
}

@Composable
fun ResumeTimestampTab(
    timestampSec: Long,
    isLive: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (timestampSec <= 1) return
    val hrs = timestampSec / 3600
    val mins = (timestampSec % 3600) / 60
    val secs = timestampSec % 60
    val formatted = if (hrs > 0) {
        String.format("%d:%02d:%02d", hrs, mins, secs)
    } else {
        String.format("%d:%02d", mins, secs)
    }

    Box(
        modifier = modifier
            .clip(CircleShape)
            .background(if (isLive) Color(0xDD064E3B) else Color(0xE6062417))
            .border(
                1.dp,
                if (isLive) Color(0xFF34D399) else Color(0xFF10B981).copy(alpha = 0.85f),
                CircleShape
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 11.dp, vertical = 7.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(5.dp)
        ) {
            if (isLive) {
                Box(
                    modifier = Modifier
                        .size(7.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF34D399))
                )
                Text(
                    text = "⏱ $formatted",
                    color = Color.White,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            } else {
                Icon(
                    imageVector = Icons.Default.History,
                    contentDescription = "Resume timestamp",
                    tint = Color(0xFF34D399),
                    modifier = Modifier.size(13.dp)
                )
                Text(
                    text = "Resume $formatted",
                    color = Color.White,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

