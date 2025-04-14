# Youtube Bookmarker Extension

Youtube Bookmarker is a Chrome extension, build with ReactJs and vanilla Javascript, that allows users to save and manage timestamps in Youtube Videos.
<p align="center">
  <img src="https://github.com/user-attachments/assets/a94cabd2-dc7f-4749-8d34-6c48bda2b37f" width="300" height="300" hspace="20">
  <img src="https://github.com/user-attachments/assets/b6a3ae11-0f2a-4a1c-a8b6-cc66e2230e6d" width="300" height="300">
</p>

## Features
- **Save bookmarks**
- **Edit and delete bookmarks**
- **Navigate to saved timestamp**
- **Change theme of the popup window**

## How to setup
1. Download the project of fork and clone the repository. `git clone https://github.com/<your username>/youtube-bookmark-extension.git`
2. Run the following commands for creating a build file (Node js is required)
   ```
     cd <project_directory>
     npm install
     npm run build
   ```
3. Open Google Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" in the top-right corner.
5. Click "Load unpacked extension" and choose the build folder created in the project's directory.
   
## Usage
1. Open a YouTube video page.
2. A bookmark shapped button will appear under the youtube video timeline. Click the icon and a bookmark will be created!
3. Now you can manage all the video's bookmarks by clicking the extension icon at your chrome toolbar.
4. Edit the description of your bookmarks by clicking inside.
5. Navigate to specific timestamps, and delete bookmarks with the control buttons.
