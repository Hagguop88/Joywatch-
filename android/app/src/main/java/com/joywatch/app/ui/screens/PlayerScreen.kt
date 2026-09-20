package com.joywatch.app.ui.screens

import android.annotation.SuppressLint
import android.app.Activity
import android.content.pm.ActivityInfo
import android.graphics.Bitmap
import android.os.Build
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
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
import androidx.compose.material.icons.filled.Dns
import androidx.compose.material.icons.filled.Fullscreen
import androidx.compose.material.icons.filled.FullscreenExit
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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.zIndex
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.joywatch.app.data.model.StreamSource
import com.joywatch.app.data.repository.JoywatchRepository
import com.joywatch.app.ui.components.ServerSwitcherDialog
import com.joywatch.app.ui.theme.JoyBorder
import com.joywatch.app.ui.theme.JoySurfaceElevated
import kotlinx.coroutines.delay

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

    var sources by remember { mutableStateOf<List<StreamSource>>(emptyList()) }
    var currentSourceIndex by remember { mutableIntStateOf(0) }
    var isControlsVisible by remember { mutableStateOf(true) }
    var showServerSwitcher by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(true) }
    var isImmersiveFullscreen by remember { mutableStateOf(true) }
    var webViewInstance by remember { mutableStateOf<WebView?>(null) }
    var customVideoView by remember { mutableStateOf<View?>(null) }
    var customViewCallback by remember { mutableStateOf<WebChromeClient.CustomViewCallback?>(null) }

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

    // Load available streaming servers
    LaunchedEffect(type, id, season, episode) {
        sources = repository.getStreamSources(type, id, title, season, episode)
    }

    // Auto-hide full controls after 5 seconds
    LaunchedEffect(isControlsVisible) {
        if (isControlsVisible) {
            delay(5000)
            isControlsVisible = false
        }
    }

    BackHandler {
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
                            userAgentString = "Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36"
                        }

                        webViewClient = object : WebViewClient() {
                            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                                super.onPageStarted(view, url, favicon)
                                isLoading = true
                            }

                            override fun onPageFinished(view: WebView?, url: String?) {
                                super.onPageFinished(view, url)
                                isLoading = false
                            }

                            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                                val reqUrl = request?.url?.toString() ?: return false
                                val host = request.url?.host?.lowercase() ?: ""
                                val allowedHosts = listOf(
                                    "vidlink.pro",
                                    "2embed.cc",
                                    "autoembed.co",
                                    "vidsrc.pm",
                                    "vidsrc.to",
                                    "vidsrc.cc",
                                    "multiembed.mov",
                                    "strem.io",
                                    "stream",
                                    "embed"
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
                            onClick = onClose,
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

                    // Action Buttons: Server Switcher + Dedicated Full Screen + Reload
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
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

        // Server Switcher Modal (zIndex 50f)
        if (showServerSwitcher) {
            Box(modifier = Modifier.zIndex(50f)) {
                ServerSwitcherDialog(
                    sources = sources,
                    selectedIndex = currentSourceIndex,
                    onSelect = { idx ->
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
