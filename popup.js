import { getActiveTabURL } from "./utils.js"

const addNewBookmark = (bookmarksElement, bookmark) => {
   const bookmarkTitleElement = document.createElement("div");
   const newBookmarkElement = document.createElement("div");
   const controlsElement = document.createElement("div");

   bookmarkTitleElement.textContent = bookmark.desc;
   bookmarkTitleElement.className = "bookmark-title";
   controlsElement.className = "bookmark-controls";

   setBookmarkAttributes("play", onPlay, controlsElement);
   setBookmarkAttributes("delete", onDelete, controlsElement);

   newBookmarkElement.id = "bookmark-" + bookmark.time;
   newBookmarkElement.className = "bookmark";
   newBookmarkElement.setAttribute("timestamp", bookmark.time);

   newBookmarkElement.appendChild(bookmarkTitleElement);
   newBookmarkElement.appendChild(controlsElement);
   bookmarksElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks=[]) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";

    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        }
    } else {
        bookmarksElement.innerHTML = '<i class="row">No bookmarks to show.</i>';
    }
};

const onPlay = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const activeTab = await getActiveTabURL();

    chrome.tabs.sendMessage(activeTab.id, {
        type: "PLAY",
        value: bookmarkTime,
    });
};

const onDelete = async e => {
    const activeTab = await getActiveTabURL();
    const bookmarktime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const bookmarkElementToDelete = document.getElementById(
        "bookmark-" + bookmarktime
    );

    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

    chrome.tabs.sendMessage(activeTab.id, {
        type: "DELETE",
        value: bookmarktime,
    }/*, viewBookmarks*/); // callback function
};

const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");

    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);
    controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async() => {
    const activeTab = await getActiveTabURL();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]): [];

            viewBookmarks(currentVideoBookmarks);
        });
    } else {
        const container = document.getElementsByClassName("container")[0];

        container.innerHTML = '<div class="title">This is not a YouTube video page.</div>';
    }
});
