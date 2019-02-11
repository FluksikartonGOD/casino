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

    const add_degree = 1800;
    const winHistory = [];

    let lastDegree = 0;

    var socket = io.connect('/');
    socket.on('connect', function (data) {
        socket.on("game", function (event) {
            console.log(event)
            if (event.result) {

                const win = event.result;
                const lastWin = winHistory.length ? winHistory[winHistory.length - 1] : null;
                let totalDegree
                if (lastWin) {
                    const diff = win - lastWin;
                    if (diff >= 0) {
                        totalDegree = diff * 10;
                    } else {
                        totalDegree = (36 + diff) * 10;
                    }
                } else {
                    totalDegree = win * 10;
                }
                lastDegree = lastDegree + add_degree + totalDegree;
                wheel.style.transform = `rotate(${-lastDegree}deg)`
                winHistory.push(win)
            }
            // if (event.state === 'betting') {
            //     wheel.style.transform = `rotate(0deg)`
            // }
        });
    });
})();
