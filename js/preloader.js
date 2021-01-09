var fs = require("fs");

const preloadMap=[
    {name:"js/preload-index.js",files:["js/db.js","js/locales.js","js/pandorae.js","js/slider.js","js/lib/OrbitControls.js"]}
]



preloadMap.forEach(plmap=>{
    let writer = fs.createWriteStream(plmap.name,{flags:"w"})

    plmap.files.forEach(fl=>{
     fs.createReadStream(fl).pipe(writer);
      
    })
      
})

