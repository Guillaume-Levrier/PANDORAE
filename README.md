# PANDORÆ Roadmap

To test the dev branch, clone the repo, cd into it, and use 'npm i', './node_modules/.bin/electron-rebuild' then 'npm start'.

**License issues :** some package/code license issues might still be around after the pre-upload cleanup. If you find one or more, please reach out on Twitter (@Li_Guilong) and I'll try to make it right.

### TODO FOR BETA RELEASE
- create an interactive tutorial (under way)
- solve errors in affiliation coordinates (check city then country before choosing, instead of taking the first guess)
- or even better, switch altogether to a custom local OSMNames file
- put a better (more precise) world-json file
- implement FETCH altmetric requests
- switch from flatfile to indexedDB through Dexie

### ONCE IN BETA
- enable gazouillotype brush & link it to dynamic node display (only generate nodes in the current brush, enforce a max brush width)
- comment each and every line of JS (under way)