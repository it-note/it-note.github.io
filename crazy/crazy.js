const left = 37;
const right = 39;
const up = 38;
const down = 40;
const space = 32;
const q = 81;

const size = 10;
const map = document.getElementById("map");

const bombCnt = 0;
const bombYx = [];

let pY = 0;
let pX = 0;

window.addEventListener("keydown", e => {
    const key = e.keyCode;
    action(key);
});

map.addEventListener("click", e => {
    const id = e.target.id;
    const y = parseInt(id.charAt(1));
    const x = parseInt(id.charAt(3));

    let key = 0;
    if (y === pY) {
        if (x < pX) {
            key = left;
        }
        else if (x > pX) {
            key = right;
        }
    }
    else {
        if (y > pY) {
            key = down;
        }
        else if (y < pY) {
            key = up;
        }
    }
    action(key);
});

map.addEventListener("dblclick", e => {
    action(space);
})

setGame();
function setGame() {
    setMap();
    setBricks();
    setPlayer();
}

function setMap() {
    for (let i = 0; i < size; i++) {
        const row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < size; j++) {
            const id = `y${i}x${j}`;
            const block = document.createElement("div");
            block.id = id;
            block.className = "block";
            row.append(block);
        }
        map.append(row);
    }
}

function setBricks() {
    let count = Math.floor(Math.random() * 10) + 10;

    while (count > 0) {
        const rY = Math.floor(Math.random() * size);
        const rX = Math.floor(Math.random() * size);

        const block = map.querySelector(`#y${rY}x${rX}`);

        if (block.className === "block") {
            block.className = "brick";
            count--;
        }
    }
}

function setPlayer() {
    while (true) {
        const rY = Math.floor(Math.random() * size);
        const rX = Math.floor(Math.random() * size);

        const block = map.querySelector(`#y${rY}x${rX}`);

        if (block.className === "block") {
            block.className = "player";
            pY = rY;
            pX = rX;
            break;
        }
    }
}

function action(key) {
    let y = pY;
    let x = pX;

    if (key === left) {
        x--;
    }
    else if (key === right) {
        x++;
    }
    else if (key === up) {
        y--;
    }
    else if (key === down) {
        y++;
    }

    if (y < 0 || y >= size || x < 0 || x >= size || map.querySelector(`#y${y}x${x}`).className === "brick" || map.querySelector(`#y${y}x${x}`).className === "bomb") {
        return;
    }

    if (key === space) {
        console.log("install");
        map.querySelector(`#y${pY}x${pX}`).className = "bomb";
    }

    if (key === q) {

    }

    if (map.querySelector(`#y${pY}x${pX}`).className !== "bomb") {
        map.querySelector(`#y${pY}x${pX}`).className = "block";
    }
    pY = y;
    pX = x;
    if (map.querySelector(`#y${pY}x${pX}`).className !== "bomb") {
        map.querySelector(`#y${pY}x${pX}`).className = "player";
    }
}