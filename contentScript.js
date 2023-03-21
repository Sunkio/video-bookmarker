let youtubeLeftControls, youtubePlayer; // for accessing the Controls & the Player
let currentVideo = "";
let currentVideoBookmarks = [];

const fetchBookmarks = () => {
  return new Promise((resolve) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      resolve([]);
    } else {
      chrome.storage.sync.get([currentVideo], (obj) => {
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
      });
    }
  });
};

const addNewBookmarkEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
        time: currentTime,
        desc: "Bookmark at " + getTime(currentTime),
    };

    currentVideoBookmarks = await fetchBookmarks();

    chrome.storage.sync.set({
        [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
    });

    // Send a message to the background script to show the badge
    chrome.runtime.sendMessage({type: "SHOW_BADGE"});
};

const checkForPlayer = async () => {
    youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
    youtubePlayer = document.getElementsByClassName("video-stream")[0];

    if (youtubeLeftControls && youtubePlayer) {
        currentVideoBookmarks = await fetchBookmarks();
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

        if (!bookmarkBtnExists) {
          const bookmarkBtn = document.createElement("img");

          bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
          bookmarkBtn.className = "ytp-button " + "bookmark-btn";
          bookmarkBtn.title = "Click to bookmark current timestamp";

          youtubeLeftControls.appendChild(bookmarkBtn);
          bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);

          return true; // Bookmark button added
        } else {
          return false; // Bookmark button already exists
        }
    }

    return false; // Bookmark button not added
};

const addStyles = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    .bookmark-btn {
        width: 46px !important;
        height: 46px !important;
        min-width: 46px !important;
        min-height: 46px !important;
        max-width: 46px !important;
        max-height: 46px !important;
        object-fit: contain;
        margin-left: 8px;
        margin-right: 8px;
        z-index: 9999;
        padding: 0 !important;
        display: flex;
        justify-content: center;
        position: relative;
      }
      
    .ytp-chrome-controls {
      margin-right: -92px !important;
    }
  `;
  document.head.appendChild(style);
};

const init = async () => {
   addStyles();
   return checkForPlayer();
};

chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === "NEW") {
        currentVideo = videoId;
        response(await init());
    } else if (type === "PLAY") {
        youtubePlayer.currentTime = value;
    } else if (type === "DELETE") {
        const bookmarkTime = parseFloat(value);
        currentVideoBookmarks = currentVideoBookmarks.filter((b) => {
            return b.time !== bookmarkTime;
        });
        chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });
        response(currentVideoBookmarks);
    }
});

const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);

    return date.toISOString().substr(11, 8);
};