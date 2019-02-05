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
          document.getElementById("zoterokeyinput").value = keytar.getPassword("Zotero",zoteroUser);
          document.getElementById("scopuskeyinput").value = keytar.getPassword("Scopus",userName);
          document.getElementById("altmetrickeyinput").value = keytar.getPassword("Altmetric",userName);
          document.getElementById("twitterkeyinput").value = keytar.getPassword("Twitter",userName);
          document.getElementById("geocodinginput").value = keytar.getPassword("Geocoding",userName);

    });
}
getUserData();

const updateUserData = () => {
      let userName = document.getElementById("userNameInput").value;
      let userMail = document.getElementById("userMailInput").value;
      let zoteroUser = document.getElementById("zoterouserinput").value;
      let zoteroApiKey = document.getElementById("zoterokeyinput").value;
      let scopusApiKey = document.getElementById("scopuskeyinput").value;
      let altmetricApiKey = document.getElementById("altmetrickeyinput").value;
      let twitterApiKey = document.getElementById("twitterkeyinput").value;
      let geocodingApiKey = document.getElementById("geocodinginput").value;


//Zotero
keytar.setPassword("Zotero",zoteroUser,zoteroApiKey);

keytar.setPassword("Scopus",userName,scopusApiKey);

keytar.setPassword("Altmetric",userName,altmetricApiKey);

keytar.setPassword("Geocoding",userName,geocodingApiKey);

keytar.setPassword("Twitter",userName,twitterApiKey);

var user = {"UserName" : userName, "UserMail" : userMail, "ZoteroID" : zoteroUser};
var data = JSON.stringify(user);
fs.writeFile(
  userDataPath +'/userID/user-id.json',
   data,
    'utf8',
    (err) => {if (err) throw err;
  console.log('User data saved');
  })

document.getElementById("user-button").style.transition = "all 1s ease-out";
document.getElementById("user-button").style.backgroundPosition = "right bottom";
document.getElementById("user-button").style.color = "black";
document.getElementById("user-button").innerText = "User credentials updated";

getUserData();
}
