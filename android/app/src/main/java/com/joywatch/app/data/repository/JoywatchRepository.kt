package com.joywatch.app.data.repository

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.joywatch.app.data.model.MediaItem
import com.joywatch.app.data.model.MetaDetails
import com.joywatch.app.data.model.StreamSource
import com.joywatch.app.data.model.VideoEpisode
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

class JoywatchRepository {

    private val gson = Gson()

    private suspend fun fetchJson(urlString: String): JsonObject? = withContext(Dispatchers.IO) {
        try {
            val url = URL(urlString)
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "GET"
            conn.connectTimeout = 8000
            conn.readTimeout = 8000
            conn.setRequestProperty("User-Agent", "Joywatch-Native/1.0")

            if (conn.responseCode == 200) {
                BufferedReader(InputStreamReader(conn.inputStream)).use { reader ->
                    gson.fromJson(reader, JsonObject::class.java)
                }
            } else {
                null
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    suspend fun getCatalog(type: String, genre: String? = null): List<MediaItem> = withContext(Dispatchers.IO) {
        val endpoint = if (!genre.isNullOrBlank()) {
            val encodedGenre = URLEncoder.encode(genre, "UTF-8")
            "https://v3-cinemeta.strem.io/catalog/$type/top/genre=$encodedGenre.json"
        } else {
            "https://v3-cinemeta.strem.io/catalog/$type/top.json"
        }

        val json = fetchJson(endpoint) ?: return@withContext emptyList()
        val metasArray = json.getAsJsonArray("metas") ?: return@withContext emptyList()

        metasArray.take(30).mapNotNull { element ->
            val obj = element.asJsonObject
            val id = obj.get("id")?.asString ?: return@mapNotNull null
            val name = obj.get("name")?.asString ?: return@mapNotNull null
            val year = obj.get("year")?.asString ?: obj.get("releaseInfo")?.asString ?: ""
            val poster = obj.get("poster")?.asString
            val background = obj.get("background")?.asString ?: poster
            val description = obj.get("description")?.asString ?: ""
            val imdbRating = obj.get("imdbRating")?.asString ?: "8.5"

            val genresList = mutableListOf<String>()
            obj.getAsJsonArray("genres")?.forEach { g ->
                genresList.add(g.asString)
            }

            MediaItem(
                id = id,
                name = name,
                type = type,
                year = year,
                poster = poster,
                background = background,
                description = description,
                genres = genresList,
                imdbRating = imdbRating
            )
        }
    }

    suspend fun getMeta(type: String, id: String): MetaDetails? = withContext(Dispatchers.IO) {
        val endpoint = "https://v3-cinemeta.strem.io/meta/$type/$id.json"
        val json = fetchJson(endpoint) ?: return@withContext null
        val metaObj = json.getAsJsonObject("meta") ?: return@withContext null

        val name = metaObj.get("name")?.asString ?: "Title"
        val year = metaObj.get("year")?.asString ?: metaObj.get("releaseInfo")?.asString ?: ""
        val poster = metaObj.get("poster")?.asString
        val background = metaObj.get("background")?.asString ?: poster
        val description = metaObj.get("description")?.asString ?: ""
        val imdbRating = metaObj.get("imdbRating")?.asString ?: "8.5"

        val genresList = mutableListOf<String>()
        metaObj.getAsJsonArray("genres")?.forEach { g ->
            genresList.add(g.asString)
        }

        val videosList = mutableListOf<VideoEpisode>()
        metaObj.getAsJsonArray("videos")?.forEach { v ->
            val vObj = v.asJsonObject
            val vId = vObj.get("id")?.asString ?: ""
            val vTitle = vObj.get("title")?.asString ?: "Episode"
            val vSeason = vObj.get("season")?.asInt ?: 1
            val vEpisode = vObj.get("episode")?.asInt ?: 1
            val vThumb = vObj.get("thumbnail")?.asString
            videosList.add(
                VideoEpisode(
                    id = vId,
                    title = vTitle,
                    season = vSeason,
                    episode = vEpisode,
                    thumbnail = vThumb
                )
            )
        }

        MetaDetails(
            id = id,
            name = name,
            type = type,
            year = year,
            poster = poster,
            background = background,
            description = description,
            genres = genresList,
            imdbRating = imdbRating,
            videos = videosList
        )
    }

    suspend fun search(query: String): List<MediaItem> = withContext(Dispatchers.IO) {
        if (query.isBlank()) return@withContext emptyList()
        val encoded = URLEncoder.encode(query, "UTF-8")
        val movieUrl = "https://v3-cinemeta.strem.io/catalog/movie/top/search=$encoded.json"
        val seriesUrl = "https://v3-cinemeta.strem.io/catalog/series/top/search=$encoded.json"

        val movieJson = fetchJson(movieUrl)
        val seriesJson = fetchJson(seriesUrl)

        val results = mutableListOf<MediaItem>()
        val seenIds = mutableSetOf<String>()

        fun parseArray(json: JsonObject?, fallbackType: String) {
            val array = json?.getAsJsonArray("metas") ?: return
            for (elem in array) {
                val obj = elem.asJsonObject
                val id = obj.get("id")?.asString ?: continue
                if (seenIds.contains(id)) continue
                seenIds.add(id)

                val name = obj.get("name")?.asString ?: continue
                val type = obj.get("type")?.asString ?: fallbackType
                val year = obj.get("year")?.asString ?: ""
                val poster = obj.get("poster")?.asString
                val background = obj.get("background")?.asString ?: poster
                val desc = obj.get("description")?.asString ?: ""
                val rating = obj.get("imdbRating")?.asString ?: "8.0"

                val genres = mutableListOf<String>()
                obj.getAsJsonArray("genres")?.forEach { g -> genres.add(g.asString) }

                results.add(
                    MediaItem(
                        id = id,
                        name = name,
                        type = type,
                        year = year,
                        poster = poster,
                        background = background,
                        description = desc,
                        genres = genres,
                        imdbRating = rating
                    )
                )
            }
        }

        parseArray(movieJson, "movie")
        parseArray(seriesJson, "series")
        results
    }

    fun getStreamSources(type: String, id: String, title: String, season: Int = 1, episode: Int = 1): List<StreamSource> {
        val cleanTitle = title.ifBlank { "Movie" }
        return if (type == "series") {
            listOf(
                StreamSource(
                    name = "VidLink Fast Cloud",
                    title = "Server 1 • VidLink 1080p Ultra HD (S$season:E$episode)",
                    quality = "1080p Ultra HD",
                    url = "https://vidlink.pro/tv/$id/$season/$episode"
                ),
                StreamSource(
                    name = "2Embed Multi-Server",
                    title = "Server 2 • 2Embed 1080p Full HD (S$season:E$episode)",
                    quality = "1080p Full HD",
                    url = "https://www.2embed.cc/embedtv/$id&s=$season&e=$episode"
                ),
                StreamSource(
                    name = "AutoEmbed Cloud",
                    title = "Server 3 • AutoEmbed High-Speed (S$season:E$episode)",
                    quality = "1080p HD",
                    url = "https://autoembed.co/tv/imdb/$id/$season/$episode"
                ),
                StreamSource(
                    name = "VidSrc Mirror",
                    title = "Server 4 • VidSrc Fast Mirror (S$season:E$episode)",
                    quality = "720p/1080p HD",
                    url = "https://vidsrc.pm/embed/tv/$id/$season/$episode"
                )
            )
        } else {
            listOf(
                StreamSource(
                    name = "VidLink Fast Cloud",
                    title = "Server 1 • $cleanTitle - 1080p Ultra HD",
                    quality = "1080p Ultra HD",
                    url = "https://vidlink.pro/movie/$id"
                ),
                StreamSource(
                    name = "2Embed Multi-Server",
                    title = "Server 2 • $cleanTitle - 1080p Full HD",
                    quality = "1080p Full HD",
                    url = "https://www.2embed.cc/embed/$id"
                ),
                StreamSource(
                    name = "AutoEmbed Cloud",
                    title = "Server 3 • $cleanTitle - 1080p High-Speed Stream",
                    quality = "1080p HD",
                    url = "https://autoembed.co/movie/imdb/$id"
                ),
                StreamSource(
                    name = "VidSrc Mirror",
                    title = "Server 4 • $cleanTitle - Fast HD Mirror",
                    quality = "720p/1080p HD",
                    url = "https://vidsrc.pm/embed/movie/$id"
                )
            )
        }
    }
}
