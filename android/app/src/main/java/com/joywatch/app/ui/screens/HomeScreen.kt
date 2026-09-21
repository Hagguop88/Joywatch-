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
import com.joywatch.app.data.repository.JoyListManager
import com.joywatch.app.data.repository.JoywatchRepository
import com.joywatch.app.data.repository.WatchHistoryManager
import com.joywatch.app.ui.components.Billboard
import com.joywatch.app.ui.components.ContinueWatchingShelf
import com.joywatch.app.ui.components.DetailBottomSheet
import com.joywatch.app.ui.components.MediaShelf
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
    var isLoading by remember { mutableStateOf(true) }

    var selectedDetailItem by remember { mutableStateOf<MediaItem?>(null) }
    val joyListItems by joyListManager.joyList.collectAsState()
    val continueWatchingItems by watchHistoryManager.continueWatching.collectAsState()

    LaunchedEffect(category) {
        isLoading = true
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
        isLoading = false
    }

    val billboardItem = when (category) {
        "series" -> featuredSeries.firstOrNull()
        "anime" -> animeList.firstOrNull()
        else -> trendingMovies.firstOrNull()
    }

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
                Billboard(
                    item = billboardItem,
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

                if (joyListItems.isNotEmpty() && category == "all") {
                    MediaShelf(
                        title = "Your JoyList",
                        items = joyListItems,
                        onItemClick = { selectedDetailItem = it }
                    )
                }

                if (trendingMovies.isNotEmpty()) {
                    MediaShelf(
                        title = "Trending Today",
                        items = trendingMovies,
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
