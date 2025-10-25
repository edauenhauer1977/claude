// Background Service Worker

// Initialisierung bei Installation
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Standardwerte setzen
    await chrome.storage.sync.set({
      keywords: [],
      filterEnabled: true
    });

    await chrome.storage.local.set({
      blockedElements: 0
    });

    // Willkommensseite öffnen (optional)
    console.log('Content Bias Filter installiert!');
  }

  if (details.reason === 'update') {
    console.log('Content Bias Filter aktualisiert!');
  }
});

// Badge aktualisieren basierend auf blockierten Elementen
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.blockedElements) {
    updateBadge(changes.blockedElements.newValue || 0);
  }

  if (area === 'sync' && changes.filterEnabled) {
    updateIcon(changes.filterEnabled.newValue);
  }
});

// Badge Text aktualisieren
function updateBadge(count) {
  if (count > 0) {
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#FF5722' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

// Icon basierend auf Filter-Status aktualisieren
function updateIcon(enabled) {
  // Hier könntest du verschiedene Icons für enabled/disabled verwenden
  // Für jetzt nur die Badge-Farbe ändern
  if (!enabled) {
    chrome.action.setBadgeBackgroundColor({ color: '#9E9E9E' });
  } else {
    chrome.action.setBadgeBackgroundColor({ color: '#FF5722' });
  }
}

// Nachrichten von Content Scripts oder Popup verarbeiten
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSettings') {
    chrome.storage.sync.get(['keywords', 'filterEnabled'], (data) => {
      sendResponse(data);
    });
    return true; // Async response
  }
});

// Tab-Update überwachen
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Badge für diesen Tab zurücksetzen wenn Seite neu lädt
    chrome.storage.local.set({ blockedElements: 0 });
  }
});

// Kontext-Menü hinzufügen (optional)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'addToFilter',
    title: 'Als Filter-Keyword hinzufügen',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'addToFilter' && info.selectionText) {
    const keyword = info.selectionText.trim().toLowerCase();

    if (keyword) {
      const { keywords = [] } = await chrome.storage.sync.get(['keywords']);

      if (!keywords.includes(keyword)) {
        keywords.push(keyword);
        await chrome.storage.sync.set({ keywords });

        // Content Script benachrichtigen
        chrome.tabs.sendMessage(tab.id, { action: 'updateFilter' }).catch(() => {});

        console.log(`Keyword "${keyword}" hinzugefügt`);
      }
    }
  }
});
