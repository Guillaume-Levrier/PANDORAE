const EN = {
  menu: {
    flux: "flux",
    type: "type",
    slide: "slide",
    quit: "quit",
  },
  global: {
    coreLogo: [
      "P",
      "&nbsp;",
      "A",
      "&nbsp;",
      "N",
      "&nbsp;",
      "D",
      "&nbsp;",
      "O",
      "&nbsp;",
      "R",
      "&nbsp;",
      "Æ",
      "&nbsp;",
      " ",
      "-",
      " ",
      "&nbsp;",
      "C",
      "&nbsp;",
      "O",
      "&nbsp;",
      "R",
      "&nbsp;",
      "E",
    ],
    field: {
      starting: "starting",
      error: "system error",
      workerError: "multithreading disabled",
      loading: "loading",
    },
  },
  mainField: {
    changeTheme: "change theme ",
    invalidTheme: "invalid theme name",
    toggleConsole: "toggle console",
    toggleMenu: "toggle menu",
    reload: "reload",
    fullscreen: "fullscreen",
    restart: "restart",
    reloadCore: "reload core",
    openDevtools: "open devtools",
    unlockMenu: "unlock menu",
    version: "version",
    returnTutorial: "return to tutorial",
    startTutorial: "start tutorial",
    comNotFound: "command not found",
  },
  console: {
    starting: ["Starting process ", " using dataset "],
    error: [
      "SYSTEM ERROR - PANDORÆ was unable to perform this task. The dataset might be incompatible with your request.",
    ],
    workerError: [
      "The SharedWorker failed to start. Processes requiring multithreading will be unavailable.",
    ],
    workerValidation: ["Multithreading enabled."],
    menu: {
      opening: "Opening menu",
      closing: "Collapsing menu",
    },
  },
  chaeros: {
    field: {},
    console: {},
  },
  flux: {
    tabs: {
      istex: {
        id: "istex", // id of the main div
        title: "ISTEX", // title of the tab (displayed on the page)
        description: `ISTEX is an open archive of more than 25 million scientific documents in 51 languages maintained by French scientific research agencies.`,
        sections: [
          { type: "tabDatasets", data: { id: "istex" } },
          {
            type: "APIquery",
            data: {
              target: "istex",
              key: "istex",
              queryField: true,
              function: {
                name: "istexBasicRetriever",
                args: {},
                aftermath: "timeout", // "disable" disables submitting another query to the same source.
              },
            },
          },
        ],
      },
      user: {
        id: "user", // id of the main div
        title: "USER", // title of the tab (displayed on the page)
        description: `The user tab lets you fill in your information and API keys. Do scroll down and click "save user information" when you make a change : the system does <span style="font-weight:bold">not</span> save your information automatically.`,
        sections: [
          {
            type: "warningDisclaimer",
            data: {
              content:
                "The data entered below is unencrypted so as to make this application portable. Click on the button to access the file and delete it manually if you are on a public computer.",
              func: {
                text: "Open User ID directory",
                id: "openUserDirectory",
              },
            },
          },
          {
            type: "personalInformation",
            data: { id: "UserName", name: "Name" },
          },
          {
            type: "personalInformation",
            data: { id: "UserMail", name: "Email" },
          },
          {
            type: "addServiceCredentials",
            data: {
              name: "zotero",
              description: `PANDORAE helps you retrieve and explore data. To help you manually curate and edit it, the software is built to be interfaced with the Zotero software-cum-database service. You are expected to export the data you retrieve with PANDORAE to one or more Zotero group(s) you have write access to, and import data back from there to start exploring.`,
              helper: {
                text: `The process of creating Zotero groups and interfacing these with PANDORAE is detailed on <strong>pandorae.politique.science</strong>, the software's community help forum. Click on this box to open the relevant page in your browser.`,
                url: "https://pandorae.politique.science",
              },
              libraries: [],
              apikey: "",
            },
          },
        ],
      },
      zotero: {
        id: "zotero", // id of the main div
        title: "ZOTERO", // title of the tab (displayed on the page)
        description: `This tab lets you send a collection of CSL-JSON documents retrieved by PANDORÆ to Zotero,
         and reciprocally import a Zotero collection (regardless of its origin) to PANDORÆ.`,
        disclaimers: {
          jointImport: `Keep in mind that you can jointly import several
         collections belonging to a single Zotero library/group, but you cannot jointly import several collections from different
         Zotero libraries/groups.`,
        },
        sections: [
          { type: "tabDatasets", data: { id: "csljson" } },
          {
            type: "APIquery",
            data: {
              target: "zotero",
              key: "zotero",
              queryField: false,
              function: {
                name: "zoteroCollectionRetriever",
                args: {},
                aftermath: "disable", // "disable" disables submitting another query to the same source.
              },
            },
          },
        ],
      },
      system: {
        id: "system", // id of the main div
        title: "SYSTEM", // title of the tab (displayed on the page)
        description: `Datasets listed in SYSTEM are available locally and ready to be exported to one of PANDORÆ's visualisation tools.`, // main description of the tab
        sections: [
          {
            type: "tabDatasets",
            data: { id: "system", table: "flux", source: "zotero" },
          },
          { type: "loadLocalFlatFile", data: { accept: ".json" } },
        ],
      },
    },
    divs: {
      hyphendpoint: "Enter your Hyphe endpoint below :",
    },
    field: {},
    console: {},
  },
  types: {
    names: {
      timeline: "Timeline",
      geolocator: "Geolocator",
      network: "Network",
      webArchive: "Web archive",
      clinicalTrials: "Clinical trials",
      socialMedia: "Social media",
      hyphe: "Hyphe",
      parliament: "Parliaments",
    },
    console: {},
    tooltip: {},
  },
  tutorial: {
    sections: {
      mainTitle: `<div style='text-align:center'>
          <div class='title' style='font-size:36px;font-weight: bold;'>Welcome to PANDORÆ</div>
          <br><i class='material-icons arrowDown'><a class='arrowDown' data-action='scroll' data-target='slide2'>arrow_downward</a></i></div>`,
      slide2: `<div style='text-align:center'>
          <span class='title'>This short tutorial will guide your first steps with PANDORÆ.</span><br><br>
          <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='slide2bis'>arrow_downward</a></i></div>`,
      slide2bis: `<div style='text-align:center'>
          <span class='title'>As you noticed, you can click on the <strong>arrows</strong> to go down or back.</span><br><br>
          You can also use your <strong>mouse wheel</strong> to navigate up and down.&nbsp;<br><br>
          You can skip specific chapters and come back to this <strong>tutorial</strong> later.<br><br>
          <br><br><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='slide3'>arrow_downward</a></i></div>`,
      slide3: `<div style='text-align:center'>
          <span class='title'>PANDORÆ is a <strong>data retrieval & exploration tool</strong>.</span><br><br>
          It has been designed to help you navigate large collections of documents.<br><br>
          <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='slide4'>arrow_downward</a></i></div>`,
      slide4: `<div style='text-align:center'>
          <span class='title'>PANDORÆ  allows you to perform two main kinds of operations :</span><br><br>
          <a data-action='scroll' data-target='Chapter1'>Retrieve data</a><br><br>
          <a data-action='scroll' data-target='Chapter2'>Explore data</a><br><br>
          <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Chapter1'>arrow_downward</a></i></div>`,
      Chapter1: `<span class='title'>
          <strong>Chapter 1: Retrieving data</strong></span><br><br>
          PANDORÆ enables you to load data from different types of sources.<br><br>
          Those sources can be online databases that aggregate documents such as scientific articles.<br><br>
          But you can really add <strong>any kind of document</strong>.<br><br>
          PANDORÆ also supports other types of data, such as those extracted from web archives, social media platforms, or even government-maintained APIs such as parliamentary debate feeds or clinical trials.<br><br>
          <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='flux'>arrow_downward</a></i></div>`,
      flux: `<span class='title'>
        <strong>Cascade: displaying available data flows</strong></span><br><br>
        <div style='display: inline-flex'><div style='flex:auto'>
        <strong>Cascade</strong> is how Flux displays its available data sources and flows.
         As you can see, the data flows from a source to the system. 
         Hovering a process shows to which other process it is linked.<br><br>
         Cascade behaves like menu : click on a process and its options will be displayed.<br><br>
         Click <a data-action='tuto' data-target='flux'>here</a> to learn how to open Flux.<br><br>
         <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='flux2'>arrow_downward</a></i></div></div><div style='flex:auto'><svg></svg></div></div><br>&nbsp;<br>`,
      flux2: `<span class='title'>
          <strong>Flux sections</strong></span><br><br>
          Flux has different types of processes. 
          Some are sources that can provide you with data, others are steps that let you curate, enrich, 
          or save the retrieved data.
          <ul style='list-style-type: square;'>
          <li><a data-action='scroll' data-target='user'>User</a> lets you insert your API keys and credentials.</li>
          <li><a data-action='scroll' data-target='databases'>API requests</a> helps you retrieve data from various online sources.</li>
          <li><a data-action='scroll' data-target='enriching'>Processing steps</a> enables you to enrich datasets by rehydrating metadata with additional sources or manually disambiguating properties.</li>
          <li><a data-action='scroll' data-target='Zotero1'>Zotero</a> is used as a user-friendly interface for you to save and curate your document collections.</li>
          <li><a data-action='scroll' data-target='system'>System</a> fetches your curated data from Zotero and sends it to the PANDORAE visualisation features.</li>
          </ul>
          Click on a section name to learn more about that section right now, or simply click on the arrow to continue.   <br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='databases'>arrow_downward</a></i></div>`,
      databases: `<span class='title'>
        <strong>Preformatted API requests</strong></span><br><br><div>
          Many services offer APIs to retrieve large amounts of fully-hydrated (which can be understood as "as detailed as the service can provide") sets of data.<br><br>
          Such interfaces are made for software-to-software communication.<br><br>
          PANDORÆ helps use these APIs: it lets you input a request you have already crafted (usually by toying with the request forms available on the services' website) 
          and retrieve the fullest possible content in a responsible way (ie, without being an overbearing burden on the provider).<br><br>
          It additionnally retrieves and formats the data in a way that aims to be cross-compatible among services.
          <br>&nbsp;<br> <br>&nbsp;<br> <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Enriching'>arrow_downward</a></i></div></div>`,
      Enriching: `<span class='title'>
          <strong>Enriching & formatting data</strong></span><br><br>
          <strong>Flux</strong> enables you do retrieve data from different kinds of sources.<br><br>
          Articles can be enriched by retrieving additional <strong>metadata</strong>. But you will often have to curate your data and enrich its content by hand.<br><br>
          PANDORÆ therefore helps you send your datasets to <a data-action='scroll' data-target='Zotero1'>Zotero</a> and download them back into the system when you're done cleaning your dataset.<br><br>
          <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Zotero1'>arrow_downward</a></i></div>`,
      Zotero1: `<span class='title'><strong>Zotero</strong></span><br><br>
          <strong>Zotero</strong> is an open-source software designed to manage bibliographic data and references. 
          It supports CSL-JSON datasets.<br><br>
          PANDORÆ converts data retrieved from <a data-action='scroll' data-target='Bibliometric-databases'>databases</a> to this format.<br><br>
          Using Zotero, you can explore, edit and curate those datasets.<br><br>
          <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Zotero2'>arrow_downward</a></i></div>`,
      Zotero2: `<span class='title'>
          <strong>Creating a Zotero account</strong></span><br><br>
          You can create a free zotero account at <a data-action='openEx' data-target='https://www.zotero.org/'>https://www.zotero.org/</a>.<br><br>
          Once this is done, you will need to set up a <a data-action='openEx' data-target='https://www.zotero.org/groups/new'>group library</a> and retrieve a read/write API key.<br><br>
          <strong>Once this is done,</strong> you can click <a data-action='tuto' data-target='zoteroImport'>here</a> to learn connect PANDORÆ with Zotero.<br><br>
          <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='ISTEX1'>arrow_downward</a></i></div>`,
      ISTEX1: `<span class='title'>
          <strong>Requesting data from the ISTEX API</strong></span><br><br>
          ISTEX is a scientific archive maintained by the French CNRS.<br><br> 
          You can send it small requests without the need for specific credentials.<br><br> 
          Click <a data-action='tuto' data-target='istexRequest'>here</a> to learn how to start an ISTEX request.<br><br> 
          <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Zotero3'>arrow_downward</a></i></div>`,
      Zotero3: `<span class='title'>
        <strong>Sending retrieved data to Zotero</strong></span><br><br>
        We should now have both a connected Zotero library and data to send to it.<br><br> 
        The next steps are to (1) convert the data to a format Zotero can understand and (2) send the converted data to our Zotero library.<br><br> 
        Click <a data-action='tuto' data-target='sendToZotero'>here</a> to here to learn how to convert and send data.<br><br> 
        <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Chapter2'>arrow_downward</a></i></div>
        `,
      Chapter2: `<span class='title'>
          <strong>Chapter 2: Exploring data</strong></span><br><br>
          PANDORÆ's main purpose is to enable you to explore large and/or complex datasets. <br><br>
          It features several different kinds of '<strong>types</strong>', that is ways to display your data.<br><br>
          In this tutorial, we will learn how to send a Zotero collection to PANDORÆ's chronotype.<br><br>
          <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='SystemImport'>arrow_downward</a></i></div>`,
      SystemImport: `<span class='title'>
          <strong>Importing data from Zotero to System</strong></span><br><br>
          The data we retrieved in Chapter 1 is now in our Zotero library. 
          This gives you an opportunity to manually curate, edit, and enrich this collection.<br><br>
          Once you are done, you can <a data-action='tuto' data-target='reImportToSystem'>re-import this collection</a> in PANDORÆ's System.<br><br>
          This is a collection we first retrieved with PANDORÆ, but as you probably guessed, any Zotero collection could do!<br><br>
          <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='typeSelect'>arrow_downward</a></i></div>
          `,
      typeSelect: `<span class='title'>
        <strong>Importing data from Zotero to System</strong></span><br><br>
        Now that your data is in PANDORÆ's System memory, you can affect it to a specific kind of visualization.<br><br>
        You will have to do this one on your own, without a guide.<br><br>
        Open FLUX, go to system, and send the dataset you imported to Chronotype.<br><br>
        <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='chronotype'>arrow_downward</a></i></div>
        `,
      chronotype: `<span class='title'><strong>Chronotype</strong></span><br><br>
          The <strong>chronotype</strong> displays one to seven Zotero collections at a time.
          Each collection is a vertical line. Each node on this line is a cluster of documents published on that month. 
          Clicking the node opens the cluster, revealing the documents. Hovering a document shows its metadata. Clicking it leads to its content, if available.<br><br>
          Click <a data-action='tuto' data-target='chronotype');'>here</a> to try the chronotype if you already loaded the sample datasets. 
          If not, click <a data-action='scroll' data-target='Zotero2'>here</a> to do so.<br><br>
          <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='FinalChap'>arrow_downward</a></i></div>`,
      /*geotype:
          "      <span class='title'><strong>Geotype</strong></span><br><br>        The <strong>geotype</strong> displays a globe on which available affiliations are geolocated. Affiliations having cooperated on a paper listed in the dataset are linked in red.          <br>&nbsp;<br>        Click <a data-action='tuto' data-target='geotype');'>here</a> to try to the geotype if you already loaded the sample datasets. If not, click <a data-action='scroll' data-target='Zotero2'>here</a> to do so.        <br>&nbsp;<br>  <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='FinalChap'>arrow_downward</a></i></div>", */
      FinalChap: `<div style='text-align:center'><span class='title'>
          <strong>Final Chapter: the great escape</strong></span><br><br>
          Our short journey together is about to come to an end.<br><br>
          It is now time for you to learn how to escape the Tutorial's constraint.<br><br>
          Time to break free.<br><br>
          <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final2'>arrow_downward</a></i></div></div>`,
      final2: `<div style='text-align:center'><span class='title'>
          <strong>USER wants to break free</strong></span><br><br>
          You might have noticed when you first started PANDORÆ that your possibilities were limited.<br><br>
          The <i  class='material-icons'>menu</i> <strong>menu</strong> button was 'forbidden', the <i  class='material-icons'>code</i> <strong>console</strong>  button too. <br><br>
          Your only option was to start the tutorial. Let's change that.<br><br>
          <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final3'>arrow_downward</a></i></div></div>`,
      final3: `<div style='text-align:center'><span class='title'><strong>Back to Flux-ture</strong></span><br><br>
          PANDORÆ starts in tutorial mode when it detects that no user name has been entered.<br><br>
          To turn off the tutorial mode, go back to <a data-action='scroll' data-target='flux'>Flux</a>, 
          go to the USER section, enter a user name. 
          Do not forget to click the 'Update User Credentials' button.<br><br>
          Then come back here.<br><br>    
          <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final4'>arrow_downward</a></i></div></div>`,
      final4: `<div style='text-align:center'><span class='title'><strong>The main field</strong></span><br><br>
          PANDORÆ communicates with you by displaying messages in the main field, 
          on the main screen. You can also write in this field to communicate with PANDORÆ.<br><br>
          To select the field, push your <strong>TAB</strong> key after clicking on the main screen. 
          You can then enter commands and push the <strong>ENTER</strong> key.<br><br>
          <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final5'>arrow_downward</a></i></div></div>`,
      final5: `<div style='text-align:center'><span class='title'><strong>Entering commands</strong></span><br><br>
          If your menu is locked, you can use the &nbsp;<span class='commands'>unlock menu</span>&nbsp; command.<br><br>
          It also works in the console.<br><br>
          You can also change PANDORÆ's theme with the &nbsp;<span class='commands'>change theme</span>&nbsp; command.<br><br>
          Try with &nbsp;<span class='commands'>change theme blood-dragon</span>&nbsp; for example. 
          You can switch back with &nbsp;<span class='commands'>change theme normal</span> or <span class='commands'>change theme vega</span>.<br><br>   
          <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final6'>arrow_downward</a></i></div></div>`,
      final6: `<div style='text-align:center'><span class='title'><strong>Call me ...  maybe?</strong></span><br><br>
          If you ever miss the tutorial, or want to check one of its chapter, you can use the <span class='commands'>start tutorial</span> command.<br><br> 
          You will always be welcome here.<br><br>                
          <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final7'>arrow_downward</a></i></div></div>`,
      final7: `<div style='text-align:center'><span class='title'><strong>Freedom at last</strong></span><br><br>
          You will learn how to use PANDORÆ mostly by trial and error.<br><br>
          If you're a researcher and/or developer, you might want to go have a look at its <a data-action='openEx' data-target='https://github.com/Guillaume-Levrier/PANDORAE'>source code</a>.<br><br>
          <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='lastScroll()'>arrow_downward</a></i></div></div>`,
      final8: `<div style='text-align:center'>This <strong>CORE</strong> is now yours.<br><br>
          Close the software and restart it to escape the tutorial.<br><br>
          Thank you for using PANDORÆ.<br><br>
          <div id='restartCount' style='font-weight: bolder'></div></div>`,
      last: "<div style='margin:auto;font-size:10px;line-height: 15px;'>PANDORÆ - version 1 <br>Guillaume Levrier</div>",
    },
  },
};

export { EN };
