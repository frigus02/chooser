function CreatePNG([int]$DPI, [int]$Size) {
	& inkscape `
		--export-filename="$PSScriptRoot/../src/images/logo-$Size.png" `
		--export-type=png `
		--export-area-page `
		--export-dpi=$DPI `
		"$PSScriptRoot/logo.svg"
}

CreatePNG 48 16
CreatePNG 96 32
CreatePNG 144 48
CreatePNG 216 72
CreatePNG 288 96
CreatePNG 432 144
CreatePNG 504 168
CreatePNG 576 192

imconvert `
	"$PSScriptRoot/../src/images/logo-16.png" `
	"$PSScriptRoot/../src/images/logo-32.png" `
	"$PSScriptRoot/../src/favicon.ico"

imconvert `
	"$PSScriptRoot/../src/images/logo-192.png" `
	-background white `
	-alpha remove `
	-alpha off `
	"$PSScriptRoot/../src/images/logo-192-opaque.png"
