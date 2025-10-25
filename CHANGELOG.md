# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [1.1.1] - 2025-10-25

### Behoben
- Service Worker Fehler durch fehlende `contextMenus` Permission behoben
- Extension lädt jetzt ohne Fehler in Chrome

## [1.1.0] - 2025-10-25

### Hinzugefügt
- Spezielle Filterung für Bild.de und andere News-Seiten
- Smart Container-Erkennung für besseres Filtern von Artikeln
- Versionsanzeige im Extension-Popup
- CHANGELOG Datei für Versionshistorie

### Geändert
- Verbesserte generische Filterung priorisiert jetzt Container-Elemente
- CSP-sicherer Code: Verwendet jetzt nur CSS-Klassen statt direkter Style-Manipulation
- Robustere Filterung für dynamische Webseiten

### Behoben
- Content Security Policy (CSP) Probleme auf strikten Webseiten
- Filterung auf News-Seiten funktioniert jetzt zuverlässiger

## [1.0.0] - 2025-10-25

### Hinzugefügt
- Initiales Release der Content Bias Filter Extension
- Keyword-basierte Filterung von Webinhalten
- Spezialisierte Unterstützung für YouTube
- Spezialisierte Unterstützung für Google Suche
- Generische Filterung für alle Webseiten
- Popup-UI zur Keyword-Verwaltung
- Ein/Aus-Schalter für den Filter
- Statistiken über gefilterte Elemente
- Rechtsklick-Kontextmenü zum Hinzufügen von Keywords
- Chrome Sync für Keywords
- Echtzeit-Filterung bei dynamisch geladenen Inhalten
- Badge mit Anzahl der gefilterten Elemente
