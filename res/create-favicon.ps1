function CreatePNG([int]$DPI, [int]$Size) {
	& inkscape `
		--export-filename="$PSScriptRoot/favicon-$Size.png" `
		--export-type=png `
		--export-area-page `
		--export-dpi=$DPI `
		"$PSScriptRoot/logo.svg"
}

CreatePNG 48 16
CreatePNG 96 32

imconvert `
	"$PSScriptRoot/favicon-16.png" `
	"$PSScriptRoot/favicon-32.png" `
	"$PSScriptRoot/../src/favicon.ico"

rm "$PSScriptRoot/favicon-16.png"
rm "$PSScriptRoot/favicon-32.png"
