package com.joywatch.app.ui.screens

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.content.pm.ActivityInfo
import android.graphics.Bitmap
import android.media.AudioManager
import android.os.Build
import android.view.GestureDetector
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebStorage
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
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
import androidx.compose.material.icons.automirrored.filled.VolumeMute
import androidx.compose.material.icons.automirrored.filled.VolumeUp
import androidx.compose.material.icons.filled.AspectRatio
import androidx.compose.material.icons.filled.BrightnessMedium
import androidx.compose.material.icons.filled.Dns
import androidx.compose.material.icons.filled.FastForward
import androidx.compose.material.icons.filled.FastRewind
import androidx.compose.material.icons.filled.Fullscreen
import androidx.compose.material.icons.filled.FullscreenExit
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.SkipNext
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
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

    var currentSeason by remember(season) { mutableIntStateOf(season) }
    var currentEpisode by remember(episode) { mutableIntStateOf(episode) }

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

    // Playback Speed state (0.75x to 2.0x cycle like CineJoy)
    val speedOptions = remember { listOf(1.0f, 1.25f, 1.5f, 2.0f, 0.75f) }
    var currentSpeedIndex by remember { mutableIntStateOf(0) }
    val currentSpeed = speedOptions[currentSpeedIndex]

    // Universal CineJoy Glassmorphic Floating HUD
    var hudText by remember { mutableStateOf("") }
    var hudIcon by remember { mutableStateOf<androidx.compose.ui.graphics.vector.ImageVector?>(null) }
    var showHud by remember { mutableStateOf(false) }
    var loadedUrl by remember { mutableStateOf("") }

    fun loadPlayerUrl(wv: WebView, targetUrl: String) {
        if (targetUrl.contains("vidsrc.pm")) {
            val iframeHtml = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                    <style>
                        * { margin:0; padding:0; box-sizing:border-box; }
                        html, body { width:100%; height:100%; overflow:hidden; background:#000; }
                        iframe { width:100%; height:100%; border:none; display:block; }
                    </style>
                </head>
                <body>
                    <iframe id="player-iframe" 
                            src="$targetUrl" 
                            allow="autoplay; fullscreen; picture-in-picture; encrypted-media" 
                            allowfullscreen="true" 
                            webkitallowfullscreen="true">
                    </iframe>
                </body>
                </html>
            """.trimIndent()
            wv.loadDataWithBaseURL("https://vidsrc.pm/", iframeHtml, "text/html", "UTF-8", null)
        } else if (targetUrl.contains("vidsrc")) {
            val baseUrl = if (targetUrl.contains("vidsrc.su")) "https://vidsrc.su/" else "https://vidsrc.pm/"
            val iframeHtml = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                    <style>
                        * { margin:0; padding:0; box-sizing:border-box; }
                        html, body { width:100%; height:100%; overflow:hidden; background:#000; }
                        iframe { width:100%; height:100%; border:none; display:block; }
                    </style>
                </head>
                <body>
                    <iframe id="player-iframe" 
                            src="$targetUrl" 
                            allow="autoplay; fullscreen; picture-in-picture; encrypted-media" 
                            allowfullscreen="true" 
                            webkitallowfullscreen="true">
                    </iframe>
                </body>
                </html>
            """.trimIndent()
            wv.loadDataWithBaseURL(baseUrl, iframeHtml, "text/html", "UTF-8", null)
        } else {
            wv.loadUrl(targetUrl)
        }
    }

    fun triggerHud(text: String, icon: androidx.compose.ui.graphics.vector.ImageVector?) {
        hudText = text
        hudIcon = icon
        showHud = true
    }

    LaunchedEffect(showHud, hudText) {
        if (showHud) {
            delay(1400)
            showHud = false
        }
    }

    // Audio & Brightness Managers
    val audioManager = remember { context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager }
    val maxVolume = remember { audioManager?.getStreamMaxVolume(AudioManager.STREAM_MUSIC) ?: 15 }
    var currentVolumeAccumulator by remember { mutableFloatStateOf(-1f) }

    fun adjustBrightness(delta: Float) {
        val window = activity?.window ?: return
        val lp = window.attributes
        val current = if (lp.screenBrightness < 0f) {
            try {
                android.provider.Settings.System.getInt(
                    context.contentResolver,
                    android.provider.Settings.System.SCREEN_BRIGHTNESS
                ) / 255f
            } catch (e: Exception) {
                0.5f
            }
        } else {
            lp.screenBrightness
        }
        val newBrightness = (current + delta * 1.5f).coerceIn(0.05f, 1.0f)
        lp.screenBrightness = newBrightness
        window.attributes = lp

        val percent = (newBrightness * 100).toInt()
        triggerHud(
            text = "Brightness: $percent%",
            icon = Icons.Default.BrightnessMedium
        )
    }

    fun adjustVolume(delta: Float) {
        val am = audioManager ?: return
        if (currentVolumeAccumulator < 0f) {
            currentVolumeAccumulator = am.getStreamVolume(AudioManager.STREAM_MUSIC).toFloat()
        }
        val step = delta * maxVolume * 1.5f
        currentVolumeAccumulator = (currentVolumeAccumulator + step).coerceIn(0f, maxVolume.toFloat())
        val targetVol = currentVolumeAccumulator.toInt()
        am.setStreamVolume(AudioManager.STREAM_MUSIC, targetVol, 0)

        val percent = ((targetVol.toFloat() / maxVolume.toFloat()) * 100).toInt()
        triggerHud(
            text = "Volume: $percent%",
            icon = if (percent == 0) Icons.AutoMirrored.Filled.VolumeMute else Icons.AutoMirrored.Filled.VolumeUp
        )
    }

    fun seekRelative(seconds: Int) {
        val delta = seconds.toDouble()
        webViewInstance?.evaluateJavascript(
            """(function() {
                function seekInDoc(doc) {
                    var vs = doc.querySelectorAll('video');
                    for (var i = 0; i < vs.length; i++) {
                        var v = vs[i];
                        if (!isNaN(v.duration) && v.duration > 0) {
                            v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + ($delta)));
                        } else {
                            v.currentTime = Math.max(0, v.currentTime + ($delta));
                        }
                    }
                }
                try { seekInDoc(document); } catch(e) {}
                try {
                    var iframes = document.querySelectorAll('iframe');
                    for (var i = 0; i < iframes.length; i++) {
                        try { seekInDoc(iframes[i].contentDocument); } catch(e) {}
                    }
                } catch(e) {}
            })();""".trimIndent(),
            null
        )
        val prefix = if (seconds > 0) "+" else ""
        triggerHud(
            text = "$prefix${seconds}s",
            icon = if (seconds > 0) Icons.Default.FastForward else Icons.Default.FastRewind
        )
    }

    fun cyclePlaybackSpeed() {
        currentSpeedIndex = (currentSpeedIndex + 1) % speedOptions.size
        val nextSpeed = speedOptions[currentSpeedIndex]
        webViewInstance?.evaluateJavascript(
            """(function() {
                function setRateInDoc(doc) {
                    var vs = doc.querySelectorAll('video');
                    for (var i = 0; i < vs.length; i++) {
                        vs[i].playbackRate = $nextSpeed;
                    }
                }
                try { setRateInDoc(document); } catch(e) {}
                try {
                    var iframes = document.querySelectorAll('iframe');
                    for (var i = 0; i < iframes.length; i++) {
                        try { setRateInDoc(iframes[i].contentDocument); } catch(e) {}
                    }
                } catch(e) {}
            })();""".trimIndent(),
            null
        )
        triggerHud(
            text = "Speed: ${nextSpeed}x",
            icon = Icons.Default.Speed
        )
    }

    fun toggleAspectRatio() {
        val newMode = if (aspectRatioMode == "cover") "contain" else "cover"
        aspectRatioMode = newMode
        val text = if (newMode == "cover") "Aspect: Zoom to Fill (16:9 / 21:9)" else "Aspect: Fit to Screen (Original)"
        triggerHud(text = text, icon = Icons.Default.AspectRatio)
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

    fun handleDoubleTapZone(fractionX: Double) {
        when {
            fractionX < 0.35 -> seekRelative(-10)
            fractionX > 0.65 -> seekRelative(10)
            else -> toggleAspectRatio()
        }
    }

    fun playNextEpisode() {
        currentEpisode += 1
        sources = emptyList()
        isLoading = true
        triggerHud(
            text = "Playing S$currentSeason:E$currentEpisode",
            icon = Icons.Default.SkipNext
        )
    }

    var resumeTimestampSec by remember { mutableLongStateOf(0L) }
    var currentLivePositionSec by remember { mutableLongStateOf(0L) }
    var currentLiveDurationSec by remember { mutableLongStateOf(0L) }
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
                season = currentSeason,
                episode = currentEpisode,
                name = title,
                type = type
            )
        }
    }

    // Periodic HTML5 progress tracker (runs in background while player is open)
    LaunchedEffect(Unit) {
        while (true) {
            delay(1500)
            webViewInstance?.evaluateJavascript(
                """(function() {
                    var v = document.querySelector('video');
                    if (v && v.currentTime > 1 && window.JoywatchBridge) {
                        window.JoywatchBridge.reportPlayback(v.currentTime, v.duration || 0);
                    }
                    try {
                        var iframes = document.querySelectorAll('iframe');
                        for (var i = 0; i < iframes.length; i++) {
                            try {
                                var iv = iframes[i].contentDocument.querySelector('video');
                                if (iv && iv.currentTime > 1 && window.JoywatchBridge) {
                                    window.JoywatchBridge.reportPlayback(iv.currentTime, iv.duration || 0);
                                    break;
                                }
                            } catch(e) {}
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
            val lp = activity?.window?.attributes
            if (lp != null) {
                lp.screenBrightness = WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE
                activity.window.attributes = lp
            }
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

    // Load available streaming servers
    LaunchedEffect(type, id, currentSeason, currentEpisode) {
        val tmdb = repository.resolveTmdbId(id, type)
        resolvedTmdbId = tmdb

        val savedItem = watchHistoryManager.get(id)
        val resumeSec = if (type == "series") {
            if (savedItem != null && savedItem.season == currentSeason && savedItem.episode == currentEpisode) {
                savedItem.positionSeconds
            } else 0L
        } else {
            savedItem?.positionSeconds ?: 0L
        }
        resumeTimestampSec = resumeSec
        if (resumeSec > 1) {
            currentLivePositionSec = resumeSec
        }
        sources = repository.getStreamSources(type, id, title, currentSeason, currentEpisode)
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

    // Gesture detector for brightness/volume swipe and triple-zone double-tap
    val gestureDetector = remember {
        GestureDetector(context, object : GestureDetector.SimpleOnGestureListener() {
            override fun onScroll(e1: MotionEvent?, e2: MotionEvent, distanceX: Float, distanceY: Float): Boolean {
                if (e1 != null && Math.abs(distanceY) > Math.abs(distanceX) * 1.1f && Math.abs(distanceY) > 8f) {
                    val screenWidth = activity?.window?.decorView?.width?.toFloat() ?: 1920f
                    val screenHeight = activity?.window?.decorView?.height?.toFloat() ?: 1080f
                    val fractionX = e1.x / screenWidth
                    val deltaFraction = distanceY / screenHeight
                    if (fractionX < 0.5f) {
                        adjustBrightness(deltaFraction)
                    } else {
                        adjustVolume(deltaFraction)
                    }
                    return true
                }
                return false
            }

            override fun onDoubleTap(e: MotionEvent): Boolean {
                val screenWidth = activity?.window?.decorView?.width?.toFloat() ?: 1920f
                val fractionX = (e.x / screenWidth).toDouble()
                handleDoubleTapZone(fractionX)
                return true
            }

            override fun onSingleTapConfirmed(e: MotionEvent): Boolean {
                isControlsVisible = !isControlsVisible
                return false
            }
        })
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
                        try {
                            WebStorage.getInstance().deleteAllData()
                        } catch (e: Exception) {}

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

                        // Attach dual gesture detector directly to WebView
                        setOnTouchListener { _, event ->
                            gestureDetector.onTouchEvent(event)
                            false
                        }

                        // Attach Javascript bridge to receive video progress, double-tap, and swipe triggers
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
                                        season = currentSeason,
                                        episode = currentEpisode,
                                        name = title,
                                        type = type
                                    )
                                    if (resumeTimestampSec <= 1L) {
                                        resumeTimestampSec = curL
                                    }
                                }
                            }

                            @JavascriptInterface
                            fun onDoubleTapZone(fractionX: Double) {
                                activity?.runOnUiThread {
                                    handleDoubleTapZone(fractionX)
                                }
                            }

                            @JavascriptInterface
                            fun onVerticalSwipe(fractionX: Double, deltaFraction: Double) {
                                activity?.runOnUiThread {
                                    if (fractionX < 0.5) {
                                        adjustBrightness(deltaFraction.toFloat())
                                    } else {
                                        adjustVolume(deltaFraction.toFloat())
                                    }
                                }
                            }

                            @JavascriptInterface
                            fun onSingleTap() {
                                activity?.runOnUiThread {
                                    isControlsVisible = !isControlsVisible
                                }
                            }
                        }, "JoywatchBridge")

                        webViewClient = object : WebViewClient() {
                            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                                super.onPageStarted(view, url, favicon)
                                isLoading = true
                                view?.evaluateJavascript(
                                    """(function() {
                                        try {
                                            localStorage.removeItem('vidLinkProgress');
                                        } catch(e) {}
                                        try {
                                            if (!window.frameElement) {
                                                Object.defineProperty(window, 'frameElement', {
                                                    value: { hasAttribute: function(a) { return false; } },
                                                    configurable: true,
                                                    writable: true
                                                });
                                            }
                                        } catch(e) {}
                                    })();""".trimIndent(),
                                    null
                                )
                            }

                            override fun onPageFinished(view: WebView?, url: String?) {
                                super.onPageFinished(view, url)
                                isLoading = false

                                // 1. Inject CineJoy-style swipe gestures and triple-zone double tap
                                view?.evaluateJavascript(
                                    """(function() {
                                        if (window._joywatchGestureAttached) return;
                                        window._joywatchGestureAttached = true;
                                        var startX = 0;
                                        var startY = 0;
                                        var isDragging = false;
                                        var lastTap = 0;
                                        var singleTapTimeout = null;

                                        document.addEventListener('touchstart', function(e) {
                                            if (!e.touches || e.touches.length === 0) return;
                                            var t = e.touches[0];
                                            startX = t.clientX;
                                            startY = t.clientY;
                                            isDragging = false;
                                        }, { passive: true });

                                        document.addEventListener('touchmove', function(e) {
                                            if (!e.touches || e.touches.length === 0) return;
                                            var t = e.touches[0];
                                            var dx = t.clientX - startX;
                                            var dy = startY - t.clientY;
                                            var absDx = Math.abs(dx);
                                            var absDy = Math.abs(dy);

                                            if (absDy > 14 && absDy > absDx * 1.1) {
                                                isDragging = true;
                                                var fractionX = startX / (window.innerWidth || 1);
                                                var deltaFraction = dy / (window.innerHeight || 1);
                                                if (window.JoywatchBridge && window.JoywatchBridge.onVerticalSwipe) {
                                                    window.JoywatchBridge.onVerticalSwipe(fractionX, deltaFraction);
                                                }
                                                startY = t.clientY;
                                            }
                                        }, { passive: true });

                                        document.addEventListener('touchend', function(e) {
                                            if (isDragging) {
                                                isDragging = false;
                                                return;
                                            }
                                            var now = new Date().getTime();
                                            var diff = now - lastTap;
                                            var clientX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
                                            var fractionX = clientX / (window.innerWidth || 1);

                                            if (diff > 40 && diff < 380) {
                                                if (singleTapTimeout) {
                                                    clearTimeout(singleTapTimeout);
                                                    singleTapTimeout = null;
                                                }
                                                if (window.JoywatchBridge && window.JoywatchBridge.onDoubleTapZone) {
                                                    window.JoywatchBridge.onDoubleTapZone(fractionX);
                                                }
                                                lastTap = 0;
                                            } else {
                                                lastTap = now;
                                                if (singleTapTimeout) clearTimeout(singleTapTimeout);
                                                singleTapTimeout = setTimeout(function() {
                                                    if (window.JoywatchBridge && window.JoywatchBridge.onSingleTap) {
                                                        window.JoywatchBridge.onSingleTap();
                                                    }
                                                    singleTapTimeout = null;
                                                }, 350);
                                            }
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

                                // 3. CSS for locked viewport & watermark removal
                                view?.evaluateJavascript(
                                    """(function() {
                                        try {
                                            var wm1 = document.getElementById('wm-left'); if (wm1) wm1.style.display = 'none';
                                            var wm2 = document.getElementById('wm-right'); if (wm2) wm2.style.display = 'none';
                                            var apiOv = document.getElementById('api-overlay'); if (apiOv) apiOv.style.display = 'none';
                                            var nexStyle = document.createElement('style');
                                            nexStyle.innerHTML = 'html, body { overflow: hidden !important; touch-action: none !important; user-select: none !important; } #wm-left, #wm-right, #api-overlay, .watermark, a[href*="codespecters"] { display: none !important; opacity: 0 !important; pointer-events: none !important; }';
                                            document.head.appendChild(nexStyle);
                                        } catch(e) {}
                                    })();""".trimIndent(),
                                    null
                                )

                                // 4. If custom playback speed is selected, maintain it on new pages
                                if (currentSpeed != 1.0f) {
                                    view?.evaluateJavascript(
                                        """(function() {
                                            var vs = document.querySelectorAll('video');
                                            vs.forEach(function(v) { v.playbackRate = $currentSpeed; });
                                        })();""".trimIndent(),
                                        null
                                    )
                                }

                                // 5. Remove any corrupted vidLinkProgress so Server 1 loads cleanly without exception
                                view?.evaluateJavascript(
                                    """(function() {
                                        try {
                                            localStorage.removeItem('vidLinkProgress');
                                        } catch(e) {}
                                    })();""".trimIndent(),
                                    null
                                )
                            }

                            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                                val reqUrl = request?.url?.toString() ?: return false
                                val host = request.url?.host?.lowercase() ?: ""

                                // 1. Allow subframes, iframes, player CDNs, scripts, and Turnstile to load freely
                                if (request != null && !request.isForMainFrame) {
                                    return false
                                }

                                // 2. Block known anti-sandbox / error redirect screens so the player remains visible
                                if (reqUrl.contains("asb.html") || reqUrl.contains("/blocked") || reqUrl.contains("playback blocked")) {
                                    return true
                                }

                                val allowedHosts = listOf(
                                    "vidlink.pro",
                                    "codespecters.com",
                                    "embedmaster.link",
                                    "nexstream",
                                    "autoembed.co",
                                    "autoembed.to",
                                    "vidjoy.pro",
                                    "vidsrc.pm",
                                    "vidsrc.su",
                                    "vidsrc.to",
                                    "vidsrc.cc",
                                    "vidsrc.xyz",
                                    "vidsrc.net",
                                    "vidsrc.me",
                                    "vidsrc",
                                    "nextgencloudfabric.com",
                                    "challenges.cloudflare.com",
                                    "cloudflare.com",
                                    "anyembed.xyz",
                                    "multiembed.mov",
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
                        loadedUrl = currentUrl
                        loadPlayerUrl(this, currentUrl)
                    }
                },
                update = { wv ->
                    if (loadedUrl != currentUrl) {
                        loadedUrl = currentUrl
                        isLoading = true
                        loadPlayerUrl(wv, currentUrl)
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
        // so the user can ALWAYS change server, playback speed, or toggle fullscreen at ANY second!
        if (!isControlsVisible) {
            Row(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(12.dp)
                    .zIndex(30f),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Persistent Server Switcher Chip
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

                // Persistent Playback Speed Chip
                Box(
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(Color(0xCC0C0D14))
                        .border(1.dp, JoyBorder, CircleShape)
                        .clickable { cyclePlaybackSpeed() }
                        .padding(horizontal = 10.dp, vertical = 7.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Speed,
                            contentDescription = "Speed",
                            tint = if (currentSpeed != 1.0f) Color(0xFF38BDF8) else Color.White,
                            modifier = Modifier.size(13.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "${currentSpeed}x",
                            color = if (currentSpeed != 1.0f) Color(0xFF38BDF8) else Color.White,
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
                                    text = "Season $currentSeason • Episode $currentEpisode",
                                    color = Color(0xFFB0B0B8),
                                    fontSize = 11.sp
                                )
                            }
                        }
                    }

                    // Action Buttons: Next Ep + Speed + Server Switcher + Fullscreen + Aspect + Reload
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // Next Episode Button (Series only)
                        if (type == "series") {
                            Box(
                                modifier = Modifier
                                    .clip(CircleShape)
                                    .background(Color(0xDD0C0D14))
                                    .border(1.dp, JoyBorder, CircleShape)
                                    .clickable { playNextEpisode() }
                                    .padding(horizontal = 12.dp, vertical = 8.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.SkipNext,
                                        contentDescription = "Next Episode",
                                        tint = Color.White,
                                        modifier = Modifier.size(15.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = "Next Ep (E${currentEpisode + 1})",
                                        color = Color.White,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }

                        // Speed Chip Button
                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(Color(0xDD0C0D14))
                                .border(1.dp, JoyBorder, CircleShape)
                                .clickable { cyclePlaybackSpeed() }
                                .padding(horizontal = 12.dp, vertical = 8.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.Speed,
                                    contentDescription = "Speed",
                                    tint = if (currentSpeed != 1.0f) Color(0xFF38BDF8) else Color.White,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "${currentSpeed}x",
                                    color = if (currentSpeed != 1.0f) Color(0xFF38BDF8) else Color.White,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
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

        // CineJoy Floating Glassmorphic HUD Pill (Centered with smooth scale & fade animation)
        AnimatedVisibility(
            visible = showHud,
            enter = fadeIn() + scaleIn(initialScale = 0.85f),
            exit = fadeOut() + scaleOut(targetScale = 0.85f),
            modifier = Modifier
                .align(Alignment.Center)
                .zIndex(70f)
        ) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color(0xE614151E))
                    .border(1.dp, JoyBorder, RoundedCornerShape(24.dp))
                    .padding(horizontal = 24.dp, vertical = 14.dp),
                contentAlignment = Alignment.Center
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    hudIcon?.let { icon ->
                        Icon(
                            imageVector = icon,
                            contentDescription = null,
                            tint = Color(0xFF38BDF8),
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Text(
                        text = hudText,
                        color = Color.White,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
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
                            val target = sources[idx].url
                            loadedUrl = target
                            webViewInstance?.let { loadPlayerUrl(it, target) }
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
