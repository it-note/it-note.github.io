const container = document.getElementById("container");
const title = document.createElement("h1");

const grid = document.createElement("div");
const map = document.createElement("div");

const resetBtn = document.createElement("button");
resetBtn.className = "reset";
resetBtn.innerText = "reset";
resetBtn.addEventListener("click", e => {
    console.log("reset");
    location.reload();
});
container.append(resetBtn);

const size = 10;
const [black, white] = [
    "https://em-content.zobj.net/thumbs/240/facebook/65/medium-black-circle_26ab.png",
    "https://em-content.zobj.net/thumbs/240/facebook/65/medium-white-circle_26aa.png"
];

let mark = 0;

let sec;
let timer;

let turn = 2;
let win = 0;

let y = 0;
let x = 0;

setMap();
function setMap() {
    const width = window.innerWidth;
    const position = (width - 410) / 2;

    title.innerText = "오목";
    container.append(title);

    // grid
    grid.className = "grid";
    for (let i = 0; i < size + 1; i++) {
        const line = document.createElement("div");
        line.className = "line";
        for (let j = 0; j < size + 1; j++) {
            const block = document.createElement("div");
            block.className = "block";
            line.append(block);
        }
        grid.append(line);
    }
    container.append(grid);

    // map
    map.className = "map";
    for (let i = 0; i < size; i++) {
        const line = document.createElement("div");
        line.className = "line";
        for (let j = 0; j < size; j++) {
            const id = `y${i}x${j}`;
            const block = document.createElement("div");
            block.className = "block";
            block.id = id;

            block.addEventListener("click", e => {
                if (block.style.backgroundImage === "" && turn == 1 && win === 0) {
                    block.setAttribute("style", `background-image: url('${black}')`);
                    block.classList.add(turn);
                    checkWin();
                    mark++;
                }
            })

            line.append(block);
        }
        map.append(line);
    }
    container.append(map);
    setPosition();
    
    randomMarking();
}

function checkWin() {
    win = win === 0 ? checkHori() : win;
    win = win === 0 ? checkVerti() : win;
    win = win === 0 ? checkDiag() : win;
    win = win == 0 ? checkReverse() : win;

    if (win !== 0) {
        alert(`${win === 1 ? "You" : "AI"} WIN!`);
        resetBtn.style.color = "whitesmoke";
        resetBtn.style.backgroundColor = "#E7B10A";
    }
    else if (mark === size * size) {
        alert(`Draw~`);
        resetBtn.style.color = "whitesmoke";
        resetBtn.style.backgroundColor = "#DF7857";
    }
    else {
        turn = turn == 1 ? 2 : 1;
    }

    if (turn == 2 && win === 0) {
        sec = 1;
        timer = setInterval(countDown, 1000);

    }
}

function checkHori() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - 4; j++) {
            const block = map.querySelector(`#y${i}x${j}`);
            if (block.className === `block ${turn}`) {
                let count = 0;
                for (let k = 0; k < 5; k++) {
                    const target = map.querySelector(`#y${i}x${j + k}`);
                    if (target.className === `block ${turn}`) {
                        count++;
                    }
                }
                if (count === 5) {
                    return turn;
                }
            }
        }
    }
    return 0;
}

function checkVerti() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - 4; j++) {
            const block = document.querySelector(`#y${j}x${i}`);
            if (block.className === `block ${turn}`) {
                let count = 0;
                for (let k = 0; k < 5; k++) {
                    const target = map.querySelector(`#y${j + k}x${i}`);
                    if (target.className === `block ${turn}`) {
                        count++;
                    }
                }
                if (count === 5) {
                    return turn;
                }
            }
        }
    }
    return 0;
}

function checkDiag() {
    for(let i=0; i<size -4; i++) {
        for(let j=0; j<size -4; j++) {
            const block = document.querySelector(`#y${i}x${j}`);

            if (block.className === `block ${turn}`) {
                let count = 0;
                for (let k = 0; k < 5; k++) {
                    const target = map.querySelector(`#y${i + k}x${j + k}`);
                    if (target.className === `block ${turn}`) {
                        count++;
                    }
                }
                if (count === 5) {
                    return turn;
                }
            }
        }
    }
    return 0;
}

function checkReverse() {
    for (let i = 4; i < size; i++) {
        for (let j = 0; j < size - 4; j++) {
            const block = document.querySelector(`#y${i}x${j}`);

            if (block.className === `block ${turn}`) {
                let count = 0;
                for (let k = 0; k < 5; k++) {
                    const target = map.querySelector(`#y${i - k}x${j + k}`);
                    if (target.className === `block ${turn}`) {
                        count++;
                    }
                }
                if (count === 5) {
                    return turn;
                }
            }
        }
    }
    return 0;
}

function countDown() {
    sec--;
    if (sec <= 0) {
        clearInterval(timer);
        randomMarking();
    }
}

function randomMarking() {
    let n = 0;
    while (true) {
        const y = Math.floor(Math.random() * 10);
        const x = Math.floor(Math.random() * 10);

        const block = map.querySelector(`#y${y}x${x}`);

        if (block.className === "block") {
            let countMine = 0;
            let countOpponent = 0;
            for (let i = -1; i <= 1; i++) {

                const targetY = map.querySelector(`#y${y + i}x${x}`);
                if (y + i >= 0 && y + i < size) {
                    if (targetY.className === `block ${turn}`) {
                        countMine++;
                    }
                    else if (targetY.className !== "block") {
                        countOpponent++;
                    }
                }

                const targetX = map.querySelector(`#y${y}x${x + i}`);
                if (x + i >= 0 && x + i < size) {
                    if (targetX.className === `block ${turn}`) {
                        countMine++;
                    }
                    else if (targetX.className !== "block") {
                        countOpponent++;
                    }
                }

                const targetYX = map.querySelector(`#y${y + i}x${x + i}`);
                if (y + i >= 0 && y + i < size && x + i >= 0 && x + i < size) {
                    if (targetX.className === `block ${turn}`) {
                        countMine++;
                    }
                    else if (targetX.className !== "block") {
                        countOpponent++;
                    }
                }
            }

            if (countMine >= 1 || countOpponent >= 1 || n == 100) {
                block.setAttribute("style", `background-image: url('${white}')`);
                block.classList.add(turn);
                checkWin();
                mark++;
                break;
            }

            n++
        }
    }
}

function setPosition() {
    const width = window.innerWidth;
    const position = (width - 410) / 2;

    title.setAttribute("style", `top: ${20}px; left: ${position + 178}px;`);
    grid.setAttribute("style", `top: ${120}px; left: ${position}px;`);
    map.setAttribute("style", `top: ${120 + 19}px; left: ${position + 19}px;`);
    resetBtn.setAttribute("style", `top: ${560}px; left: ${position + 178}px;`);

}

window.addEventListener("resize", e => {
    setPosition();
});