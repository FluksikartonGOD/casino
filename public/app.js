(function () {
    var socket = io.connect('/');
    socket.on('connect', function(data) {
        socket.on("game", function(event) {
            console.log(event);
        });
    });
})();