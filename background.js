
// A helper function to handle the initialization
const initContentScript = (tabId, url) => {
  const videoId = new URLSearchParams(new URL(url).search).get("v");
  if (videoId) {
    chrome.tabs.sendMessage(tabId, { type: "NEW", videoId });
  }
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.includes("youtube.com/watch")) {
    initContentScript(tabId, tab.url);
  }
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.url.includes("youtube.com/watch")) {
    initContentScript(details.tabId, details.url);
  }
});

const showBadge = () => {
  chrome.action.setBadgeText({ text: "\u2713" });
  chrome.action.setBadgeBackgroundColor({ color: "#32bea6" });

  setTimeout(() => {
    chrome.action.setBadgeText({ text: "" });
  }, 1500);
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHOW_BADGE") {
    showBadge();
  }
});