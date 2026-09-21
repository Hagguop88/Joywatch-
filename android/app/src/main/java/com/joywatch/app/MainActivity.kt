package com.joywatch.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.joywatch.app.data.repository.JoyListManager
import com.joywatch.app.data.repository.JoywatchRepository
import com.joywatch.app.data.repository.WatchHistoryManager
import com.joywatch.app.ui.theme.JoywatchTheme

class MainActivity : ComponentActivity() {

    private val repository by lazy { JoywatchRepository() }
    private val joyListManager by lazy { JoyListManager(applicationContext) }
    private val watchHistoryManager by lazy { WatchHistoryManager(applicationContext) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            JoywatchTheme {
                JoywatchApp(
                    repository = repository,
                    joyListManager = joyListManager,
                    watchHistoryManager = watchHistoryManager
                )
            }
        }
    }
}
