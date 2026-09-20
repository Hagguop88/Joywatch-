Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
ScriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
RootDir = fso.GetParentFolderName(ScriptDir)
WshShell.CurrentDirectory = RootDir

' Run server.py hidden (0 = hidden window)
WshShell.Run "python server.py", 0, False

' Wait 2 seconds and open browser
WScript.Sleep 2000
WshShell.Run "cmd /c start http://localhost:7700", 0, False
