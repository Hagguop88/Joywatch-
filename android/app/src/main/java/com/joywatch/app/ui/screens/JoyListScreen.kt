package com.joywatch.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.joywatch.app.data.model.MediaItem
import com.joywatch.app.data.repository.JoyListManager
import com.joywatch.app.data.repository.JoywatchRepository
import com.joywatch.app.ui.components.DetailBottomSheet
import com.joywatch.app.ui.components.MediaCard
import com.joywatch.app.ui.theme.JoyBackground
import com.joywatch.app.ui.theme.JoyTextMuted
import com.joywatch.app.ui.theme.JoyTextPrimary
import com.joywatch.app.ui.theme.JoyTextSecondary

import com.joywatch.app.data.repository.WatchHistoryManager

@Composable
fun JoyListScreen(
    repository: JoywatchRepository,
    joyListManager: JoyListManager,
    watchHistoryManager: WatchHistoryManager,
    onPlay: (MediaItem, Int, Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val items by joyListManager.joyList.collectAsState()
    var selectedItem by remember { mutableStateOf<MediaItem?>(null) }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(JoyBackground)
            .padding(top = 16.dp)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                Text(
                    text = "Your JoyList",
                    color = JoyTextPrimary,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "${items.size} saved titles",
                    color = JoyTextMuted,
                    fontSize = 12.sp
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            if (items.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Your JoyList is empty.\nTap 'JoyList' on any title to save it.",
                        color = JoyTextSecondary,
                        fontSize = 13.sp,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(3),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(items, key = { it.id }) { item ->
                        MediaCard(
                            item = item,
                            onClick = { selectedItem = item },
                            cardWidth = 110.dp
                        )
                    }
                }
            }
        }

        selectedItem?.let { item ->
            DetailBottomSheet(
                item = item,
                repository = repository,
                joyListManager = joyListManager,
                watchHistoryManager = watchHistoryManager,
                onDismiss = { selectedItem = null },
                onPlay = { media, s, e ->
                    selectedItem = null
                    onPlay(media, s, e)
                }
            )
        }
    }
}
