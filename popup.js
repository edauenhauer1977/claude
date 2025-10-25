// DOM Elemente
const keywordInput = document.getElementById('keywordInput');
const addKeywordBtn = document.getElementById('addKeyword');
const keywordsList = document.getElementById('keywordsList');
const clearAllBtn = document.getElementById('clearAll');
const toggleFilterBtn = document.getElementById('toggleFilter');
const filterCount = document.getElementById('filterCount');
const blockedCount = document.getElementById('blockedCount');
const versionElement = document.getElementById('version');

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
  loadKeywords();
  loadStats();
  loadFilterState();
  loadVersion();
});

// Keyword hinzufügen
addKeywordBtn.addEventListener('click', addKeyword);
keywordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addKeyword();
  }
});

async function addKeyword() {
  const keyword = keywordInput.value.trim().toLowerCase();

  if (!keyword) {
    return;
  }

  const { keywords = [] } = await chrome.storage.sync.get(['keywords']);

  if (keywords.includes(keyword)) {
    showNotification('Keyword existiert bereits!');
    return;
  }

  keywords.push(keyword);
  await chrome.storage.sync.set({ keywords });

  keywordInput.value = '';
  loadKeywords();
  notifyContentScripts();
  showNotification('Keyword hinzugefügt!');
}

async function removeKeyword(keyword) {
  const { keywords = [] } = await chrome.storage.sync.get(['keywords']);
  const updatedKeywords = keywords.filter(k => k !== keyword);
  await chrome.storage.sync.set({ keywords: updatedKeywords });

  loadKeywords();
  notifyContentScripts();
  showNotification('Keyword entfernt!');
}

async function loadKeywords() {
  const { keywords = [] } = await chrome.storage.sync.get(['keywords']);

  filterCount.textContent = `${keywords.length} Keywords aktiv`;

  if (keywords.length === 0) {
    keywordsList.innerHTML = '<p class="no-keywords">Keine Keywords hinzugefügt</p>';
    return;
  }

  keywordsList.innerHTML = keywords
    .map(keyword => `
      <div class="keyword-item">
        <span class="keyword-text">${escapeHtml(keyword)}</span>
        <button class="remove-btn" data-keyword="${escapeHtml(keyword)}">×</button>
      </div>
    `)
    .join('');

  // Event Listener für Remove-Buttons
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const keyword = e.target.dataset.keyword;
      removeKeyword(keyword);
    });
  });
}

// Alle Keywords löschen
clearAllBtn.addEventListener('click', async () => {
  if (confirm('Möchtest du wirklich alle Keywords löschen?')) {
    await chrome.storage.sync.set({ keywords: [] });
    loadKeywords();
    notifyContentScripts();
    showNotification('Alle Keywords gelöscht!');
  }
});

// Filter aktivieren/deaktivieren
toggleFilterBtn.addEventListener('click', async () => {
  const { filterEnabled = true } = await chrome.storage.sync.get(['filterEnabled']);
  const newState = !filterEnabled;

  await chrome.storage.sync.set({ filterEnabled: newState });
  updateToggleButton(newState);
  notifyContentScripts();
});

async function loadFilterState() {
  const { filterEnabled = true } = await chrome.storage.sync.get(['filterEnabled']);
  updateToggleButton(filterEnabled);
}

function updateToggleButton(enabled) {
  if (enabled) {
    toggleFilterBtn.textContent = 'Filter aktiviert';
    toggleFilterBtn.classList.remove('disabled');
  } else {
    toggleFilterBtn.textContent = 'Filter deaktiviert';
    toggleFilterBtn.classList.add('disabled');
  }
}

// Statistiken laden
async function loadStats() {
  const { blockedElements = 0 } = await chrome.storage.local.get(['blockedElements']);
  blockedCount.textContent = `${blockedElements} Elemente ausgeblendet`;
}

// Content Scripts benachrichtigen
function notifyContentScripts() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { action: 'updateFilter' }).catch(() => {
        // Ignoriere Fehler für Tabs ohne Content Script
      });
    });
  });
}

// Hilfsfunktionen
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message) {
  // Einfache visuelle Bestätigung
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Version aus Manifest laden
function loadVersion() {
  const manifest = chrome.runtime.getManifest();
  versionElement.textContent = manifest.version;
}

// Statistiken regelmäßig aktualisieren
setInterval(loadStats, 1000);
