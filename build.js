"use strict";

const builder = require("electron-builder");
const Platform = builder.Platform;

// Promise is returned
builder
  .build()
  .then((res) => {
    console.log(res);
    // handle result
  })
  .catch((error) => {
    // handle error
    console.log(error);
  });
