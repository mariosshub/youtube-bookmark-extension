let youtubeRightControls, youtubePlayer;
let currentVideo = "";
let currentVideoBookmarks = [];

window.onload = function() {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId, updatedBookmarks} = obj;

        switch (type){
            case "NEW":
                currentVideo = videoId;
                newVideoLoaded();
                break;
            case "UPDATE":
                chrome.storage.sync.set({
                    [currentVideo]: JSON.stringify(updatedBookmarks)
                });
                break;
            case "PLAY":
                youtubePlayer.currentTime = value;
                break;
            case "DELETE":
                currentVideoBookmarks = currentVideoBookmarks.filter(b => b.time != value);
                chrome.storage.sync.set({
                    [currentVideo]: JSON.stringify(currentVideoBookmarks)
                });
                break;
        }
    });
    newVideoLoaded();
}

const newVideoLoaded = async() => {
    const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

    currentVideoBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {
        const bookmarkBtn = document.createElement("img");

        bookmarkBtn.src = chrome.runtime.getURL("bookmark-icon.png");
        bookmarkBtn.className = "ytp-button " + "bookmark-btn";
        bookmarkBtn.title = "Click to bookmark current timestamp";

        youtubeRightControls = document.getElementsByClassName("ytp-right-controls")[0];
        youtubePlayer = document.getElementsByClassName("video-stream")[0];
        
        youtubeRightControls.prepend(bookmarkBtn);
        bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        console.log("Bookmark button painted");
    }
}

const fetchBookmarks = () => {
    return new Promise(resolve => {
        chrome.storage.sync.get([currentVideo], (obj) => {
            resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
        })
    })
}

const addNewBookmarkEventHandler = async() => {
    let newBookmark;
    const currentTime = youtubePlayer.currentTime;

    // check if youtube video has chapters and add it as description
    let title = document.getElementsByClassName("ytp-chapter-title-content")[0].innerHTML;
    if(title == '') {
        newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };

    }
    else{
        newBookmark = {
            time: currentTime,
            desc: title
        }
    }

    // get the current bookmarks
    currentVideoBookmarks = await fetchBookmarks();

    chrome.storage.sync.set({
        [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
    }).then(() => {
        alert("Timestamp saved!");
    });
}

const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);

    return date.toISOString().split('T')[1].substring(8,0)
}
