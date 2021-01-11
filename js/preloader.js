
var mergeFiles = require('merge-files');

const preloadMap=[
    {name:"js/preload-index.js",files:["js/db.js","js/locales.js","js/pandorae.js","js/types.js","js/slider.js","js/lib/OrbitControls.js","themes/normal/normal.js","themes/vega/vega.js"]},
    {name:"js/preload-flux.js",files:["js/db.js","js/locales.js","js/flux.js","js/userdata.js"]}
]

preloadMap.forEach(plmap=>{
    mergeFiles(plmap.files, plmap.name).then(stat => {
        if (stat) {
            console.log("✅ "+plmap.name+ " rebuilt")
        }
       
    });
    
      
})


/*
var fs = require("fs");

const preloadMap=[
    {name:"js/preload-index.js",files:["js/db.js","js/locales.js","js/pandorae.js","js/types.js","js/slider.js","js/lib/OrbitControls.js"]}
]



preloadMap.forEach(plmap=>{
    let writer = fs.createWriteStream(plmap.name,{flags:"w"})

    plmap.files.forEach(fl=>{
        fs.createReadStream(fl).pipe(writer);   
      
    })
      
})

*/