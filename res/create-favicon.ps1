function CreatePNG([int]$DPI, [int]$Size, [bool]$Maskable) {
	& inkscape `
		--export-filename="$PSScriptRoot/../src/images/logo-$Size.png" `
		--export-type=png `
		--export-area-page `
		--export-dpi=$DPI `
		"$PSScriptRoot/logo.svg"
	if ($Maskable) {
		& inkscape `
			--export-filename="$PSScriptRoot/../src/images/logo-maskable-$Size.png" `
			--export-type=png `
			--export-area-page `
			--export-dpi=$DPI `
			"$PSScriptRoot/logo-maskable.svg"
		imconvert `
			"$PSScriptRoot/../src/images/logo-maskable-$Size.png" `
			-background white `
			-alpha remove `
			-alpha off `
			"$PSScriptRoot/../src/images/logo-maskable-$Size.png"
	}
}

CreatePNG 48 16
CreatePNG 96 32
CreatePNG 144 48 $True
CreatePNG 288 96 $True
CreatePNG 432 144 $True
CreatePNG 576 192 $True
CreatePNG 1152 384 $True

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
