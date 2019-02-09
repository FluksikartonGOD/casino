(function () {
    const wheel = document.querySelector('#inner-wheel')
    let color = 'red'
    for (let i = 1; i <= 36; i++) {
        const sector = document.createElement('div');
        sector.classList.add('sector');
        sector.style.transform = `rotate(${i * 10}deg)`;
        sector.style.borderColor = `${color} transparent`;

        const number = document.createElement('div');
        number.classList.add('sector-number');
        number.innerHTML = i;
        number.style.transform = `rotate(${i * 10}deg)`;

        wheel.appendChild(sector)
        wheel.appendChild(number);

        if (color === 'red') {
            color = 'black'
        } else {
            color = 'red'
        }
    }

    const default_degree = 1800;
    
    var socket = io.connect('/');
    socket.on('connect', function (data) {
        socket.on("game", function (event) {
            console.log(event)
            if (event.result) {
                const totalDegree = default_degree + event.result * 10;
                wheel.style.transform = `rotate(${-totalDegree}deg)`
            }
            if (event.state === 'betting') {
                wheel.style.transform = `rotate(0deg)`
            }
        });
    });
})();
