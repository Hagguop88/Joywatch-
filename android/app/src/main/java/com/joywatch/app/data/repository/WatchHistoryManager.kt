package com.joywatch.app.data.repository

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.joywatch.app.data.model.ContinueWatchingItem
import com.joywatch.app.data.model.MediaItem
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class WatchHistoryManager(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences("joywatch_watch_history", Context.MODE_PRIVATE)
    private val gson = Gson()
    private val listType = object : TypeToken<List<ContinueWatchingItem>>() {}.type

    private val _continueWatching = MutableStateFlow<List<ContinueWatchingItem>>(loadList())
    val continueWatching: StateFlow<List<ContinueWatchingItem>> = _continueWatching.asStateFlow()

    private fun loadList(): List<ContinueWatchingItem> {
        val json = prefs.getString("continue_watching_list", null) ?: return emptyList()
        return try {
            gson.fromJson(json, listType) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    private fun persistList(list: List<ContinueWatchingItem>) {
        prefs.edit().putString("continue_watching_list", gson.toJson(list)).apply()
        _continueWatching.value = list
    }

    private fun matchesId(itemId: String, queryId: String): Boolean {
        if (itemId.isBlank() || queryId.isBlank()) return false
        if (itemId.equals(queryId, ignoreCase = true)) return true
        val clean1 = itemId.removePrefix("tmdb:").removePrefix("imdb:").removePrefix("movie:").removePrefix("series:")
        val clean2 = queryId.removePrefix("tmdb:").removePrefix("imdb:").removePrefix("movie:").removePrefix("series:")
        if (clean1.equals(clean2, ignoreCase = true)) return true
        if (clean1.equals(queryId, ignoreCase = true) || clean2.equals(itemId, ignoreCase = true)) return true
        return false
    }

    fun get(id: String): ContinueWatchingItem? {
        return _continueWatching.value.firstOrNull { matchesId(it.id, id) }
    }

    fun recordWatch(
        item: MediaItem,
        season: Int = 1,
        episode: Int = 1,
        episodeTitle: String? = null,
        positionSeconds: Long = 0,
        durationSeconds: Long = 0
    ) {
        val current = _continueWatching.value.toMutableList()
        val existing = current.firstOrNull { matchesId(it.id, item.id) }
        current.removeAll { matchesId(it.id, item.id) }
        val entry = ContinueWatchingItem(
            id = item.id,
            name = item.name,
            type = item.type,
            year = item.year,
            poster = item.poster ?: existing?.poster,
            background = item.background ?: existing?.background,
            season = season,
            episode = episode,
            episodeTitle = episodeTitle ?: existing?.episodeTitle,
            lastWatchedTimestamp = System.currentTimeMillis(),
            positionSeconds = if (positionSeconds > 0) {
                positionSeconds
            } else if (item.type == "series") {
                if (existing?.season == season && existing?.episode == episode) existing.positionSeconds else 0L
            } else {
                existing?.positionSeconds ?: 0L
            },
            durationSeconds = if (durationSeconds > 0) {
                durationSeconds
            } else if (item.type == "series") {
                if (existing?.season == season && existing?.episode == episode) existing.durationSeconds else 0L
            } else {
                existing?.durationSeconds ?: 0L
            }
        )
        current.add(0, entry)
        // Keep up to 25 titles
        val trimmed = if (current.size > 25) current.take(25) else current
        persistList(trimmed)
    }

    fun updateProgress(
        id: String,
        positionSec: Long,
        durationSec: Long,
        season: Int = 1,
        episode: Int = 1,
        name: String = "",
        type: String = "movie",
        poster: String? = null,
        background: String? = null
    ) {
        if (positionSec <= 0) return
        val current = _continueWatching.value.toMutableList()
        val index = current.indexOfFirst { matchesId(it.id, id) }
        if (index != -1) {
            val item = current.removeAt(index)
            val updated = item.copy(
                season = if (type == "series") season else item.season,
                episode = if (type == "series") episode else item.episode,
                positionSeconds = positionSec,
                durationSeconds = if (durationSec > 0) durationSec else item.durationSeconds,
                lastWatchedTimestamp = System.currentTimeMillis()
            )
            current.add(0, updated)
            persistList(current)
        } else {
            val entry = ContinueWatchingItem(
                id = id,
                name = name.ifEmpty { "Media" },
                type = type,
                year = "",
                poster = poster,
                background = background,
                season = season,
                episode = episode,
                episodeTitle = null,
                lastWatchedTimestamp = System.currentTimeMillis(),
                positionSeconds = positionSec,
                durationSeconds = durationSec
            )
            current.add(0, entry)
            val trimmed = if (current.size > 25) current.take(25) else current
            persistList(trimmed)
        }
    }

    fun remove(id: String) {
        val current = _continueWatching.value.toMutableList()
        current.removeAll { matchesId(it.id, id) }
        persistList(current)
    }

    fun clear() {
        persistList(emptyList())
    }
}
