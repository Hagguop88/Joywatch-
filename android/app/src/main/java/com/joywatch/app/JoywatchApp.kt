package com.joywatch.app

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
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
import androidx.compose.material3.Surface
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
import com.joywatch.app.data.repository.JoyListManager
import com.joywatch.app.data.repository.JoywatchRepository
import com.joywatch.app.ui.screens.HomeScreen
import com.joywatch.app.ui.screens.JoyListScreen
import com.joywatch.app.ui.screens.PlayerScreen
import com.joywatch.app.ui.screens.SearchScreen
import com.joywatch.app.ui.theme.JoyBackground
import com.joywatch.app.ui.theme.JoyBorder
import com.joywatch.app.ui.theme.JoySurfaceElevated
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

    // Fullscreen Streaming Player
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

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(JoyBackground)
    ) {
        // Header Bar (Small Joywatch Logo & Search Button)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Joywatch Logo
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

        // Screen Content (takes all remaining height so it scrolls independently without bottom bar interruption)
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
        ) {
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

        // Docked Bottom Navigation Bar (No chunky box or border, flush at the bottom)
        JoyBottomNavBar(
            activeTab = activeTab,
            joyListCount = joyListItems.size,
            onTabSelect = { activeTab = it }
        )
    }
}

@Composable
fun JoyBottomNavBar(
    activeTab: String,
    joyListCount: Int,
    onTabSelect: (String) -> Unit
) {
    Surface(
        color = Color(0xFF0C0D14),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .navigationBarsPadding()
        ) {
            // Subtle 1px top divider hairline
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(Color(0xFF171822))
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
                    .padding(horizontal = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                JoyNavItem(
                    label = "Discover",
                    icon = Icons.Default.PlayArrow,
                    isSelected = activeTab == "discover",
                    onClick = { onTabSelect("discover") },
                    modifier = Modifier.weight(1f)
                )
                JoyNavItem(
                    label = "Movies",
                    icon = Icons.Default.Movie,
                    isSelected = activeTab == "movies",
                    onClick = { onTabSelect("movies") },
                    modifier = Modifier.weight(1f)
                )
                JoyNavItem(
                    label = "Series",
                    icon = Icons.Default.Tv,
                    isSelected = activeTab == "series",
                    onClick = { onTabSelect("series") },
                    modifier = Modifier.weight(1f)
                )
                JoyNavItem(
                    label = "Anime",
                    icon = Icons.Default.LocalMovies,
                    isSelected = activeTab == "anime",
                    onClick = { onTabSelect("anime") },
                    modifier = Modifier.weight(1f)
                )
                JoyNavItem(
                    label = if (joyListCount > 0) "JoyList ($joyListCount)" else "JoyList",
                    icon = Icons.Default.Bookmark,
                    isSelected = activeTab == "joylist",
                    onClick = { onTabSelect("joylist") },
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
private fun JoyNavItem(
    label: String,
    icon: ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxHeight()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) { onClick() },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = if (isSelected) Color.White else Color(0xFF6B7280),
            modifier = Modifier.size(19.dp)
        )
        Spacer(modifier = Modifier.height(3.dp))
        Text(
            text = label,
            color = if (isSelected) Color.White else Color(0xFF6B7280),
            fontSize = 10.sp,
            fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
            maxLines = 1
        )
    }
}
