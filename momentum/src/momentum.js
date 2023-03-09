// 바닐라 JS 과정 프로젝트를 완료하고 Github Pages를 이용해 배포하세요.
// ㄴ 제출하실때 깃헙.io 포멧으로 제출 부탁드립니다!
// https://bonni-e.github.io/momentum/

// 실시간 시계                      [O]
// 로컬 스토리지를 사용한 로그인        [O]
// 로컬 스토리지를 사용한 투두리스트     [O]
// 랜덤 배경 이미지                  [O]
// 날씨와 위치(geolocation)         [O]
// 여러분의 CSS 실력을 뽐내주세요💖

let currentTime = 0;

const body = document.querySelector("body");
const root = document.getElementById("root");
const time = document.querySelector("#time");
const message = document.querySelector("#message");
const whether = document.querySelector(".whether");

const [cold, warm, hot] = ["#96CEB4", "#FFAD60", "#D9534F"];

// 1. clock 
setTimePerSecond();
const setTime = setInterval(setTimePerSecond, 1000);

function setTimePerSecond() {
    const now = new Date();
    // console.log(now.toLocaleString('ko-KR'));

    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    const str = `${h < 10 ? `0${h}` : `${h}`}:${m < 10 ? `0${m}` : `${m}`}:${s < 10 ? `0${s}` : `${s}`}`;

    time.innerText = str;
    currentTime = h;


    // 2. random background
    const backgroundState = localStorage.getItem("background");
    if (backgroundState === null || parseInt(backgroundState) === s) {
        setBackground();
        // localStorage.setItem("background", currentTime);
        localStorage.setItem("background", s);
    }
}

function setBackground() {
    const random = Math.floor(Math.random() * 10) + 1;
    body.setAttribute("style", `background-image : url('src/images/bg-${random}.jpeg')`);
}


// 3. login
const username = window.localStorage.getItem("username");

if (username !== null) {
    root.setAttribute("style", "display: block");

    let state = "";
    if (currentTime >= 4 && currentTime < 12) {
        state = "morning";
    }
    else if (currentTime >= 12 && currentTime < 18) {
        state = "afternoon";
    }
    else if (currentTime >= 18 && currentTime < 21) {
        state = "evening";
    }
    else {
        state = "night";
    }

    const welcomeStr = `Good ${state}, ${username}.`;
    message.innerText = welcomeStr;
}
else {
    const form = document.createElement("form");
    const h1 = document.createElement("h1");
    const input = document.createElement("input");
    const button = document.createElement("button");

    h1.innerText = "Hello, What's your name?"
    input.type = "text";
    input.id = "name"
    button.innerText = "Continue >";

    form.append(h1);
    form.append(input);
    form.append(button);

    form.addEventListener("submit", e => {
        e.preventDefault();
        const name = input.value;

        if (name !== "") {
            localStorage.setItem("username", name);
            location.reload();
        }
    });

    body.append(form);
}


// 4. todo list
const todoForm = document.querySelector(".todo-form");
const form = todoForm.querySelector("form");
const todoText = document.querySelector(".todo-text");
const list = todoText.querySelector(".list");
const checkbox = list.querySelector("#check");
const checkImg = list.querySelector("img");
const delBtn = list.querySelector("button");

todoText.setAttribute("style", "display : none");
checkImg.setAttribute("style", "display : none");
delBtn.setAttribute("style", "display : none");

list.addEventListener("mouseenter", e => {
    delBtn.setAttribute("style", "display : block");
    checkImg.setAttribute("style", "display : block");
});

list.addEventListener("mouseleave", e => {
    delBtn.setAttribute("style", "display : none");
    if (checkbox.checked === false) {
        checkImg.setAttribute("style", "display : none");
    }
});

checkImg.addEventListener("click", e => {
    if (checkbox.checked === false) {
        checkImg.setAttribute("src", "https://em-content.zobj.net/thumbs/240/toss-face/342/check-box-with-check_2611-fe0f.png");
        checkImg.setAttribute("style", "display : block");
    }
    else {
        checkImg.setAttribute("src", "https://em-content.zobj.net/thumbs/240/toss-face/342/white-square-button_1f533.png");
        checkImg.setAttribute("style", "display : none");
    }
});

delBtn.addEventListener("click", e => {
    localStorage.removeItem("todo");
    location.reload();
});

let todo = localStorage.getItem("todo");

if (todo !== null) {
    todoForm.setAttribute("style", "display : none");
    todoText.setAttribute("style", "display : block");
    todoText.querySelector("span").innerText = todo;
}

form.addEventListener("submit", e => {
    e.preventDefault();
    todo = form.querySelector("#todo").value;

    if (todo !== "") {
        todoForm.setAttribute("style", "display : none");
        todoText.setAttribute("style", "display : block");
        todoText.querySelector("span").innerText = todo;

        localStorage.setItem("todo", todo);
    }
});


// 5. whether api 
let lat = 0;
let lon = 0;

let city = "";
let temp = 0;
let desc = "";
let imgUrl = ""

window.onload = function () {
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.body.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude);
    console.log("Longitude: " + position.coords.longitude);

    lat = position.coords.latitude;     // 위도 
    lon = position.coords.longitude;    // 경도

    // get api
    $.ajax({
        method: 'get',
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=dd67246c48ce316a0eb8eb1ef7eaba20`,
        async: true
    })
        .done(res => {
            city = res.name;
            temp = Math.round((res.main.temp - 273.15) * 100) / 100; // K to C

            let result = "";
            res.weather.forEach(w => {
                desc = w.description;

                imgUrl = `http://openweathermap.org/img/wn/${w.icon}@2x.png`;

                result += `<div class="block"><img src=${imgUrl}><p><strong>${city}</strong><br><span>${temp}℃</span> ${desc}</p></div>`;
            });
            $(whether).append(result);

            const tempText = whether.querySelector(".block p span");
            if(temp < 10) {
                tempText.setAttribute("style", `color : ${cold}`)
            }
            else if(temp >= 10 && temp < 23) {
                tempText.setAttribute("style", `color : ${warm}`)
            }
            else if(temp >= 23) {
                tempText.setAttribute("style", `color : ${hot}`)
            }
        });
}