# PANDORÆ Roadmap

Download latest version :
- [Windows](https://anthropos-ecosystems.com/pandorae/PANDORAE-win32-x64.zip)
- [macOS](https://anthropos-ecosystems.com/pandorae/PANDORAE-macOS.zip)
- [Linux](https://anthropos-ecosystems.com/pandorae/PANDORAE-linux-x64.zip)

If you'd rather test the dev branch, clone the repo, cd into it, and use 'npm i', './node_modules/.bin/electron-rebuild' then 'npm start'.

**License issues :** some package/code license issues might still be around after the pre-upload cleanup. If you find one or more, please reach out on Twitter (@Li_Guilong) and I'll try to make it right.

**Known issues - Alpha 88**
- _On macOS/Windows_: unknown developer - refuses to open app. In macOS, go to System Preferences -> Security and click on Open Anyway. On Windows, click sur "more info" and "execute". Else, you can use the /dev branch or wait for me to introduce a certificate.
- _On macOS_ : first boot fails at creating the necessary userData directories, second boot crashes on closing the console. It should work fine-ish afterwards.

### TODO
- comment each and every line of JS
- create an interactive scroller/flowchart tutorial
- enable displaying slides/photos/videos in main canvas

##### Flux
- design a specific flux landing page

##### Next version
- implement FETCH altmetric requests
