# Create Joywatch Desktop Shortcut
$wshShell = New-Object -ComObject WScript.Shell
$desktopPath = [System.Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "Joywatch.lnk"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir
$hiddenVbs = Join-Path $scriptDir "start-hidden.vbs"

$shortcut = $wshShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "wscript.exe"
$shortcut.Arguments = "`"$hiddenVbs`""
$shortcut.WorkingDirectory = $rootDir
$shortcut.Description = "Launch Joywatch Cinema"
$shortcut.IconLocation = "$env:SystemRoot\System32\shell32.dll,220"
$shortcut.Save()

Write-Host "Created Joywatch shortcut on Desktop: $shortcutPath"
