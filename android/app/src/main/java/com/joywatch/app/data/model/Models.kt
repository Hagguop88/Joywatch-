package com.joywatch.app.data.model

data class MediaItem(
    val id: String,
    val name: String,
    val type: String = "movie", // "movie" or "series"
    val year: String = "",
    val poster: String? = null,
    val background: String? = null,
    val description: String = "",
    val genres: List<String> = emptyList(),
    val imdbRating: String = "8.5"
)

data class MetaDetails(
    val id: String,
    val name: String,
    val type: String = "movie",
    val year: String = "",
    val poster: String? = null,
    val background: String? = null,
    val description: String = "",
    val genres: List<String> = emptyList(),
    val imdbRating: String = "8.5",
    val videos: List<VideoEpisode> = emptyList()
)

data class VideoEpisode(
    val id: String,
    val title: String,
    val season: Int,
    val episode: Int,
    val thumbnail: String? = null
)

data class StreamSource(
    val name: String,
    val title: String,
    val quality: String,
    val url: String,
    val isDirectHls: Boolean = false
)
