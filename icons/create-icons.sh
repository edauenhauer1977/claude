#!/bin/bash
# Script zum Erstellen von Placeholder-Icons mit ImageMagick

# Prüfe ob ImageMagick installiert ist
if ! command -v convert &> /dev/null; then
    echo "ImageMagick ist nicht installiert. Installiere es mit: sudo apt-get install imagemagick"
    exit 1
fi

# Erstelle Icons in verschiedenen Größen
for size in 16 48 128; do
    convert -size ${size}x${size} xc:none \
        -fill "#4285f4" \
        -draw "circle $((size/2)),$((size/2)) $((size/2)),0" \
        -fill white \
        -font Liberation-Sans-Bold \
        -pointsize $((size/2)) \
        -gravity center \
        -annotate +0+0 "F" \
        icon${size}.png
    echo "Icon ${size}x${size} erstellt"
done

echo "Alle Icons wurden erstellt!"
