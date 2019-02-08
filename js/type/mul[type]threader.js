onconnect = (e) => {
  var port = e.ports[0];

  import * as d3 from "./node_modules/d3";

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

              var color = d3.scaleSequential(d3.interpolateBlues)
                            .clamp(true)
                            .domain([-median*2,median*10]);

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

            var firstDate = new Date(dataNest[0].key);
            var lastDate = new Date(dataNest[dataNest.length-1].key);
            domainDates.push(firstDate,lastDate);

            var totalPiles = (domainDates[1].getTime()-domainDates[0].getTime())/600000;

            x.domain(domainDates);
            y.domain([0,totalPiles/1.2]);

            x2.domain(domainDates);
            y2.domain([0, d3.max(data, d=> d.indexPosition)]);


            let radius = 0;

            const radiusCalculator = () => {
            for (var i = 0; i < dataNest.length; i++) {
              if (dataNest[i].values.length>2) {
              radius = (y(dataNest[i].values[1].indexPosition)-y(dataNest[i].values[0].indexPosition))/3;
            break;
                }
              }
            }

            radiusCalculator();
            let res = {};
            res.data = data;
            res.radius = radius;
      port.postMessage(res);
        break;
    }






  }
}