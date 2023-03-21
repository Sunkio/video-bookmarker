import { getActiveTabURL } from "./utils.js";
import { getTime } from "./utils.js";

const addNewBookmark = (bookmarksElement, bookmark) => {
  const bookmarkTimestampElement = document.createElement("div");
  const bookmarkNoteElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");
  const controlsElement = document.createElement("div");

  bookmarkTimestampElement.textContent = getTime(bookmark.time);
  bookmarkTimestampElement.className = "bookmark-timestamp";
  bookmarkNoteElement.textContent = bookmark.desc;
  bookmarkNoteElement.className = "bookmark-note";
  controlsElement.className = "bookmark-controls";

  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("edit", onEdit, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  newBookmarkElement.id = "bookmark-" + bookmark.time;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);

  newBookmarkElement.appendChild(bookmarkTimestampElement);
  newBookmarkElement.appendChild(bookmarkNoteElement);
  newBookmarkElement.appendChild(controlsElement);
  bookmarksElement.appendChild(newBookmarkElement);
  

};

const viewBookmarks = (currentBookmarks = []) => {
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";

  // Add "Delete all" button if there are at least 2 bookmarks
  if (currentBookmarks.length >= 2) {
    const deleteAllButton = document.createElement("button");
    deleteAllButton.textContent = "Delete all";
    deleteAllButton.id = "delete-all";
    deleteAllButton.className = "delete-all-button";
    bookmarksElement.appendChild(deleteAllButton);

    // Add click event listener to the "Delete all" button
    deleteAllButton.addEventListener("click", onDeleteAll);
  }

  if (currentBookmarks.length > 0) {
    for (const bookmark of currentBookmarks) {
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

const onEdit = async e => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getActiveTabURL();
  const currentVideo = new URLSearchParams(activeTab.url.split("?")[1]).get("v");

  const note = prompt("Enter a short note for this bookmark:");

  if (note) {
    chrome.storage.sync.get([currentVideo], (data) => {
      let currentBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

      // Update the note for the corresponding bookmark
      for (let i = 0; i < currentBookmarks.length; i++) {
        if (currentBookmarks[i].time === parseFloat(bookmarkTime)) {
          currentBookmarks[i].desc = note;
          break;
        }
      }

      // Update the stored bookmarks with the new note
      chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentBookmarks) }, () => {
        console.log("Bookmark note updated.");
      });

      // Refresh the bookmarks view
      viewBookmarks(currentBookmarks);
    });
  }
};

const onDelete = async e => {
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);
  const currentVideo = urlParameters.get("v");
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const bookmarkElementToDelete = document.getElementById(
    "bookmark-" + bookmarkTime
  );

  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

  // Fetch the stored bookmarks
  chrome.storage.sync.get([currentVideo], (data) => {
    let currentBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

    // Filter out the deleted bookmark
    currentBookmarks = currentBookmarks.filter(bookmark => bookmark.time !== parseInt(bookmarkTime));

    // Update the stored bookmarks
    chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentBookmarks) }, () => {
      console.log("Bookmark deleted and storage updated.");
    });
  });

  chrome.tabs.sendMessage(activeTab.id, {
    type: "DELETE",
    value: bookmarkTime,
  });
};

const onDeleteAll = async () => {
  const activeTab = await getActiveTabURL();
  const currentVideo = new URLSearchParams(activeTab.url.split("?")[1]).get("v");

  // Clear all stored bookmarks for the current video
  chrome.storage.sync.set({ [currentVideo]: JSON.stringify([]) }, () => {
    console.log("All bookmarks deleted and storage updated.");
  });

  // Refresh the bookmarks view
  viewBookmarks([]);
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideo = urlParameters.get("v");

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML = '<div class="title">This is not a YouTube video page.</div>';
  }
});