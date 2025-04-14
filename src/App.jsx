import { useEffect, useState } from "react";
import "./App.css";
import "./styles.css";
import {getCurrentTab, getTime, isEmpty, logRuntimeConnectionError} from "./utils";
import Bookmark from "./components/Bookmark";
import SideNavMenu from "./components/SidenavMenu";

function App() {
    const [isYoutubePage, setIsYoutubePage] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [syncWithStorage, setSyncWithStorage] = useState(false);
    const [navWidth, setNavWidth] = useState("0%");
   
    useEffect(async () => {
        let activeTab = await getCurrentTab();
        const queryParams = activeTab.url.split("?")[1];
        const urlParams = new URLSearchParams(queryParams);
        const currentVideo = urlParams.get("v");

        // check if active tab is a youtube page
        if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
            // get bookmarks for this current video from storage
            chrome.storage.sync.get([currentVideo], (data) => {
                const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
                setIsYoutubePage(true);
                setBookmarks(currentVideoBookmarks);
            });
        } else setIsYoutubePage(false);
    }, []);

    useEffect(() => {
        if(syncWithStorage){
            console.log('Updating bookmarks..');
            getCurrentTab().then(activeTab => {
                chrome.tabs.sendMessage(activeTab.id, {
                    type: "UPDATE",
                    updatedBookmarks: bookmarks,
                }, () => {
                    logRuntimeConnectionError(chrome.runtime.lastError.message)
                });
            })
            setSyncWithStorage(false);
        }
    },[bookmarks, syncWithStorage]);

    const playHandler = async (timestamp) => {
        const activeTab = await getCurrentTab();
        chrome.tabs.sendMessage(activeTab.id, {
            type: "PLAY",
            value: timestamp,
        }, () => {
            logRuntimeConnectionError(chrome.runtime.lastError.message);
        });
    };

    const deleteHandler = async (timestamp) => {
        const activeTab = await getCurrentTab();
        chrome.tabs
        .sendMessage(activeTab.id, {
            type: "DELETE",
            value: timestamp,
        }, () => {
            if (logRuntimeConnectionError(chrome.runtime.lastError.message))
                return;

            console.log("deleted bookmark " + timestamp);
            setBookmarks((prevBookmarks) =>
            prevBookmarks.filter((bkmark) => bkmark.time !== timestamp));
        })
    };

    const updateBookmarkDesc = async (bookmarkDesc, timestamp) => {
        setBookmarks(prevBookmarks => 
            prevBookmarks.map(bookmark => {
                return bookmark.time === timestamp 
                ? {...bookmark, desc:bookmarkDesc} 
                : bookmark
            })
        )
    }

    const saveBookmarkToStorage = () => {
        bookmarks.map(bookmarkToCheck => {
            // check if description is empty set default again
            if(isEmpty(bookmarkToCheck.desc)){
                setBookmarks(prevBookmarks => 
                    prevBookmarks.map(bookmark => {
                        return bookmark.time === bookmarkToCheck.time 
                        ? {...bookmark, desc:"Bookmark at " + getTime(bookmark.time)} 
                        : bookmark
                    })
                )
            }
        })
        setSyncWithStorage(true);
    }

    const title = isYoutubePage ? "Your youtube bookmarks" : "Visit a youtube page!";
    return (
        <>
            <SideNavMenu navWidth={navWidth} setNavWidth={setNavWidth}/>
            <div className="container">
            <i className="navBtn fa fa-bars" onClick={() => setNavWidth("100%")}></i>
            <div className="title">{title}</div>
            {bookmarks.length == 0 && isYoutubePage ? <i>No bookmarks found..</i> : 
                <Bookmark
                bookmarks={bookmarks}
                onPlayClicked={playHandler}
                onDeleteClicked={deleteHandler}
                onUpdateBookmark={updateBookmarkDesc}
                onSaveBookmark={saveBookmarkToStorage}
                />
            }
            </div>
        </>
    );
}

export default App;
