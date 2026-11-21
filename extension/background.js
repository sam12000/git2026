// Un clic sur l'icône ouvre MyLife Planner dans un onglet (ou revient dessus).
chrome.action.onClicked.addListener(async () => {
  const url = chrome.runtime.getURL('index.html');
  const [tab] = await chrome.tabs.query({ url: url + '*' });
  if (tab) { await chrome.tabs.update(tab.id, { active: true }); await chrome.windows.update(tab.windowId, { focused: true }); }
  else await chrome.tabs.create({ url });
});
