package com.joywatch.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.joywatch.app.data.model.MediaItem
import com.joywatch.app.data.model.MetaDetails
import com.joywatch.app.data.repository.JoyListManager
import com.joywatch.app.data.repository.JoywatchRepository
import com.joywatch.app.ui.theme.JoyBackground
import com.joywatch.app.ui.theme.JoyBorder
import com.joywatch.app.ui.theme.JoyRatingAmber
import com.joywatch.app.ui.theme.JoySurface
import com.joywatch.app.ui.theme.JoySurfaceElevated
import com.joywatch.app.ui.theme.JoyTextMuted
import com.joywatch.app.ui.theme.JoyTextPrimary
import com.joywatch.app.ui.theme.JoyTextSecondary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetailBottomSheet(
    item: MediaItem,
    repository: JoywatchRepository,
    joyListManager: JoyListManager,
    onDismiss: () -> Unit,
    onPlay: (MediaItem, Int, Int) -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var details by remember { mutableStateOf<MetaDetails?>(null) }
    var isSaved by remember { mutableStateOf(joyListManager.isSaved(item.id)) }
    var selectedSeason by remember { mutableIntStateOf(1) }

    LaunchedEffect(item.id) {
        details = repository.getMeta(item.type, item.id)
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
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
        ) {
            // Hero Header
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(240.dp)
            ) {
                AsyncImage(
                    model = details?.background ?: item.background ?: item.poster,
                    contentDescription = item.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.matchParentSize()
                )

                // Dark Scrim
                Box(
                    modifier = Modifier
                        .matchParentSize()
                        .background(Color.Black.copy(alpha = 0.45f))
                )

                // Close Button
                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(12.dp)
                        .background(Color(0xCC090A0E), CircleShape)
                        .size(36.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Close",
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                }

                // Title Overlay
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(16.dp)
                ) {
                    Text(
                        text = item.name,
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            // Body Info
            Column(modifier = Modifier.padding(16.dp)) {
                // Meta info row
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .background(JoySurfaceElevated, CircleShape)
                            .padding(horizontal = 8.dp, vertical = 3.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = null,
                            tint = JoyRatingAmber,
                            modifier = Modifier.size(12.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "${details?.imdbRating ?: item.imdbRating} / 10",
                            color = Color.White,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Text(
                        text = details?.year ?: item.year,
                        color = JoyTextSecondary,
                        fontSize = 12.sp
                    )

                    Text(
                        text = "•",
                        color = JoyTextMuted,
                        fontSize = 12.sp
                    )

                    Text(
                        text = if (item.type == "series") "TV Series" else "Feature Film",
                        color = JoyTextSecondary,
                        fontSize = 12.sp
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Play & JoyList Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = { onPlay(item, selectedSeason, 1) },
                        shape = CircleShape,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color.White,
                            contentColor = Color.Black
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.PlayArrow,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Play",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    OutlinedButton(
                        onClick = {
                            isSaved = joyListManager.toggle(item)
                        },
                        shape = CircleShape,
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = if (isSaved) Color.White else JoyTextSecondary
                        ),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (isSaved) Color.White else JoyBorder
                        ),
                        modifier = Modifier.height(44.dp)
                    ) {
                        Icon(
                            imageVector = if (isSaved) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = if (isSaved) Color.White else JoyTextSecondary
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isSaved) "Saved" else "JoyList",
                            fontSize = 13.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Synopsis
                Text(
                    text = details?.description?.ifBlank { item.description }
                        ?: item.description.ifBlank { "No synopsis available." },
                    color = JoyTextSecondary,
                    fontSize = 13.sp,
                    lineHeight = 20.sp
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Genres
                val genres = details?.genres ?: item.genres
                if (genres.isNotEmpty()) {
                    Text(
                        text = "Genres: " + genres.joinToString(", "),
                        color = JoyTextMuted,
                        fontSize = 12.sp
                    )
                }

                // Series Season & Episode Picker
                if (item.type == "series" && details?.videos?.isNotEmpty() == true) {
                    val seasons = details?.videos?.map { it.season }?.distinct()?.sorted() ?: emptyList()
                    val episodesForSeason = details?.videos?.filter { it.season == selectedSeason }?.sortedBy { it.episode } ?: emptyList()

                    Spacer(modifier = Modifier.height(20.dp))
                    Text(
                        text = "Episodes",
                        color = JoyTextPrimary,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Season Selector Tabs
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(seasons) { s ->
                            val active = s == selectedSeason
                            Box(
                                modifier = Modifier
                                    .clip(CircleShape)
                                    .background(if (active) Color.White else JoySurfaceElevated)
                                    .border(1.dp, if (active) Color.White else JoyBorder, CircleShape)
                                    .clickable { selectedSeason = s }
                                    .padding(horizontal = 14.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    text = "Season $s",
                                    color = if (active) Color.Black else JoyTextSecondary,
                                    fontSize = 12.sp,
                                    fontWeight = if (active) FontWeight.Bold else FontWeight.Normal
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Episodes Horizontal List
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        items(episodesForSeason) { ep ->
                            Column(
                                modifier = Modifier
                                    .width(160.dp)
                                    .clickable { onPlay(item, ep.season, ep.episode) }
                            ) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .aspectRatio(16f / 9f)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(JoySurface)
                                        .border(1.dp, JoyBorder, RoundedCornerShape(8.dp))
                                ) {
                                    AsyncImage(
                                        model = ep.thumbnail ?: details?.background,
                                        contentDescription = ep.title,
                                        contentScale = ContentScale.Crop,
                                        modifier = Modifier.matchParentSize()
                                    )
                                    Box(
                                        modifier = Modifier
                                            .align(Alignment.Center)
                                            .size(28.dp)
                                            .background(Color(0xCC090A0E), CircleShape),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.PlayArrow,
                                            contentDescription = null,
                                            tint = Color.White,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(4.dp))

                                Text(
                                    text = "E${ep.episode} • ${ep.title}",
                                    color = JoyTextPrimary,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Medium,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
