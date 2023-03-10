const container = document.getElementById("container");
const title = document.createElement("h1");

const grid = document.createElement("div");
const map = document.createElement("div");

const size = 10;
const [black, white] = [
    "https://em-content.zobj.net/thumbs/240/facebook/65/medium-black-circle_26ab.png",
    "https://em-content.zobj.net/thumbs/240/facebook/65/medium-white-circle_26aa.png"
];

let mark = 0;

let sec;
let timer;

let turn = 1;
let win = 0;

let check = 0;

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
}

function checkWin() {
    win = win == 0 ? checkHori() : win;

    if (win !== 0) {
        alert(`${win === 1 ? "You" : "AI"} WIN!`);
    }
    else if (mark === size * size) {
        alert(`Draw~`);
    }
    else {
        turn = turn == 1 ? 2 : 1;
    }

    if (turn == 2 && win === 0) {
        sec = 1;
        timer = setInterval(countDown, 1000);

    }
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
            // cross check 
            let count = 0;
            for (let i = -1; i <= 1; i++) {
                const targetY = map.querySelector(`#y${y + i}x${x}`);
                if (y + i >= 0 && y + i < size && targetY.className === `block ${turn}`) {
                    count++;
                }
                const targetX = map.querySelector(`#y${y}x${x + i}`);
                if (x + i >= 0 && x + i < size && targetX.className === `block ${turn}`) {
                    count++;
                }
            } 

            console.log("check: ", n ++);

            if (mark == 1 || count >= 1 || n == 100) {
                block.setAttribute("style", `background-image: url('${white}')`);
                block.classList.add(turn);
                checkWin();
                mark++;
                break;
            }
        }
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
                if (count == 5) {
                    return turn;
                }
            }
        }
    }
    return 0;
}

function setPosition() {
    const width = window.innerWidth;
    const position = (width - 410) / 2;

    title.setAttribute("style", `top: ${20}px; left: ${position + 178}px;`);
    grid.setAttribute("style", `top: ${120}px; left: ${position}px;`);
    map.setAttribute("style", `top: ${120 + 19}px; left: ${position + 19}px;`);

}

window.addEventListener("resize", e => {
    setPosition();
});