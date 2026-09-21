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
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.joywatch.app.ui.theme.JoyGlassBorderSubtle
import com.joywatch.app.ui.theme.JoyTextMuted
import com.joywatch.app.ui.theme.JoyTextPrimary
import com.joywatch.app.ui.theme.JoyTextSecondary

data class StreamingProvider(
    val id: String,
    val name: String,
    val brandGradient: List<Color>,
    val accentColor: Color,
    val logoText: String,
    val catalogKey: String = "nfx"
)

val defaultStreamingProviders = listOf(
    StreamingProvider(
        id = "netflix",
        name = "Netflix",
        brandGradient = listOf(Color(0xFF141414), Color(0xFF000000)),
        accentColor = Color(0xFFE50914),
        logoText = "N",
        catalogKey = "nfx"
    ),
    StreamingProvider(
        id = "prime",
        name = "Amazon Prime Video",
        brandGradient = listOf(Color(0xFF001E36), Color(0xFF003058)),
        accentColor = Color(0xFF00A8E1),
        logoText = "prime\nvideo",
        catalogKey = "amp"
    ),
    StreamingProvider(
        id = "disney",
        name = "Disney Plus",
        brandGradient = listOf(Color(0xFF041838), Color(0xFF09295E)),
        accentColor = Color(0xFF1CD5C6),
        logoText = "Disney+",
        catalogKey = "dnp"
    ),
    StreamingProvider(
        id = "appletv",
        name = "Apple TV+",
        brandGradient = listOf(Color(0xFF1E1E22), Color(0xFF0F0F12)),
        accentColor = Color(0xFFFFFFFF),
        logoText = "tv+",
        catalogKey = "atp"
    ),
    StreamingProvider(
        id = "hbomax",
        name = "HBO Max",
        brandGradient = listOf(Color(0xFF1A0A30), Color(0xFF280F4A)),
        accentColor = Color(0xFF9D4EDD),
        logoText = "HBO\nmax",
        catalogKey = "hbm"
    ),
    StreamingProvider(
        id = "paramount",
        name = "Paramount Plus",
        brandGradient = listOf(Color(0xFF002255), Color(0xFF004499)),
        accentColor = Color(0xFF38BDF8),
        logoText = "Paramount+",
        catalogKey = "pmp"
    ),
    StreamingProvider(
        id = "hulu",
        name = "Hulu",
        brandGradient = listOf(Color(0xFF0B2118), Color(0xFF11382A)),
        accentColor = Color(0xFF1CE783),
        logoText = "hulu",
        catalogKey = "hlu"
    ),
    StreamingProvider(
        id = "peacock",
        name = "Peacock Premium",
        brandGradient = listOf(Color(0xFF161622), Color(0xFF222238)),
        accentColor = Color(0xFFFBBF24),
        logoText = "peacock",
        catalogKey = "pcp"
    ),
    StreamingProvider(
        id = "crunchyroll",
        name = "Crunchyroll",
        brandGradient = listOf(Color(0xFF331600), Color(0xFF552500)),
        accentColor = Color(0xFFFF640A),
        logoText = "CR",
        catalogKey = "cru"
    )
)

@Composable
fun ProviderShelf(
    onProviderClick: (StreamingProvider) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 14.dp)
    ) {
        // Shelf Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(
                    text = "Browse by Provider",
                    color = JoyTextPrimary,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = (-0.3).sp
                )
                Text(
                    text = "Stream catalog directly from your favorite services",
                    color = JoyTextMuted,
                    fontSize = 11.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Horizontal Carousel of Branded Glassmorphic Cards
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            items(defaultStreamingProviders, key = { it.id }) { provider ->
                ProviderCard(
                    provider = provider,
                    onClick = { onProviderClick(provider) }
                )
            }
        }
    }
}

@Composable
fun ProviderCard(
    provider: StreamingProvider,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .width(82.dp)
            .clickable { onClick() },
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Glassmorphic Rounded Square Icon
        Box(
            modifier = Modifier
                .size(76.dp)
                .clip(RoundedCornerShape(18.dp))
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            provider.brandGradient.first(),
                            provider.brandGradient.last()
                        )
                    )
                )
                .border(
                    width = 1.dp,
                    brush = Brush.linearGradient(
                        colors = listOf(
                            provider.accentColor.copy(alpha = 0.5f),
                            JoyGlassBorderSubtle
                        )
                    ),
                    shape = RoundedCornerShape(18.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            // Subtle Gloss Scrim
            Box(
                modifier = Modifier
                    .matchParentSize()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                Color.White.copy(alpha = 0.12f),
                                Color.Transparent
                            )
                        )
                    )
            )

            // Stylized Logo Text
            when (provider.id) {
                "netflix" -> {
                    Text(
                        text = "N",
                        color = Color(0xFFE50914),
                        fontSize = 38.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.SansSerif
                    )
                }
                "prime" -> {
                    Text(
                        text = "prime\nvideo",
                        color = Color.White,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center,
                        lineHeight = 15.sp
                    )
                }
                "disney" -> {
                    Text(
                        text = "Disney+",
                        color = Color.White,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                }
                "appletv" -> {
                    Text(
                        text = "tv+",
                        color = Color.White,
                        fontSize = 19.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                "hbomax" -> {
                    Text(
                        text = "max",
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Black
                    )
                }
                "hulu" -> {
                    Text(
                        text = "hulu",
                        color = Color(0xFF1CE783),
                        fontSize = 19.sp,
                        fontWeight = FontWeight.Black
                    )
                }
                "paramount" -> {
                    Text(
                        text = "Paramount+",
                        color = Color.White,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center
                    )
                }
                "crunchyroll" -> {
                    Text(
                        text = "CR",
                        color = Color(0xFFFF640A),
                        fontSize = 26.sp,
                        fontWeight = FontWeight.Black
                    )
                }
                else -> {
                    Text(
                        text = provider.logoText,
                        color = Color.White,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(7.dp))

        // Provider Name Label
        Text(
            text = provider.name,
            color = JoyTextSecondary,
            fontSize = 10.5.sp,
            fontWeight = FontWeight.Medium,
            textAlign = TextAlign.Center,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
            lineHeight = 13.sp
        )
    }
}
