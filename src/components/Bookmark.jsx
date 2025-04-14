import { useState } from 'react';
import './Bookmark.css'

const Bookmark = ({bookmarks, onPlayClicked, onDeleteClicked, onUpdateBookmark, onSaveBookmark}) => {
    const [bookmarkFocused, setBookmarkFocused] = useState("");
    const [bookmarkSelected, setBookmarkSelected] = useState("");

    const onSelectBookmark = (bookmarkTime) => {
        setBookmarkSelected(bookmarkTime);
        setBookmarkFocused("bookmark-focused");
    }
    const onBlurChanged = (e) => {
        setBookmarkSelected("");
        setBookmarkFocused(""); 
        onSaveBookmark();
    }
    const onEnterKeyPressed = (e) => {
        if(e.keyCode == 13) {
           e.target.blur();
        }
    }

    const bookmarksToShow = bookmarks.map(bookmark => 
        <div className={`bookmark ${bookmark.time == bookmarkSelected ? bookmarkFocused : ""}`} 
            key={bookmark.time}>
            <input 
                type='text' 
                className="bookmark-title" 
                maxLength={24}
                size={21}
                value={bookmark.desc}
                onClick={() => onSelectBookmark(bookmark.time)}
                onBlur={onBlurChanged} 
                onChange={e => onUpdateBookmark(e.target.value, bookmark.time)}
                onKeyDown={onEnterKeyPressed}/>
            <div className="bookmark-controls">
                <i className="fa fa-play-circle controlBtn blueIcon" onClick={event => onPlayClicked(bookmark.time)}></i>
                <i className="fa fa-trash controlBtn redIcon" onClick={event => onDeleteClicked(bookmark.time)}></i>
            </div>
        </div>
    )

    return (<div className="bookmarks">{bookmarksToShow}</div>)
}

export default Bookmark;