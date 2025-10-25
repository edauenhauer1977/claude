#!/usr/bin/env python3
"""
Erstellt einfache PNG-Icons für die Chrome Extension
Benötigt: pip install pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Fehler: Pillow ist nicht installiert.")
    print("Installiere es mit: pip install pillow")
    exit(1)

def create_icon(size):
    """Erstellt ein Icon in der angegebenen Größe"""
    # Bild mit transparentem Hintergrund
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Kreis-Hintergrund (Blau)
    circle_color = (66, 133, 244, 255)  # #4285f4
    padding = int(size * 0.1)
    draw.ellipse([padding, padding, size-padding, size-padding], fill=circle_color)

    # Filter-Symbol (weißer Trichter)
    white = (255, 255, 255, 255)

    # Trichter zeichnen
    top_width = int(size * 0.6)
    top_x = (size - top_width) // 2
    top_y = int(size * 0.25)

    bottom_width = int(size * 0.3)
    bottom_x = (size - bottom_width) // 2
    bottom_y = int(size * 0.75)

    # Oberer Teil des Trichters
    points = [
        (top_x, top_y),
        (top_x + top_width, top_y),
        (bottom_x + bottom_width, bottom_y),
        (bottom_x, bottom_y)
    ]
    draw.polygon(points, fill=white)

    # Buchstabe "F" für Filter
    try:
        font_size = int(size * 0.4)
        # Versuche eine System-Font zu verwenden
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        # Fallback auf Default-Font
        font = ImageFont.load_default()

    text = "F"
    # Text zentrieren
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_x = (size - text_width) // 2
    text_y = (size - text_height) // 2 - int(size * 0.05)

    draw.text((text_x, text_y), text, fill=white, font=font)

    # Icon speichern
    filename = f"icon{size}.png"
    img.save(filename, 'PNG')
    print(f"✓ {filename} erstellt ({size}x{size})")

def main():
    """Erstellt Icons in allen benötigten Größen"""
    print("Erstelle Chrome Extension Icons...\n")

    sizes = [16, 48, 128]

    for size in sizes:
        create_icon(size)

    print("\n✓ Alle Icons wurden erfolgreich erstellt!")
    print("\nDie Extension ist jetzt bereit für die Installation in Chrome.")

if __name__ == "__main__":
    main()
