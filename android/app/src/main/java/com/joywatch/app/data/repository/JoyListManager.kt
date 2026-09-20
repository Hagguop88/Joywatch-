package com.joywatch.app.data.repository

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.joywatch.app.data.model.MediaItem
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class JoyListManager(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences("joywatch_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()
    private val listType = object : TypeToken<List<MediaItem>>() {}.type

    private val _joyList = MutableStateFlow<List<MediaItem>>(loadList())
    val joyList: StateFlow<List<MediaItem>> = _joyList.asStateFlow()

    private fun loadList(): List<MediaItem> {
        val json = prefs.getString("joy_list", null) ?: return emptyList()
        return try {
            gson.fromJson(json, listType) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    private fun persistList(list: List<MediaItem>) {
        prefs.edit().putString("joy_list", gson.toJson(list)).apply()
        _joyList.value = list
    }

    fun isSaved(id: String): Boolean {
        return _joyList.value.any { it.id == id }
    }

    fun toggle(item: MediaItem): Boolean {
        val current = _joyList.value.toMutableList()
        val existsIndex = current.indexOfFirst { it.id == item.id }
        val nowSaved = if (existsIndex >= 0) {
            current.removeAt(existsIndex)
            false
        } else {
            current.add(0, item)
            true
        }
        persistList(current)
        return nowSaved
    }
}
