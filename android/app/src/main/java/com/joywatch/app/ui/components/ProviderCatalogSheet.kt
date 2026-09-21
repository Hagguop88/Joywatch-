package com.joywatch.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.grid.rememberLazyGridState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.joywatch.app.data.model.MediaItem
import com.joywatch.app.data.model.isExplicitContent
import com.joywatch.app.data.repository.JoywatchRepository
import com.joywatch.app.ui.theme.JoyBackground
import com.joywatch.app.ui.theme.JoyBorder
import com.joywatch.app.ui.theme.JoyGlassBorderSubtle
import com.joywatch.app.ui.theme.JoyGlassSurface
import com.joywatch.app.ui.theme.JoySurfaceElevated
import com.joywatch.app.ui.theme.JoyTextMuted
import com.joywatch.app.ui.theme.JoyTextPrimary
import com.joywatch.app.ui.theme.JoyTextSecondary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProviderCatalogSheet(
    provider: StreamingProvider,
    repository: JoywatchRepository,
    onItemClick: (MediaItem) -> Unit,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var selectedTab by remember { mutableStateOf("series") } // default to shows as user noted
    var catalogItems by remember { mutableStateOf<List<MediaItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var isPaginationLoading by remember { mutableStateOf(false) }
    var canLoadMore by remember { mutableStateOf(true) }
    val gridState = rememberLazyGridState()

    LaunchedEffect(provider.catalogKey, selectedTab) {
        isLoading = true
        canLoadMore = true
        val initial = repository.getStreamingPlatformCatalog(provider.catalogKey, selectedTab, skip = 0)
            .filterNot { it.isExplicitContent() }
        catalogItems = initial
        isLoading = false
    }

    val shouldLoadMore by remember {
        derivedStateOf {
            val totalItems = gridState.layoutInfo.totalItemsCount
            val lastVisibleItem = gridState.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
            totalItems > 0 && lastVisibleItem >= totalItems - 9
        }
    }

    LaunchedEffect(shouldLoadMore, isPaginationLoading, canLoadMore) {
        if (shouldLoadMore && !isPaginationLoading && !isLoading && canLoadMore && catalogItems.isNotEmpty()) {
            isPaginationLoading = true
            try {
                val nextBatch = repository.getStreamingPlatformCatalog(
                    provider.catalogKey,
                    selectedTab,
                    skip = catalogItems.size
                ).filterNot { it.isExplicitContent() }

                if (nextBatch.isEmpty()) {
                    canLoadMore = false
                } else {
                    val existingIds = catalogItems.map { it.id }.toSet()
                    val uniqueNew = nextBatch.filter { it.id !in existingIds }
                    if (uniqueNew.isEmpty()) {
                        canLoadMore = false
                    } else {
                        catalogItems = catalogItems + uniqueNew
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                isPaginationLoading = false
            }
        }
    }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = JoyBackground,
        dragHandle = null,
        modifier = Modifier.fillMaxHeight(0.92f)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(JoyBackground)
        ) {
            // Branded Glassmorphism Header Bar
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                provider.brandGradient.first().copy(alpha = 0.8f),
                                JoyBackground
                            )
                        )
                    )
                    .border(1.dp, JoyGlassBorderSubtle)
                    .padding(horizontal = 16.dp, vertical = 14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        // Provider Pill Icon
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(provider.brandGradient.first())
                                .border(1.dp, provider.accentColor.copy(alpha = 0.4f), RoundedCornerShape(10.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = provider.logoText.take(6),
                                color = provider.accentColor,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Column {
                            Text(
                                text = "${provider.name} Catalog",
                                color = JoyTextPrimary,
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = if (isLoading) {
                                    "Loading streaming library..."
                                } else if (isPaginationLoading) {
                                    "Loading more... (${catalogItems.size} loaded)"
                                } else {
                                    "${catalogItems.size} titles available to stream"
                                },
                                color = JoyTextMuted,
                                fontSize = 11.sp
                            )
                        }
                    }

                    // Close Button
                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier
                            .size(36.dp)
                            .background(JoySurfaceElevated, CircleShape)
                            .border(1.dp, JoyBorder, CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = JoyTextPrimary,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            // Tabs Switcher (TV Shows vs Movies)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(JoyGlassSurface)
                    .border(1.dp, JoyGlassBorderSubtle, RoundedCornerShape(14.dp))
                    .padding(4.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                listOf(
                    "series" to "TV Shows",
                    "movie" to "Movies"
                ).forEach { (tabKey, label) ->
                    val isSelected = selectedTab == tabKey
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                if (isSelected) provider.brandGradient.first().copy(alpha = 0.9f)
                                else Color.Transparent
                            )
                            .border(
                                width = if (isSelected) 1.dp else 0.dp,
                                color = if (isSelected) provider.accentColor.copy(alpha = 0.5f) else Color.Transparent,
                                RoundedCornerShape(12.dp)
                            )
                            .clickable { selectedTab = tabKey }
                            .padding(vertical = 10.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = label,
                            color = if (isSelected) Color.White else JoyTextSecondary,
                            fontSize = 13.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                        )
                    }
                }
            }

            // Content Grid
            if (isLoading) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(
                        color = provider.accentColor,
                        modifier = Modifier.size(40.dp)
                    )
                }
            } else if (catalogItems.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No titles found for ${provider.name}",
                        color = JoyTextMuted,
                        fontSize = 13.sp
                    )
                }
            } else {
                LazyVerticalGrid(
                    state = gridState,
                    columns = GridCells.Fixed(3),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    items(catalogItems, key = { it.id }) { item ->
                        MediaCard(
                            item = item,
                            onClick = { onItemClick(item) },
                            modifier = Modifier.fillMaxWidth(),
                            cardWidth = null
                        )
                    }

                    if (isPaginationLoading) {
                        item(span = { GridItemSpan(3) }) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 16.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                CircularProgressIndicator(
                                    color = provider.accentColor,
                                    modifier = Modifier.size(28.dp),
                                    strokeWidth = 2.5.dp
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
