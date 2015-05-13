var net = require('net');

// my "fake" devtools server will listen on 9223
var HOST = '127.0.0.1';
var PORT = 9223;

net.createServer(function(sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    var client = new net.Socket();

    // it will relay messages "outbound" to 9222 where the real devtools server is.....
    client.connect(9222, HOST, function() {

        console.log('CONNECTED TO: ' + HOST + ':' + 9222);
        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
        //client.write('I am Chuck Norris!');

        // when we get an incoming packet to the "fake" devtools server
        sock.on('data', function(data) {

            console.log('DATA ' + sock.remoteAddress + ': ' + data);
            // write that packet out to the real devtools server
            client.write(data);
        });

        // when we get packets back from the real devtools server
        client.on('data', function(data) {
            // write those packets back to the client
            sock.write(data);
        });

        // Add a 'close' event handler to this instance of socket
        sock.on('close', function(data) {
            console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
        });

    });




}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

