@echo off
set FOLDER=%2
pushd %FOLDER%

set PREVIOUS=-1
for /l %%x in (1, 1, %3) DO (
	setlocal enableextensions enabledelayedexpansion
	set "fv=000000%%x.jpg"

	set /a "PREVIOUS = %%x - 1"

	set "prev=000000!PREVIOUS!"

	IF NOT EXIST %FOLDER%v-!fv:~-10! (
		copy /Y  %FOLDER%v-!prev:~-6!.jpg %FOLDER%v-!fv:~-10!
	)
	endlocal
)
ffmpeg -r %4 -start_number %1 -i v-%%06d.jpg -i myrecording.wav -c:v libx264 -pix_fmt yuv420p -b:a 192k out.mp4 && pushd %FOLDER% && del *.jpg *.wav

	
