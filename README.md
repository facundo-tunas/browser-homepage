# Browser Homepage with Bookmark Manager

![ezgif-139037b51ebc7](https://github.com/user-attachments/assets/04541fb4-0d3e-4cac-88e9-ce2a319cf9eb)
<img width="1843" height="973" alt="ezgif com-animated-gif-maker" src="https://github.com/user-attachments/assets/684d9df5-355a-46da-a230-69407fd1807e" />


## Features

### 1. Bookmark Management

- Create and organize bookmark sets
- Drag-and-drop reordering of bookmarks and sets
- Color-coding for different bookmark categories
- Hide/show individual bookmarks or entire sets
- Add custom keywords to bookmarks for quick access
- Add dividers between bookmarks for better organization

### 2. Smart Search

- Real-time search through bookmarks and their keywords
- Custom search prefixes for quick access to different search engines
- Visual feedback for search matches
- Highlighted keyword matches
- Support for custom search prefix templates (e.g., `-yt: query` for Youtube search)

### 3. Additional Features (things I did when I got bored)

- Stopwatch (type "stopwatch" and press Enter to start)
- Coin flip animation (type "flip" and press Enter)
- Automatic Dark/Light Mode Switching
- Settings panel accessible via icon or ESC key
- Ability to choose between a selection of wallpapers and themes.

## Usage

### Bookmark Management

1. Click the settings icon to access bookmark management
2. Use "Add Bookmark" to create new bookmark sets
3. Add links to sets with optional keywords and dividers
4. Drag and drop to reorder bookmarks and sets
5. Use the eye icon to toggle visibility

### Search

1. Start typing to search through bookmarks
2. Use Enter to navigate to the selected bookmark
3. Add custom search prefixes in settings
4. Use Ctrl + Enter for direct Google search
5. Use keywords for quick access to specific bookmarks

## Keyboard Shortcuts

- `ESC`: Toggle settings panel
- `Enter`: Navigate to selected bookmark
- `Ctrl + Enter`: Google search
- `Ctrl + A`: Clear search input

## Installation

NOTE: There's multiple ways to set a browser homepage/new tab page. Initializing a server in the background should always work, but depending on the browser you might be able to directly point the URL to the index.html file under dist/.

- Requirements: Node.js

1. Clone the repo and run server.js.
    ```bash
    git clone https://github.com/your-username/this.git
    cd this
    node server.js
    ```
2. The homepage will be available at: http://localhost:9991.
    Set this URL as your browser’s homepage or startup page.

NOTES: 
- To avoid starting the server manually each time, set it up to launch on system startup (For example: use the Task Scheduler in Windows).
- If port 9991 is already in use, update the PORT constant in server.js.

