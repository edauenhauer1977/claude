#!/usr/bin/env python3
"""
Erstellt sehr einfache monochrome PNG-Icons ohne externe Abhängigkeiten
Diese Icons sind Platzhalter und sollten später durch bessere ersetzt werden
"""

import struct
import zlib

def create_simple_png(size, color_r, color_g, color_b):
    """
    Erstellt ein einfaches einfarbiges PNG
    """
    # PNG Header
    png_header = b'\x89PNG\r\n\x1a\n'

    # IHDR Chunk (Bild-Informationen)
    width = size
    height = size
    bit_depth = 8
    color_type = 2  # RGB
    compression = 0
    filter_method = 0
    interlace = 0

    ihdr_data = struct.pack('>IIBBBBB', width, height, bit_depth, color_type,
                           compression, filter_method, interlace)
    ihdr_chunk = create_chunk(b'IHDR', ihdr_data)

    # IDAT Chunk (Bilddaten)
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # Filter type für diese Zeile
        for x in range(width):
            # Zeichne einen einfachen blauen Kreis
            dx = x - width / 2
            dy = y - height / 2
            distance = (dx * dx + dy * dy) ** 0.5

            if distance < width / 2 * 0.85:
                # Innerhalb des Kreises - Blau
                raw_data.extend([color_r, color_g, color_b])
            else:
                # Außerhalb - Weiß/Transparent (hier weiß)
                raw_data.extend([255, 255, 255])

    compressed_data = zlib.compress(bytes(raw_data), 9)
    idat_chunk = create_chunk(b'IDAT', compressed_data)

    # IEND Chunk (Ende)
    iend_chunk = create_chunk(b'IEND', b'')

    # PNG zusammensetzen
    png_data = png_header + ihdr_chunk + idat_chunk + iend_chunk

    return png_data

def create_chunk(chunk_type, data):
    """Erstellt einen PNG-Chunk mit CRC"""
    chunk_data = chunk_type + data
    crc = zlib.crc32(chunk_data) & 0xffffffff
    return struct.pack('>I', len(data)) + chunk_data + struct.pack('>I', crc)

def main():
    """Erstellt Icons in allen benötigten Größen"""
    print("Erstelle einfache PNG-Icons...\n")

    # Blau-Farbe (#4285f4)
    color_r, color_g, color_b = 66, 133, 244

    sizes = [16, 48, 128]

    for size in sizes:
        png_data = create_simple_png(size, color_r, color_g, color_b)

        filename = f"icon{size}.png"
        with open(filename, 'wb') as f:
            f.write(png_data)

        print(f"✓ {filename} erstellt ({size}x{size})")

    print("\n✓ Einfache Placeholder-Icons wurden erstellt!")
    print("\nHinweis: Diese sind einfache blaue Kreise.")
    print("Für bessere Icons kannst du:")
    print("  1. pip install pillow installieren und create-icons.py ausführen")
    print("  2. Die icons online auf favicon-generator.org erstellen")
    print("  3. Die icons mit einem Bildbearbeitungsprogramm aus icon.svg erstellen")

if __name__ == "__main__":
    main()
