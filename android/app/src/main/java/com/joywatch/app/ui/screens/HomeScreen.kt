package com.joywatch.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.joywatch.app.data.model.MediaItem
import com.joywatch.app.data.model.isExplicitContent
import com.joywatch.app.data.repository.JoyListManager
import com.joywatch.app.data.repository.JoywatchRepository
import com.joywatch.app.data.repository.WatchHistoryManager
import com.joywatch.app.ui.components.Billboard
import com.joywatch.app.ui.components.ContinueWatchingShelf
import com.joywatch.app.ui.components.DetailBottomSheet
import com.joywatch.app.ui.components.MediaShelf
import com.joywatch.app.ui.components.ProviderCatalogSheet
import com.joywatch.app.ui.components.ProviderShelf
import com.joywatch.app.ui.components.StreamingProvider
import com.joywatch.app.ui.theme.JoyBackground
import com.joywatch.app.ui.theme.JoyTextMuted
import com.joywatch.app.ui.theme.JoyTextPrimary

@Composable
fun HomeScreen(
    category: String, // "all", "movie", "series", "anime"
    repository: JoywatchRepository,
    joyListManager: JoyListManager,
    watchHistoryManager: WatchHistoryManager,
    onPlay: (MediaItem, Int, Int) -> Unit,
    modifier: Modifier = Modifier
) {
    var trendingMovies by remember { mutableStateOf<List<MediaItem>>(emptyList()) }
    var featuredSeries by remember { mutableStateOf<List<MediaItem>>(emptyList()) }
    var actionMovies by remember { mutableStateOf<List<MediaItem>>(emptyList()) }
    var animeList by remember { mutableStateOf<List<MediaItem>>(emptyList()) }
    var tmdbTrending by remember { mutableStateOf<List<MediaItem>>(emptyList()) }
    var netflixCatalog by remember { mutableStateOf<List<MediaItem>>(emptyList()) }
    var disneyCatalog by remember { mutableStateOf<List<MediaItem>>(emptyList()) }
    var hboCatalog by remember { mutableStateOf<List<MediaItem>>(emptyList()) }
    var primeCatalog by remember { mutableStateOf<List<MediaItem>>(emptyList()) }
    var appleCatalog by remember { mutableStateOf<List<MediaItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    var selectedDetailItem by remember { mutableStateOf<MediaItem?>(null) }
    var selectedProvider by remember { mutableStateOf<StreamingProvider?>(null) }
    val joyListItems by joyListManager.joyList.collectAsState()
    val continueWatchingItems by watchHistoryManager.continueWatching.collectAsState()

    LaunchedEffect(category) {
        isLoading = true
        val targetType = if (category == "series") "series" else "movie"
        when (category) {
            "movie" -> {
                trendingMovies = repository.getCatalog("movie")
                actionMovies = repository.getCatalog("movie", "Action")
            }
            "series" -> {
                featuredSeries = repository.getCatalog("series")
            }
            "anime" -> {
                animeList = repository.getCatalog("series", "Animation")
            }
            else -> {
                // "all"
                trendingMovies = repository.getCatalog("movie")
                featuredSeries = repository.getCatalog("series")
                actionMovies = repository.getCatalog("movie", "Action")
                animeList = repository.getCatalog("series", "Animation")
            }
        }

        // Load CyberFlix streaming platform catalogs & TMDb trending
        try {
            tmdbTrending = repository.getTmdbCatalog("tmdb.trending", targetType).filterNot { it.isExplicitContent() }
            netflixCatalog = repository.getStreamingPlatformCatalog("nfx", targetType).filterNot { it.isExplicitContent() }
            disneyCatalog = repository.getStreamingPlatformCatalog("dnp", targetType).filterNot { it.isExplicitContent() }
            hboCatalog = repository.getStreamingPlatformCatalog("hbm", targetType).filterNot { it.isExplicitContent() }
            primeCatalog = repository.getStreamingPlatformCatalog("amp", targetType).filterNot { it.isExplicitContent() }
            appleCatalog = repository.getStreamingPlatformCatalog("atp", targetType).filterNot { it.isExplicitContent() }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        trendingMovies = trendingMovies.filterNot { it.isExplicitContent() }
        actionMovies = actionMovies.filterNot { it.isExplicitContent() }
        featuredSeries = featuredSeries.filterNot { it.isExplicitContent() }
        animeList = animeList.filterNot { it.isExplicitContent() }

        isLoading = false
    }

    val billboardItems = when (category) {
        "series" -> featuredSeries.ifEmpty { tmdbTrending }
        "anime" -> animeList.ifEmpty { featuredSeries }
        else -> tmdbTrending.ifEmpty { trendingMovies }
    }.filterNot { it.isExplicitContent() }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(JoyBackground)
    ) {
        if (isLoading) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    CircularProgressIndicator(color = JoyTextPrimary)
                    Text(
                        text = "Curating Joywatch catalog...",
                        color = JoyTextMuted,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(top = 12.dp)
                    )
                }
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
            ) {
                // Dynamic Auto-Rotating Hero Billboard
                Billboard(
                    items = billboardItems,
                    onPlayClick = { onPlay(it, 1, 1) },
                    onDetailsClick = { selectedDetailItem = it }
                )

                // Dedicated Continue Watching Shelf (Top Priority!)
                if (continueWatchingItems.isNotEmpty()) {
                    val filteredContinue = when (category) {
                        "movie" -> continueWatchingItems.filter { it.type == "movie" }
                        "series" -> continueWatchingItems.filter { it.type == "series" }
                        else -> continueWatchingItems
                    }
                    if (filteredContinue.isNotEmpty()) {
                        ContinueWatchingShelf(
                            items = filteredContinue,
                            onPlayClick = { item ->
                                onPlay(
                                    MediaItem(
                                        id = item.id,
                                        name = item.name,
                                        type = item.type,
                                        year = item.year,
                                        poster = item.poster,
                                        background = item.background
                                    ),
                                    item.season,
                                    item.episode
                                )
                            },
                            onRemoveClick = { item ->
                                watchHistoryManager.remove(item.id)
                            }
                        )
                    }
                }

                // CineJoy-style "Browse by Provider" (Netflix, Prime Video, Disney+, Apple TV+, HBO Max, etc.)
                ProviderShelf(
                    onProviderClick = { provider ->
                        selectedProvider = provider
                    }
                )

                // CineJoy-style "Because you watched [Title]" recommendation shelf
                continueWatchingItems.firstOrNull()?.let { lastWatched ->
                    val recommendedItems = remember(lastWatched.id, category, tmdbTrending, netflixCatalog, trendingMovies, featuredSeries) {
                        when (lastWatched.type) {
                            "series" -> (featuredSeries + netflixCatalog).filter { it.id != lastWatched.id && !it.isExplicitContent() }.take(15)
                            else -> (tmdbTrending + trendingMovies).filter { it.id != lastWatched.id && !it.isExplicitContent() }.take(15)
                        }
                    }
                    if (recommendedItems.isNotEmpty()) {
                        MediaShelf(
                            title = "Because you watched ${lastWatched.name}",
                            items = recommendedItems,
                            onItemClick = { selectedDetailItem = it }
                        )
                    }
                }

                if (joyListItems.isNotEmpty() && category == "all") {
                    MediaShelf(
                        title = "Your JoyList",
                        items = joyListItems.filterNot { it.isExplicitContent() },
                        onItemClick = { selectedDetailItem = it }
                    )
                }

                if (tmdbTrending.isNotEmpty()) {
                    MediaShelf(
                        title = "Trending Today • TMDb",
                        items = tmdbTrending,
                        onItemClick = { selectedDetailItem = it }
                    )
                }

                if (netflixCatalog.isNotEmpty()) {
                    MediaShelf(
                        title = "Popular on Netflix",
                        items = netflixCatalog,
                        onItemClick = { selectedDetailItem = it }
                    )
                }

                if (trendingMovies.isNotEmpty()) {
                    MediaShelf(
                        title = "Top Box Office Movies",
                        items = trendingMovies,
                        onItemClick = { selectedDetailItem = it }
                    )
                }

                if (disneyCatalog.isNotEmpty()) {
                    MediaShelf(
                        title = "Trending on Disney+",
                        items = disneyCatalog,
                        onItemClick = { selectedDetailItem = it }
                    )
                }

                if (featuredSeries.isNotEmpty()) {
                    MediaShelf(
                        title = "Featured Series",
                        items = featuredSeries,
                        onItemClick = { selectedDetailItem = it }
                    )
                }

                if (hboCatalog.isNotEmpty()) {
                    MediaShelf(
                        title = "HBO Max Exclusives",
                        items = hboCatalog,
                        onItemClick = { selectedDetailItem = it }
                    )
                }

                if (primeCatalog.isNotEmpty()) {
                    MediaShelf(
                        title = "Amazon Prime Video",
                        items = primeCatalog,
                        onItemClick = { selectedDetailItem = it }
                    )
                }

                if (appleCatalog.isNotEmpty()) {
                    MediaShelf(
                        title = "Apple TV+ Originals",
                        items = appleCatalog,
                        onItemClick = { selectedDetailItem = it }
                    )
                }

                if (actionMovies.isNotEmpty()) {
                    MediaShelf(
                        title = "Action & Sci-Fi",
                        items = actionMovies,
                        onItemClick = { selectedDetailItem = it }
                    )
                }

                if (animeList.isNotEmpty()) {
                    MediaShelf(
                        title = "Popular Anime",
                        items = animeList,
                        onItemClick = { selectedDetailItem = it }
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))
            }
        }

        selectedProvider?.let { provider ->
            ProviderCatalogSheet(
                provider = provider,
                repository = repository,
                onItemClick = { item ->
                    selectedDetailItem = item
                },
                onDismiss = { selectedProvider = null }
            )
        }

        selectedDetailItem?.let { item ->
            DetailBottomSheet(
                item = item,
                repository = repository,
                joyListManager = joyListManager,
                watchHistoryManager = watchHistoryManager,
                onDismiss = { selectedDetailItem = null },
                onPlay = { media, s, e ->
                    selectedDetailItem = null
                    onPlay(media, s, e)
                }
            )
        }
    }
}
