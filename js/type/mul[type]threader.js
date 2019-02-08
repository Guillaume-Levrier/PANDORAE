onconnect = (e) => {
  var port = e.ports[0];

 importScripts("../../node_modules/d3/dist/d3.min.js");    


  
  port.onmessage = (typeRequest) => {
    let type = typeRequest.data.kind;
    let datajson = typeRequest.data.data;


    switch (type) {
      case 'gazouillotype':
                 
            var data = datajson[0];
         

            // Convert dataset if it comes from scraping instead of a proper API request
            const scrapToApiFormat = (data) => {
                if(data[0].hasOwnProperty('username')) {
                      data.forEach(d=>{
                        d.from_user_name = d.username;
                        d.created_at = d.date;
                        d.retweet_count = d.retweets;
                        d.favorite_count = d.favorites;
                        delete d.username;
                        delete d.date;
                        delete d.retweets;
                        delete d.favorites;
                        })
                    data.reverse();
                  }
            }

            scrapToApiFormat(data);

            var meanRetweetsArray = [];

            data.forEach(d=>{
                      d.date = new Date(d.created_at);
                      d.timespan = new Date(Math.round(d.date.getTime()/600000)*600000);
                      if (d.retweet_count>0) {meanRetweetsArray.push(d.retweet_count)};
              })

              meanRetweetsArray.sort((a, b) => a - b);
              var median = meanRetweetsArray[parseInt(meanRetweetsArray.length/2)];

              var dataNest = d3.nest()
                                .key(d => {return d.timespan;})
                                .entries(data);

            const piler = () => {
                for (i = 0; i < dataNest.length; i++) {
                  let j = dataNest[i].values.length + 1;
                    for (k = 0; k < dataNest[i].values.length; k++) {
                      dataNest[i].values[k].indexPosition = j-1;
                      j--;
                    }
                }
              }

            piler();

            let res = {};
            res.dataNest = dataNest;
            res.editedData = data;
            res.median = median;
      port.postMessage(res);
        break;
    }

  }
  
}