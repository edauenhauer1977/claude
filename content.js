// Content Script für das Filtern von Webinhalten

let keywords = [];
let filterEnabled = true;
let blockedCount = 0;
let observer = null;

// Initialisierung
(async function init() {
  await loadSettings();
  startFiltering();
  observePageChanges();
})();

// Einstellungen laden
async function loadSettings() {
  const data = await chrome.storage.sync.get(['keywords', 'filterEnabled']);
  keywords = data.keywords || [];
  filterEnabled = data.filterEnabled !== false;
}

// Nachricht vom Popup empfangen
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateFilter') {
    loadSettings().then(() => {
      filterPage();
    });
  }
});

// Hauptfunktion: Seite filtern
function filterPage() {
  if (!filterEnabled || keywords.length === 0) {
    restoreAllElements();
    return;
  }

  // YouTube spezifisch
  if (window.location.hostname.includes('youtube.com')) {
    filterYouTube();
  }

  // Google Suche
  if (window.location.hostname.includes('google.com')) {
    filterGoogleSearch();
  }

  // Bild.de und andere News-Seiten
  if (window.location.hostname.includes('bild.de')) {
    filterBildDe();
  }

  // Generische Filterung für andere Seiten
  filterGeneric();

  updateBlockedCount();
}

// YouTube Filterung
function filterYouTube() {
  // Video-Thumbnails in Suchergebnissen, Empfehlungen, etc.
  const selectors = [
    'ytd-video-renderer',           // Suchergebnisse
    'ytd-grid-video-renderer',      // Grid-Ansicht
    'ytd-compact-video-renderer',   // Sidebar-Empfehlungen
    'ytd-rich-item-renderer',       // Homepage
    'ytd-playlist-video-renderer'   // Playlists
  ];

  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (shouldBlockElement(element)) {
        hideElement(element);
      } else {
        showElement(element);
      }
    });
  });
}

// Google Suche Filterung
function filterGoogleSearch() {
  const searchResults = document.querySelectorAll('.g, .MjjYud');
  searchResults.forEach(result => {
    if (shouldBlockElement(result)) {
      hideElement(result);
    } else {
      showElement(result);
    }
  });
}

// Bild.de Filterung
function filterBildDe() {
  // Bild.de verwendet verschiedene Container für Artikel
  const selectors = [
    'article',                          // Standard-Artikel
    '[data-id]',                        // Artikel mit data-id
    '.teaser',                          // Teaser-Elemente
    '.story',                           // Story-Container
    '.brick',                           // Brick-Layout
    '[class*="article"]',               // Alle Klassen mit "article"
    '[class*="teaser"]',                // Alle Klassen mit "teaser"
    'a[href*="/"]'                      // Links zu Artikeln
  ];

  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      // Prüfe das Element und seine direkten Kinder
      if (shouldBlockElement(element)) {
        // Finde den äußersten relevanten Container
        const container = findArticleContainer(element);
        hideElement(container);
      } else {
        showElement(element);
      }
    });
  });
}

// Finde den übergeordneten Artikel-Container
function findArticleContainer(element) {
  let current = element;
  let candidate = element;

  // Gehe bis zu 5 Ebenen nach oben
  for (let i = 0; i < 5 && current.parentElement; i++) {
    current = current.parentElement;

    // Prüfe ob dieser Container ein Artikel-Container ist
    const tagName = current.tagName.toLowerCase();
    const className = current.className.toLowerCase();

    if (tagName === 'article' ||
        className.includes('teaser') ||
        className.includes('article') ||
        className.includes('story') ||
        className.includes('brick') ||
        className.includes('item') ||
        className.includes('card') ||
        current.hasAttribute('data-id')) {
      candidate = current;
    }

    // Stoppe bei Body oder Main
    if (tagName === 'body' || tagName === 'main' || tagName === 'section') {
      break;
    }
  }

  return candidate;
}

// Generische Filterung für alle Seiten
function filterGeneric() {
  // Priorisiere Container-Elemente über einzelne Text-Elemente
  const containerSelectors = [
    'article',
    '[role="article"]',
    '.post',
    '.item',
    '.card',
    '.entry',
    '.content-item',
    '[class*="article"]',
    '[class*="post"]',
    '[class*="item"]',
    '[class*="card"]',
    '[class*="teaser"]',
    '[class*="story"]'
  ];

  // Filtere Container
  containerSelectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (shouldBlockElement(element)) {
          hideElement(element);
        } else {
          showElement(element);
        }
      });
    } catch (e) {
      // Ignoriere ungültige Selektoren
    }
  });

  // Filtere auch einzelne Links (weniger aggressiv)
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    // Nur größere Links filtern (wahrscheinlich Artikel-Links)
    if (link.textContent.length > 20 && shouldBlockElement(link)) {
      const container = findArticleContainer(link);
      hideElement(container);
    }
  });
}

// Prüfen, ob ein Element geblockt werden soll
function shouldBlockElement(element) {
  const text = element.textContent.toLowerCase();

  return keywords.some(keyword => {
    return text.includes(keyword.toLowerCase());
  });
}

// Element ausblenden
function hideElement(element) {
  if (!element.hasAttribute('data-bias-filter-hidden')) {
    element.setAttribute('data-bias-filter-hidden', 'true');
    element.style.setProperty('display', 'none', 'important');
    element.classList.add('bias-filter-hidden');
    blockedCount++;
  }
}

// Element einblenden
function showElement(element) {
  if (element.hasAttribute('data-bias-filter-hidden')) {
    element.removeAttribute('data-bias-filter-hidden');
    element.style.removeProperty('display');
    element.classList.remove('bias-filter-hidden');
  }
}

// Alle Elemente wiederherstellen
function restoreAllElements() {
  const hiddenElements = document.querySelectorAll('[data-bias-filter-hidden]');
  hiddenElements.forEach(element => {
    showElement(element);
  });
  blockedCount = 0;
  updateBlockedCount();
}

// Seite auf Änderungen überwachen (für dynamisch geladene Inhalte)
function observePageChanges() {
  // Bestehenden Observer stoppen
  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver((mutations) => {
    // Debounce: Nur alle 500ms filtern
    clearTimeout(observer.timeout);
    observer.timeout = setTimeout(() => {
      filterPage();
    }, 500);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Filterung starten
function startFiltering() {
  filterPage();

  // Bei URL-Änderungen neu filtern (für SPAs wie YouTube)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(() => {
        filterPage();
      }, 1000);
    }
  }).observe(document, { subtree: true, childList: true });
}

// Statistik aktualisieren
function updateBlockedCount() {
  chrome.storage.local.set({ blockedElements: blockedCount });
}

// Bei Seitenwechsel Zähler zurücksetzen
window.addEventListener('beforeunload', () => {
  blockedCount = 0;
  updateBlockedCount();
});

// Storage-Änderungen überwachen
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && (changes.keywords || changes.filterEnabled)) {
    loadSettings().then(() => {
      filterPage();
    });
  }
});
