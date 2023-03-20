// event listener: find the most recent tab (= active tab) we're on and see if it's a YouTube page
chrome.tabs.onUpdated.addListener((tabId, tab) => {
    /*
    Check for "youtube.com/watch" because that's what each video url starts with :)
     */
    if (tab.url && tab.url.includes("youtube.com/watch")) {
        const queryParameters = tab.url.split("?") [1]; // we're creating a unique ID by  grabbing the value after the "?"
        const urlParameters = new URLSearchParams(queryParameters);
        console.log(urlParameters);

        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId: urlParameters.get("v"), // this gets us the value after the = right after the v => then we have our unique identifier
        });
    }
});

chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
  if (details.url.includes("youtube.com/watch")) {
    const tabId = details.tabId;
    chrome.tabs.sendMessage(tabId, { type: "NEW", videoId: new URLSearchParams(new URL(details.url).search).get("v") });
  }
});