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

    fun get(id: String): ContinueWatchingItem? {
        return _continueWatching.value.firstOrNull { it.id == id }
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
        val existing = current.firstOrNull { it.id == item.id }
        current.removeAll { it.id == item.id }
        val entry = ContinueWatchingItem(
            id = item.id,
            name = item.name,
            type = item.type,
            year = item.year,
            poster = item.poster,
            background = item.background,
            season = season,
            episode = episode,
            episodeTitle = episodeTitle,
            lastWatchedTimestamp = System.currentTimeMillis(),
            positionSeconds = if (positionSeconds > 0) positionSeconds else (existing?.positionSeconds ?: 0),
            durationSeconds = if (durationSeconds > 0) durationSeconds else (existing?.durationSeconds ?: 0)
        )
        current.add(0, entry)
        // Keep up to 25 titles
        val trimmed = if (current.size > 25) current.take(25) else current
        persistList(trimmed)
    }

    fun updateProgress(id: String, positionSec: Long, durationSec: Long) {
        if (positionSec <= 0) return
        val current = _continueWatching.value.toMutableList()
        val index = current.indexOfFirst { it.id == id }
        if (index != -1) {
            val item = current[index]
            current[index] = item.copy(
                positionSeconds = positionSec,
                durationSeconds = if (durationSec > 0) durationSec else item.durationSeconds,
                lastWatchedTimestamp = System.currentTimeMillis()
            )
            persistList(current)
        }
    }

    fun remove(id: String) {
        val current = _continueWatching.value.toMutableList()
        current.removeAll { it.id == id }
        persistList(current)
    }

    fun clear() {
        persistList(emptyList())
    }
}
