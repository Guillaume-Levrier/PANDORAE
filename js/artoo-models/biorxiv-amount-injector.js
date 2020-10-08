;(function(undefined) {

    /**
     * artoo chrome injection
     * =======================
     *
     * This chrome content script injects artoo in every relevant page when the
     * artoo's extension is activated.
     */

    const { ipcRenderer } = require("electron");
    const appPath = ipcRenderer.sendSync('remote', 'appPath');
  
    var body;
    if ('document' in this) {
      body = document.getElementsByTagName('body')[0];
      if (!body) {
        body = document.createElement('body');
        document.documentElement.appendChild(body);
      }
    }

    function injectScript(type,url) {
      // Creating script element
      window.addEventListener('DOMContentLoaded', (event) => {
        var script = document.createElement('script'),
        body = document.getElementsByTagName('body')[0];

        script.src = url;
        script.type = 'text/javascript';
        script.id = type+'_injected_script';
        script.setAttribute('chrome', 'true');

        // Appending to body
        body.appendChild(script);

      });
      
    }

    injectScript("jQuery",'https://code.jquery.com/jquery-2.1.3.min.js'); 
    injectScript("artoo","file://"+appPath+'/node_modules/artoo-js/build/artoo.chrome.js');
   
    window.addEventListener('load', e=> {
      let amount =artoo.scrape('#page-title','text')[0];
      ipcRenderer.send('artoo',{type:"biorxiv-amount",content:amount});
      setTimeout(() => {
        location.close()
      }, 200);
    })
    

  }).call(this);