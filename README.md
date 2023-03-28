# YT Bookmarker

YT Bookmarker is a Chrome extension that enhances the experience of watching YouTube videos by allowing users to create and manage bookmarks with custom notes at specific timestamps in YouTube videos.

![YT Bookmarker - No Screenshots](./img/yt-bookmarker_3.png)
*No Screenshots*

![YT Bookmarker - With Screenshots](./img/yt-bookmarker_1.png)
*With Screenshots*

![YT Bookmarker - Edit Screenshots](./img/yt-bookmarker_2.png)
*Edit Screenshots*


## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Understanding the Code](#understanding-the-code)
- [Resources](#resources)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

1. Create bookmarks with notes
2. View and manage saved bookmarks
3. Easy navigation to specific timestamps
4. Edit existing bookmarks
5. Delete bookmarks

## Getting Started
Follow these steps to set up MovieWhiz on your local machine.

## Prerequisites

- Google Chrome Browser

## Installation
1. [Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and then clone this repository:

```
git clone https://github.com/<your username>/video-bookmarker.git
```
2. Open Google Chrome.
3. Go to `chrome://extensions/`.
4. Enable "Developer mode" in the top-right corner.
5. Click "Load unpacked extension" and choose the folder where you saved the cloned repository.

The extension should now appear in your Chrome toolbar.

## Usage

1. Open a YouTube video.
2. Click on the YT Bookmarker icon below the video to create a bookmark. 
3. Click on the YT Bookmarker icon in your Chrome toolbar to access your saved bookmarks.
4. Add & edit notes for your bookmarks, navigate to specific timestamps, and delete single or all bookmarks.

## Understanding the Code

In this section, the main logic of the extension in the `popup.js` script is explained.

- `showEditModal`: Displays the edit modal for editing the bookmark text.
- `saveEditedNote`: Saves the edited bookmark text.
- `showFullNote`: Displays the full note when the truncated note is clicked.
- `addNewBookmark`: Adds a new bookmark element to the list of bookmarks.
- `viewBookmarks`: Displays all saved bookmarks for the current video.
- `onPlay`: Jumps to the timestamp of the clicked bookmark.
- `onEdit`: Opens the edit modal for the clicked bookmark.
- `onDelete`: Deletes the clicked bookmark.
- `onDeleteAll`: Deletes all bookmarks for the current video.
- `setBookmarkAttributes`: Sets the attributes and event listeners for bookmark controls.

## Resources

- [Chrome Developer Documentation](https://developer.chrome.com/docs/extensions/mv3/)


## Contributing
Contributions are always welcome! If you'd like to contribute to this project or have any suggestions, feel free to create a new issue or submit a pull request. Please check the [Code of Conduct](./CODE_OF_CONDUCT.md) first.

To submit a pull request, follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Create a new Pull Request

## License

This project is open-source and available under the [MIT License](./LICENSE.md).

## Support

If you have any questions or need help getting started, please open an issue in the repository or contact me on Twitter: @tanja_codes
