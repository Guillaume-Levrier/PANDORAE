const CMT = {"EN":{
        "menu":{
            "flux":"flux",
            "type":"type",
            "quit":"quit",
            "returnToTutorial":"return to tutorial"
        },
        "global":{
            "coreLogo":["P","&nbsp;","A","&nbsp;","N","&nbsp;","D","&nbsp;","O","&nbsp;","R","&nbsp;","Æ","&nbsp;"," ","-"," ","&nbsp;","C","&nbsp;","O","&nbsp;","R","&nbsp;","E"],
            "field":{
            "starting":"starting",
            "error": "system error",
            "workerError":"multithreading disabled",
            "loading":"loading"
            }
        },"mainField":{
            "changeTheme": "change theme ",
            "invalidTheme": "invalid theme name",
            "toggleConsole": "toggle console",
            "toggleMenu": "toggle menu",
            "reload": "reload",
            "fullscreen":"fullscreen",
            "restart":"restart",
            "reloadCore":"reload core",
            "openDevtools":"open devtools",
            "unlockMenu":"unlock menu",
            "version":"version",
            "returnTutorial":"return to tutorial",
            "startTutorial":"start tutorial",
            "comNotFound":"command not found"
        },
            "console":{
                "starting":["Starting process "," using dataset "],
                "error":["SYSTEM ERROR - PANDORÆ was unable to perform this task. The dataset might be incompatible with your request."],
                "workerError":["The SharedWorker failed to start. Processes requiring multithreading will be unavailable."],
                "workerValidation":["Multithreading enabled."],
                "menu":{
                    "opening":"Opening menu",
                    "closing":"Collapsing menu"
                }
        },
        "chaeros":{ 
            "field":{

            },
            "console":{

        }},
        "flux":{
            "divs":{
                "hyphendpoint":"Enter your Hyphe endpoint below :"
            }, 
            "field":{

        },
        "console":{

        }},
        "types":{ 
        "console":{

        },
        "tooltip":{

        }
    },
    "tutorial":{
        "sections":{
            "mainTitle":"<div style='text-align:center'><div class='title' style='font-size:36px;font-weight: bold;'>Welcome to PANDORÆ</div><br><i class='material-icons arrowDown'><a class='arrowDown' onclick='smoothScrollTo(\"slide2\")'>arrow_downward</a></i></div>",
            "slide2":"<div style='text-align:center'><span class='title'>This short tutorial will guide your first steps with PANDORÆ.</span><br><br><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"slide2bis\")'>arrow_downward</a></i></div>",
            "slide2bis":"<div style='text-align:center'><span class='title'>As you noticed, you can click on the <strong>arrows</strong> to go down or back.</span><br><br>You can also use your <strong>mouse wheel</strong> to navigate up and down.&nbsp;<br><br>            You can skip specific chapters and come back to this <strong>tutorial</strong> later.<br><br>            If you're unsure of how to proceed, you can watch the step-by-step video of this tutorial while you interact with it.<br><br><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"slide3\")'>arrow_downward</a></i></div>",
            "slide3":"<div style='text-align:center'><span class='title'>PANDORÆ is a <strong>data retrieval & exploration tool.</strong></span><br><br>You can use it for many purposes, like building a <strong>literature review</strong>.<br><br><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"slide4\")'>arrow_downward</a></i></div>",
            "slide4":"<div style='text-align:center'><span class='title'>PANDORÆ  allows you to perform three main kinds of operations :</span><br><br><a onclick=\"smoothScrollTo('Chapter1')\">Load & enrich data</a><br><br><a onclick=\"smoothScrollTo('Chapter2')\">Explore data</a><br><br><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"Chapter1\")'>arrow_downward</a></i></div>",
            "Chapter1":"<span class='title'><strong>Chapter 1: Loading & enriching data</strong></span><br><br>PANDORÆ enables you to load data from different types of sources.<br><br>Those sources can be online databases that aggregate documents such as scientific articles.<br> <br>But you can really add <strong>any kind of document</strong>.<br><br>PANDORÆ also supports other types of data, such as those extracted from social-media or clinical trials.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"flux\")'>arrow_downward</a></i></div>",
            "flux":"<span class='title'><strong>Cascade: Available data flows</strong></span><br><br><div style='display: inline-flex'><div style='flex:auto'>   <strong>Cascade</strong> is how Flux displays its data flows. As you can see, the data flows from you to the system. Hovering a process shows to which other process it is linked.  <br>&nbsp;<br> Cascade behaves like menu : click on a process and its options will be displayed.<br>&nbsp;<br>Click <a onclick='tuto(\"flux\");'>here</a> to learn how to open Flux.<br>&nbsp;<br> <div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"flux2\")'>arrow_downward</a></i></div></div><div style='flex:auto'><svg></svg></div></div><br>&nbsp;<br>",
            "flux2":"<span class='title'><strong>Flux sections</strong></span><br><br>Flux has different types of processes. Each section has its own purpose, and relies on different services:<ul style='list-style-type: square;'><li><a onclick='smoothScrollTo(\"user\")'>User</a> lets you insert your API keys and credentials.</li><li><a onclick='smoothScrollTo(\"databases\")'>Databases requests</a> allow you to retrieve data from various online sources.</li><li><a onclick='smoothScrollTo(\"enriching\")'>Enriching</a> allows you to edit and enrich datasets.</li><li><a onclick='smoothScrollTo(\"system\")'>System</a> sends your data to PANDORAE visualisation features.</li></ul>Detail about the other sections will become available when they will be rolled out. Click on a section name to learn more about that section right now, or simply click on the arrow to continue.   <br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"databases\")'>arrow_downward</a></i></div>",
            "databases":"<span class='title'><strong>Databases</strong></span><br><br><div>Online databases can handle precise requests and return articles relevant to your needs. Many services exist, but PANDORÆ currently only supports Scopus. In order to start using PANDORÆ and Scopus, you will need to retrieve an <a onclick='shell.openExternal(\"https://dev.elsevier.com/\")'>API key</a> and insert it in Flux's USER tab.<br>&nbsp;<br> <br>&nbsp;<br> <div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"Enriching\")'>arrow_downward</a></i></div></div>",
            "Enriching":"<span class='title'><strong>Enriching data</strong></span><br><br><strong>Flux</strong> enables you do retrieve data from different kinds of <a onclick='smoothScrollTo(\"Bibliometric-databases\")'>databases</a>. Articles can be <a onclick='smoothScrollTo(\"enrichment\")'>enriched</a> by <strong>geolocating</strong> their affiliation and retrieving additional <strong>metadata</strong>. But you will often have to curate your data and enrich its content by hand. PANDORÆ therefore helps you send your datasets to <a onclick='smoothScrollTo(\"Zotero1\")'>Zotero</a> and download them back into the system when you're done cleaning your dataset.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"enrichment\")'>arrow_downward</a></i></div>",
            "enrichment":"<span class='title'><strong>Enrichment</strong></span><br><br>Enrichment builds upon the datasets you obtained by requesting bibliometric databases. <br>&nbsp;<br>It will give you the opportunity to retrieve the geographic coordinates of each paper's affiliation(s), which in turn will allow <a onclick='smoothScrollTo(\"geotype\")'>Geotype</a> to display those on a map. <br>&nbsp;<br>It can also retrieve Altmetric metadata, which might need an <a onclick='shell.openExternal(\"https://www.altmetric.com/\")'>API key</a>.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"Zotero1\")'>arrow_downward</a></i></div>",
            "Zotero1":"<span class='title'><strong>Zotero</strong></span><br><br><strong>Zotero</strong> is an open-source software designed to manage bibliographic data and references. It supports CSL-JSON datasets.       <br>&nbsp;<br> PANDORÆ converts data retrieved from <a onclick='smoothScrollTo(\"Bibliometric-databases\")'>databases</a> to this format.     <br>&nbsp;<br> Using Zotero, you can explore, edit and curate those datasets. <br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"Zotero2\")'>arrow_downward</a></i></div>",
            "Zotero2":"<span class='title'><strong>Creating a Zotero account</strong></span><br><br>You can create a free zotero account at <a onclick='shell.openExternal(\"https://www.zotero.org/\")'>https://www.zotero.org/</a>. <br>&nbsp;<br> Once that is done, you will need to set up a <a onclick='shell.openExternal(\"https://www.zotero.org/groups/\")'>group library</a> and retrieve a read/write API key.<br>&nbsp;<br> <strong>But for now,</strong> you can just click <a onclick='tuto(\"zoteroImport\")'>here</a> to learn how to use Zotero with PANDORÆ with <strong>sample data</strong> instead.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"Chapter2\")'>arrow_downward</a></i></div>",
            "Chapter2":"    <span class='title'><strong>Chapter 2: Exploring data</strong></span><br><br> PANDORÆ's main purpose is to enable you to explore large and/or complex datasets. It features several different kinds     of '<strong>types</strong>', that is ways to display your data:      <li><a onclick='smoothScrollTo(\"chronotype\")'>Chronotype</a> puts different corpuse of documents on a same timeline for you to compare their size and content.</li>      <li><a onclick='smoothScrollTo(\"geotype\")'>Geotype</a> draws a globe and displays scholarly paper's affiliation cities, institutions, and who cooperates with whom.</li>           <br>      Other features are documented on the <a onclick='shell.openExternal(\"https://github.com/Guillaume-Levrier/PANDORAE/wiki\")'>wiki</a>. Please note you need to resize your window <strong>before</strong> loading a <strong>types</strong>.  <br>&nbsp;<br>    <div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"chronotype\")'>arrow_downward</a></i></div>",
            "chronotype":"    <span class='title'><strong>Chronotype</strong></span><br><br>The <strong>chronotype</strong> displays one to seven Zotero collections at a time. Each collection is a vertical line. Each node on this line is a cluster of documents published      on that month. Clicking the node opens the cluster, revealing the documents. Hovering a document shows its metadata. Clicking it leads to its content, if available.  <br>&nbsp;<br>      Click <a onclick='tuto(\"chronotype');'>here</a> to try the chronotype if you already loaded the sample datasets. If not, click <a onclick='smoothScrollTo(\"Zotero2\")'>here</a> to do so.      <br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"geotype\")'>arrow_downward</a></i></div>",
            "geotype":"      <span class='title'><strong>Geotype</strong></span><br><br>        The <strong>geotype</strong> displays a globe on which available affiliations are geolocated. Affiliations having cooperated on a paper listed in the dataset are linked in red.          <br>&nbsp;<br>        Click <a onclick='tuto(\"geotype');'>here</a> to try to the geotype if you already loaded the sample datasets. If not, click <a onclick='smoothScrollTo(\"Zotero2\")'>here</a> to do so.        <br>&nbsp;<br>  <div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"FinalChap\")'>arrow_downward</a></i></div>",
            "FinalChap":"<div style='text-align:center'><span class='title'><strong>Final Chapter: the great escape</strong></span><br><br>      Our short journey together is about to come to an end.<br>&nbsp;<br>       It is now time for you to learn how to escape the Tutorial's constraint.       <br>&nbsp;<br>      Time to break free.      <br>&nbsp;<br><div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"final2\")'>arrow_downward</a></i></div></div>",
            "final2":"<div style='text-align:center'><span class='title'><strong>USER wants to break free</strong></span><br><br>        You might have noticed when you first started PANDORÆ that your possibilities were limited. <br>&nbsp;<br>        The <i  class='material-icons'>menu</i> <strong>menu</strong> button was 'forbidden', the <i  class='material-icons'>code</i> <strong>console</strong>  button too. <br>&nbsp;<br>        Your only option was to start the tutorial. Let's change that.        <br>&nbsp;<br>  <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"final3\")'>arrow_downward</a></i></div></div>",
            "final3":"<div style='text-align:center'><span class='title'><strong>Back to Flux-ture</strong></span><br><br>          PANDORÆ starts in tutorial mode when it detects that no user name has been entered. <br>&nbsp;<br>          To turn off the tutorial mode, go back to <a onclick='smoothScrollTo(\"flux\")'>Flux</a>, go to the USER section, enter a user name. Do not forget to click the 'Update User Credentials' button. <br>&nbsp;<br>          Then come back here.<br>&nbsp;<br>    <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"final4\")'>arrow_downward</a></i></div></div>",
            "final4":"<div style='text-align:center'><span class='title'><strong>The main field</strong></span><br><br>            PANDORÆ communicates with you by displaying messages in the main field, on the main screen. You can also write in this field to communicate with PANDORÆ. <br>&nbsp;<br>            To select the field, push your <strong>TAB</strong> key after clicking on the main screen. You can then enter commands and push the <strong>ENTER</strong> key. <br>&nbsp;<br>      <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"final5\")'>arrow_downward</a></i></div></div>",
            "final5":"<div style='text-align:center'><span class='title'><strong>Entering commands</strong></span><br><br>             If your menu is locked, you can use the &nbsp;<span class='commands'>unlock menu</span>&nbsp; command. <br>&nbsp;<br>             It also works in the console.             <br>&nbsp;<br>             You can also change PANDORÆ's theme with the &nbsp;<span class='commands'>change theme</span>&nbsp; command. <br>&nbsp;<br>             Try with &nbsp;<span class='commands'>change theme blood-dragon</span>&nbsp; for example. You can switch back with &nbsp;<span class='commands'>change theme normal</span>. <br>&nbsp;<br>                <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"final6\")'>arrow_downward</a></i></div></div>",
            "final6":"<div style='text-align:center'><span class='title'><strong>Call me ...  maybe?</strong></span><br><br>            If you ever miss the tutorial, or want to check one of its chapter, you can use the             &nbsp;<span class='commands'>start tutorial</span>&nbsp; command.<br>&nbsp;<br> You will always be welcome here.<br>&nbsp;<br>                <div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"final7\")'>arrow_downward</a></i></div></div>",
            "final7":"<div style='text-align:center'><span class='title'><strong>Freedom at last</strong></span><br><br>           You will learn how to use PANDORÆ mostly by trial and error.<br>&nbsp;<br> If you're a researcher and/or developer, you might want to go have a look at its            <a onclick='shell.openExternal(\"https://github.com/Guillaume-Levrier/PANDORAE\")'>source code</a>.<br>&nbsp;<br>           A wiki of the project is available <a onclick='shell.openExternal(\"https://github.com/Guillaume-Levrier/PANDORAE/wiki\")'>here</a>.           <br>&nbsp;<br>           <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' onclick='lastScroll()'>arrow_downward</a></i></div></div>",
            "final8":"<div style='text-align:center'>This <strong>CORE</strong> is now yours. <br>&nbsp;<br>           Close the software and restart it to escape the tutorial.<br>&nbsp;<br>           Thank you for using PANDORÆ.<br><br>                    <div id='restartCount' style='font-weight: bolder'></div></div>",
            "last":"<div style='margin:auto;font-size:10px;line-height: 15px;'>PANDORÆ - version 1 <br>Guillaume Levrier</div>"
        }

        }
    
},
"FR":{
    "menu":{
        "flux":"flux",
        "type":"type",
        "quit":"quitter",
        "returnToTutorial":"retour au tutoriel"
    },

    "tutorial":{
        "sections":{
           
        }
    }
 },"中文":{
    "menu":{
        "flux":"流动",
        "type":"显示",
        "quit":"关闭",
        "returnToTutorial":"回教程"
    }
 }
}