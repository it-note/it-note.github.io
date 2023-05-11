const left = 37;
const right = 39;
const up = 38;
const down = 40;
const install = 32;
const explode = 81;

const size = 10;

let bombCnt = 5;
let installCnt = 0;
const installYx = [];

let pY = 0;
let pX = 0;

$(window).load(function () {
    $("#bomb-count").text(bombCnt);
    $("#install-count").text(installCnt);
});

$(window).keydown(e => {
    const key = e.keyCode;
    action(key);
});

$("#map").click(e => {
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

$("#map").dblclick(e => {
    action(install);
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
        $("#map").append(row);
    }
}

function setBricks() {
    let count = Math.floor(Math.random() * 10) + 10;

    while (count > 0) {
        const rY = Math.floor(Math.random() * size);
        const rX = Math.floor(Math.random() * size);

        const id = `#y${rY}x${rX}`;

        if ($(id).attr("class") === "block") {
            $(id).attr("class", "brick");
            count--;
        }
    }
}

function setPlayer() {
    while (true) {
        const rY = Math.floor(Math.random() * size);
        const rX = Math.floor(Math.random() * size);

        const id = `#y${rY}x${rX}`;

        if ($(id).attr("class") === "block") {
            $(id).attr("class", "player");
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

    if (y < 0 || y >= size || x < 0 || x >= size || $(`#y${y}x${x}`).attr("class") === "brick" || $(`#y${y}x${x}`).attr("class") === "bomb") {
        return;
    }

    if (key === install && bombCnt > 0) {
        $(`#y${pY}x${pX}`)[0].className = "bomb";
        yx = [pY, pX];
        installYx.push(yx);
        installCnt++;
        bombCnt--;
    }

    if (key === explode) {
        pang();
    }

    if ($(`#y${y}x${x}`)[0].className === "item") {
        bombCnt++;
    }

    if ($(`#y${pY}x${pX}`)[0].className !== "bomb") {
        $(`#y${pY}x${pX}`)[0].className = "block";
    }
    pY = y;
    pX = x;
    if ($(`#y${pY}x${pX}`)[0].className !== "bomb") {
        $(`#y${pY}x${pX}`)[0].className = "player";
    }

    $("#bomb-count").text(bombCnt);
    $("#install-count").text(installCnt);
}

function pang() {
    let explodeCnt = 1;
    while (explodeCnt > 0 && installCnt > 0) {
        const y = installYx[0][0];
        const x = installYx[0][1];

        for (let i = -1; i <= 1; i++) {
            if (y + i >= 0 && y + i < size) {
                const blockY = $(`#y${y + i}x${x}`)[0];
                $(`#y${y + i}x${x}`).addClass("water");

                if (blockY.classList.contains("brick")) {
                    const item = Math.floor(Math.random() * 2);
                    if (item === 1) {
                        blockY.classList.add("item");
                        blockY.classList.remove("brick");
                        bombCnt ++;
                    }
                }
                else if (blockY.classList.contains("bomb")) {
                    let index = -1;
                }
                if (!blockY.classList.contains("item")) {
                    blockY.className = "block";
                }
                blockY.classList.remove("water");
            }
            
        }
        installYx.shift();
        installCnt--;
        explodeCnt--;
    }
}