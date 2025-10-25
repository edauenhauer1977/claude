# Content Bias Filter - Chrome Extension

Eine Chrome Browser Extension zum Filtern und Ausblenden von Webinhalten basierend auf Keywords, um Bias zu reduzieren.

## Beschreibung

Diese Extension ermöglicht es dir, unerwünschte Inhalte auf Webseiten automatisch auszublenden, indem du Keywords definierst. Besonders nützlich für:

- **YouTube**: Filtert Videos in Suchergebnissen, Empfehlungen und auf der Startseite
- **Google Suche**: Blendet Suchergebnisse aus
- **Alle Webseiten**: Generische Filterung von Inhalten basierend auf Text

### Beispiel-Anwendungsfall

Du suchst auf YouTube nach "AI" und möchtest keine Videos zum Thema "Ukraine Krieg" sehen? Füge einfach "ukraine krieg" als Keyword hinzu, und alle Videos mit diesem Begriff werden automatisch ausgeblendet.

## Features

- ✅ Keyword-basierte Filterung von Webinhalten
- ✅ Spezialisierte Unterstützung für YouTube und Google
- ✅ Generische Filterung für alle Webseiten
- ✅ Echtzeit-Filterung bei dynamisch nachgeladenen Inhalten
- ✅ Ein/Aus-Schalter für den Filter
- ✅ Statistiken über ausgeblendete Elemente
- ✅ Rechtsklick-Kontextmenü zum schnellen Hinzufügen von Keywords
- ✅ Synchronisierung der Keywords über Chrome Sync

## Installation

### Icons erstellen

Die Extension benötigt Icons in drei Größen. Du kannst diese auf verschiedene Weisen erstellen:

**Option 1: Mit ImageMagick (empfohlen)**
```bash
cd icons
chmod +x create-icons.sh
./create-icons.sh
```

**Option 2: Online Icon Generator**
- Nutze ein Online-Tool wie https://www.favicon-generator.org/
- Lade die SVG-Datei `icons/icon.svg` hoch
- Generiere PNG-Dateien in den Größen 16x16, 48x48 und 128x128
- Speichere sie als `icon16.png`, `icon48.png`, `icon128.png` im `icons/` Ordner

**Option 3: Manuell mit Bildbearbeitungsprogramm**
- Öffne `icons/icon.svg` in GIMP, Inkscape oder einem anderen Programm
- Exportiere als PNG in den Größen 16x16, 48x48 und 128x128
- Benenne die Dateien entsprechend

### Extension in Chrome laden

1. Öffne Chrome und gehe zu `chrome://extensions/`
2. Aktiviere den "Entwicklermodus" (Toggle oben rechts)
3. Klicke auf "Entpackte Extension laden"
4. Wähle den Ordner aus, in dem sich diese Extension befindet
5. Die Extension ist nun installiert und einsatzbereit!

## Verwendung

### Keywords hinzufügen

1. Klicke auf das Extension-Icon in der Chrome-Toolbar
2. Gib ein Keyword in das Eingabefeld ein (z.B. "ukraine krieg")
3. Klicke auf "Hinzufügen" oder drücke Enter
4. Das Keyword wird gespeichert und sofort aktiv

**Tipp**: Keywords sind nicht case-sensitive (Groß-/Kleinschreibung wird ignoriert)

### Keywords verwalten

- **Löschen**: Klicke auf das "×" neben einem Keyword
- **Alle löschen**: Klicke auf "Alle löschen" (mit Bestätigung)
- **Filter deaktivieren**: Klicke auf "Filter aktiviert" um temporär zu deaktivieren

### Kontextmenü nutzen

Du kannst Text auf jeder Webseite markieren, Rechtsklick machen und "Als Filter-Keyword hinzufügen" auswählen, um schnell Keywords hinzuzufügen.

### Statistiken

Die Extension zeigt dir:
- Anzahl der aktiven Keywords
- Anzahl der ausgeblendeten Elemente auf der aktuellen Seite

## Unterstützte Webseiten

### Optimiert für:
- **YouTube**: Videos, Empfehlungen, Suchergebnisse, Playlists
- **Google Suche**: Suchergebnisse

### Funktioniert auch auf:
- Allen anderen Webseiten (generische Textfilterung)
- News-Seiten
- Social Media
- Blogs und Foren

## Technische Details

### Dateien

- `manifest.json` - Extension-Konfiguration
- `popup.html` / `popup.js` / `popup.css` - Benutzeroberfläche
- `content.js` / `content.css` - Inhaltsskript für Webseiten
- `background.js` - Service Worker für Hintergrundaufgaben
- `icons/` - Extension-Icons

### Berechtigungen

- `storage` - Zum Speichern von Keywords und Einstellungen
- `activeTab` - Zum Zugriff auf die aktuelle Webseite
- `host_permissions` - Zum Filtern von Inhalten auf allen Webseiten

### Datenspeicherung

- Keywords werden in `chrome.storage.sync` gespeichert (synchronisiert über Chrome-Profile)
- Statistiken werden in `chrome.storage.local` gespeichert (lokal pro Gerät)

## Entwicklung

### Struktur

```
content-bias-filter/
├── manifest.json
├── popup.html
├── popup.js
├── popup.css
├── content.js
├── content.css
├── background.js
├── icons/
│   ├── icon.svg
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Debugging

1. Öffne `chrome://extensions/`
2. Klicke auf "Details" bei der Extension
3. Bei Problemen mit:
   - **Popup**: Rechtsklick auf Extension-Icon → "Popup untersuchen"
   - **Content Script**: F12 auf der Webseite → Console
   - **Background**: Auf "Service Worker" klicken

### Anpassungen

**Neue Webseiten hinzufügen**:
Bearbeite `content.js` und füge eine neue Funktion hinzu wie `filterYouTube()` mit spezifischen Selektoren für die Webseite.

**Styling anpassen**:
Bearbeite `popup.css` für die Extension-UI oder `content.css` für gefilterte Elemente.

## Tipps & Best Practices

1. **Spezifische Keywords**: Verwende möglichst spezifische Keywords, um Über-Filterung zu vermeiden
2. **Mehrere Keywords**: Kombiniere verschiedene Schreibweisen (z.B. "AI", "KI", "künstliche Intelligenz")
3. **Regelmäßig überprüfen**: Überprüfe deine Keyword-Liste regelmäßig und entferne veraltete Einträge
4. **Filter testen**: Aktiviere/deaktiviere den Filter, um zu sehen, was ausgeblendet wird

## Bekannte Einschränkungen

- Die Extension kann nur Inhalte filtern, die als Text vorliegen (keine Bild- oder Video-Erkennung)
- Bei sehr dynamischen Webseiten kann es zu kurzen Verzögerungen kommen
- Einige Webseiten verwenden Techniken, die die Filterung erschweren

## Fehlerbehebung

**Problem**: Extension lädt nicht
- Lösung: Stelle sicher, dass alle Icon-Dateien vorhanden sind

**Problem**: Keine Inhalte werden gefiltert
- Lösung: Überprüfe ob der Filter aktiviert ist (grüner Button)
- Lösung: Lade die Webseite neu nach dem Hinzufügen von Keywords

**Problem**: Zu viel wird gefiltert
- Lösung: Verwende spezifischere Keywords
- Lösung: Entferne zu allgemeine Begriffe

## Lizenz

Diese Extension wurde für persönliche und private Zwecke erstellt. Du darfst sie frei verwenden, modifizieren und weitergeben.

## Support

Bei Fragen oder Problemen:
1. Überprüfe dieses README
2. Schaue in die Browser-Konsole für Fehlermeldungen
3. Deaktiviere/reaktiviere die Extension

## Roadmap / Mögliche Erweiterungen

- [ ] Import/Export von Keyword-Listen
- [ ] Whitelist-Funktion
- [ ] Reguläre Ausdrücke für erweiterte Filterung
- [ ] Benutzerdefinierte Filter-Regeln pro Webseite
- [ ] Dark Mode für Popup
- [ ] Keyboard-Shortcuts

---

**Entwickelt mit Claude Code** 🤖
