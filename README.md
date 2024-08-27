## README

Repository for testing alternative approaches to creating a video player plugin.

Reference: [construct3-videoplayer-addon](https://bitbucket.org/genvidtech/construct3-videoplayer-addon/src/main/)

## Prerequisites

- A license for Construct 3 to build games and addons.
- An Amazon account to be able to create and consume live stream.
- Node.js (latest)

## Setup

### HTTP Server

- Node http-server package is used to serve the root folder `src`
  where resides the code for the video player addon.
- CORS is enabled on the http-server.
- Cache is disabled so that reload after changes should work.
- By default, we serve the files on port `8080`
- To start the server, execute `npm run dev`.
- As a minimum requirement, Construct request that the file `http://localhost:8080/addon.json`
  is accessible.

### Development Mode in Construct 3

1. Create a new empty project and save it locally.
2. Click on `menu` then `settings`.
3. Click **10 times** the header of the modal form. You should get the Developer mode modal
   window to appear.
4. Click on `OK`.
5. Go at the bottom of the modal form (settings) and check the box `Enable developer mode`.
6. Restart construct 3.
7. Click on `Menu`, `View`, `AddOn Manager`.
8. Click on `Add dev addon...`.
9. Copy/paste or enter the url that points to the addon.json file. It should be `http://localhost:8080/addon.json`.
10. If it loads successfully, it will request you to restart construct 3. Going back under `Addon manager` you should
    see your new addon.

#### Extra notes

- To find any issues/problems about adding your plugin, you can press `F12` and look at the console.log of the browser.
- To uninstall the addon, simply go to `Menu`, `View`, `AddOn Manager`. Right-click the addon and select `Uninstall`. Restart construct 3.
- If you encounter issues with your addon or can't start Construct 3 because of your addon you can:
  - Clear the browser storage of Chrome OR
  - start Construct 3 with the following query param `?safe-mode`
- Every time you add something, add it to the language definition as well.
- icon.svg is a mandatory file. Even when not specified in addon.json. If not provided, generate error "addon 'XXXXX' missing file 'icon.svg'" in the construct3 dev console. Add a valid file icon.svg in the plugin and in the addon.json `file-list`.
- be EXTREMELY CAREFUL when declaring or calling external object and properties, projects being minified in advanced mode will mangle properties. See [Construct 3 - EXPORTING WITH ADVANCED MINIFICATION ](https://www.construct.net/en/make-games/manuals/construct-3/scripting/guides/advanced-minification).

### Zipping and importing this plugin

1. Zip this plugin by executing the following commands.

```
cd src
7z a -tzip -r ..\genvid_videoplayer-addon.c3addon .
```

This should have generated genvid_videoplayer-addon.c3addon. e.g.

```
\construct3-videoplayer-addon2\src> 7z a -tzip -r ..\genvid_videoplayer-addon.c3addon .

7-Zip 21.07 (x64) : Copyright (c) 1999-2021 Igor Pavlov : 2021-12-26

Scanning the drive:
3 folders, 16 files, 47592 bytes (47 KiB)

Creating archive: ..\genvid_videoplayer-addon.c3addon

Add new data to archive: 3 folders, 16 files, 47592 bytes (47 KiB)


Files read from disk: 16
Archive size: 16431 bytes (17 KiB)
Everything is Ok
```

2. Import genvid_videoplayer-addon.c3addon using Addon Manager of your project.

If you encounter the error message

```
Error details: Error: key name 'plugins.genvidtech_videoplayerplugin.name' already exists in language string map
```

(possibly because you were previously using this plugin via localhost:8080), clear your browser cache and try again.
