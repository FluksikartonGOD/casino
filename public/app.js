(function () {
    var socket = io.connect('/');
    socket.on('connect', function(data) {
        socket.on("game", function(event,data) {
            console.log(event);
            console.log(data);
        });
    });
})();