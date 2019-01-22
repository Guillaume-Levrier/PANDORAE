onconnect = function(e) {
  var port = e.ports[0];

  port.onmessage = function(e) {
    console.log(e);
    var workerResult = 'the shared worker works';
    port.postMessage(workerResult);
  }

}
