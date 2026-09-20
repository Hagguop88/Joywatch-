package com.joywatch.app

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.LocalMovies
import androidx.compose.material.icons.filled.Movie
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Tv
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.joywatch.app.data.model.MediaItem
import com.joywatch.app.data.repository.JoyListManager
import com.joywatch.app.data.repository.JoywatchRepository
import com.joywatch.app.ui.screens.HomeScreen
import com.joywatch.app.ui.screens.JoyListScreen
import com.joywatch.app.ui.screens.PlayerScreen
import com.joywatch.app.ui.screens.SearchScreen
import com.joywatch.app.ui.theme.JoyBackground
import com.joywatch.app.ui.theme.JoyBorder
import com.joywatch.app.ui.theme.JoySurfaceElevated
import com.joywatch.app.ui.theme.JoyTextMuted
import com.joywatch.app.ui.theme.JoyTextPrimary
import com.joywatch.app.ui.theme.JoyTextSecondary

data class ActivePlayerParams(
    val type: String,
    val id: String,
    val title: String,
    val season: Int = 1,
    val episode: Int = 1
)

@Composable
fun JoywatchApp(
    repository: JoywatchRepository,
    joyListManager: JoyListManager
) {
    var activeTab by remember { mutableStateOf("discover") } // "discover", "movies", "series", "anime", "search", "joylist"
    var activePlayer by remember { mutableStateOf<ActivePlayerParams?>(null) }
    val joyListItems by joyListManager.joyList.collectAsState()

    // If video player is active, render fullscreen ExoPlayer surface
    activePlayer?.let { params ->
        PlayerScreen(
            type = params.type,
            id = params.id,
            title = params.title,
            season = params.season,
            episode = params.episode,
            repository = repository,
            onClose = { activePlayer = null }
        )
        return
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(JoyBackground)
    ) {
        // Main Screen View
        Column(modifier = Modifier.fillMaxSize()) {
            // Header Bar (Small Joywatch Logo & Compact Navigation)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .statusBarsPadding()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Joywatch Logo (Small icon & Small refined text)
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.clickable { activeTab = "discover" }
                ) {
                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .background(Color(0xFF1E202B), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.PlayArrow,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(12.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    Text(
                        text = "Joywatch",
                        color = JoyTextPrimary,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = (-0.3).sp
                    )
                }

                // Search Icon Button
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(JoySurfaceElevated)
                        .border(1.dp, JoyBorder, CircleShape)
                        .clickable { activeTab = "search" },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = JoyTextSecondary,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            // Screen Content
            Box(modifier = Modifier.weight(1f)) {
                when (activeTab) {
                    "discover" -> HomeScreen(
                        category = "all",
                        repository = repository,
                        joyListManager = joyListManager,
                        onPlay = { item, s, e ->
                            activePlayer = ActivePlayerParams(item.type, item.id, item.name, s, e)
                        }
                    )
                    "movies" -> HomeScreen(
                        category = "movie",
                        repository = repository,
                        joyListManager = joyListManager,
                        onPlay = { item, s, e ->
                            activePlayer = ActivePlayerParams(item.type, item.id, item.name, s, e)
                        }
                    )
                    "series" -> HomeScreen(
                        category = "series",
                        repository = repository,
                        joyListManager = joyListManager,
                        onPlay = { item, s, e ->
                            activePlayer = ActivePlayerParams(item.type, item.id, item.name, s, e)
                        }
                    )
                    "anime" -> HomeScreen(
                        category = "anime",
                        repository = repository,
                        joyListManager = joyListManager,
                        onPlay = { item, s, e ->
                            activePlayer = ActivePlayerParams(item.type, item.id, item.name, s, e)
                        }
                    )
                    "search" -> SearchScreen(
                        repository = repository,
                        joyListManager = joyListManager,
                        onPlay = { item, s, e ->
                            activePlayer = ActivePlayerParams(item.type, item.id, item.name, s, e)
                        }
                    )
                    "joylist" -> JoyListScreen(
                        repository = repository,
                        joyListManager = joyListManager,
                        onPlay = { item, s, e ->
                            activePlayer = ActivePlayerParams(item.type, item.id, item.name, s, e)
                        }
                    )
                }
            }
        }

        // Floating Minimalist Bottom Navigation Bar
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .navigationBarsPadding()
                .padding(bottom = 12.dp)
        ) {
            Row(
                modifier = Modifier
                    .clip(CircleShape)
                    .background(Color(0xF012131A))
                    .border(1.dp, JoyBorder, CircleShape)
                    .padding(horizontal = 8.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                NavPillItem(
                    label = "Discover",
                    icon = Icons.Default.PlayArrow,
                    isSelected = activeTab == "discover",
                    onClick = { activeTab = "discover" }
                )
                NavPillItem(
                    label = "Movies",
                    icon = Icons.Default.Movie,
                    isSelected = activeTab == "movies",
                    onClick = { activeTab = "movies" }
                )
                NavPillItem(
                    label = "Series",
                    icon = Icons.Default.Tv,
                    isSelected = activeTab == "series",
                    onClick = { activeTab = "series" }
                )
                NavPillItem(
                    label = "Anime",
                    icon = Icons.Default.LocalMovies,
                    isSelected = activeTab == "anime",
                    onClick = { activeTab = "anime" }
                )
                NavPillItem(
                    label = if (joyListItems.isNotEmpty()) "JoyList (${joyListItems.size})" else "JoyList",
                    icon = Icons.Default.Bookmark,
                    isSelected = activeTab == "joylist",
                    onClick = { activeTab = "joylist" }
                )
            }
        }
    }
}

@Composable
private fun NavPillItem(
    label: String,
    icon: ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(CircleShape)
            .background(if (isSelected) Color.White else Color.Transparent)
            .clickable { onClick() }
            .padding(horizontal = 12.dp, vertical = 8.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (isSelected) Color.Black else JoyTextMuted,
                modifier = Modifier.size(13.dp)
            )
            Text(
                text = label,
                color = if (isSelected) Color.Black else JoyTextSecondary,
                fontSize = 11.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
            )
        }
    }
}
