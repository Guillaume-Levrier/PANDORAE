const keytar = require('keytar');

const getUserData = () => {

  fs.readFile(userDataPath +'/userID/user-id.json',                          // Read the designated datafile
                                'utf8', (err, data) => {              // Additional options for readFile
    if (err) throw err;
    
    let user = JSON.parse(data);
    
          let userName = user.UserName;
          let userMail = user.UserMail;
          let zoteroUser = user.ZoteroID;

          document.getElementById("userNameInput").value = userName;
          document.getElementById("userMailInput").value = userMail;
          document.getElementById("zoterouserinput").value = zoteroUser;
          document.getElementById("zoterokeyinput").value =     keytar.getPassword("Zotero",zoteroUser);
          document.getElementById("scopuskeyinput").value =     keytar.getPassword("Scopus",userName);
          document.getElementById("altmetrickeyinput").value =  keytar.getPassword("Altmetric",userName);
          //document.getElementById("twitterkeyinput").value =    keytar.getPassword("Twitter",userName);
          //document.getElementById("OAbutton").value =    keytar.getPassword("OAbutton",userName); 


    });
}
getUserData();

const basicUserData = () => {
  let userName = document.getElementById("userNameInput").value;
  let userMail = document.getElementById("userMailInput").value;
  let zoteroUser = document.getElementById("zoterouserinput").value;

var user = {"UserName" : userName, "UserMail" : userMail, "ZoteroID" : zoteroUser};
var data = JSON.stringify(user);
fs.writeFile(
  userDataPath +'/userID/user-id.json',
   data,
    'utf8',
    (err) => {if (err) throw err;
  })

document.getElementById("user-button").style.transition = "all 1s ease-out";
document.getElementById("user-button").style.backgroundPosition = "right bottom";
document.getElementById("user-button").style.color = "black";
document.getElementById("user-button").innerText = "User credentials updated";

getUserData();
}

const updateUserData = (service) => {
      let userName = document.getElementById("userNameInput").value;
      let zoteroUser = document.getElementById("zoterouserinput").value;

switch (service) {
  case "Zotero":
    keytar.setPassword("Zotero",zoteroUser,document.getElementById("zoterokeyinput").value);
    checkKey("zoteroAPIValidation");
  break;

  case "Scopus":
    keytar.setPassword("Scopus",userName,document.getElementById("scopuskeyinput").value);
    checkKey("scopusValidation");
  break;

  case "Altmetric":
keytar.setPassword("Altmetric",userName,document.getElementById("altmetrickeyinput").value);
  checkKey("altmetricValidation");
break;

case "Twitter":
keytar.setPassword("Twitter",userName,document.getElementById("twitterkeyinput").value);
  checkKey("twitterValidation");
break;

case "OAbutton":
keytar.setPassword("OAbutton",userName,document.getElementById("OAbutton").value);
  checkKey("openAccessValidation");
break;

}

getUserData();
}

const checkKey = (service,status) => {

let success = false;

switch (service) {

    case "zoteroAPIValidation":
      if (status === undefined) {
        zoteroCollectionRetriever();
      }
    break;
  
    case "scopusValidation":
    if (status === undefined) {
        scopusBasicRetriever(true)
    }

    break;
    case "altmetricValidation":
    
    break;

    case "twitterValidation":
    
    break;
  
    case "openAccessValidation":

    break;

}

success = status;

if (success){
  document.getElementById(service).style.color = "green";
  document.getElementById(service).innerHTML = "check_circle_outline";
} else {
  document.getElementById(service).style.color = "red";
  document.getElementById(service).innerHTML = "highlight_off";
}

}