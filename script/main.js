// Code for the start form
const startdivs = document.querySelectorAll(".startForm > div"),
    info = document.querySelector(".info"),
    grid = document.querySelector(".grid"),
    options = { size: "4x4", players: "1", theme: "Numbers" },
    images = [];
let turn = 0;

for(let btn of document.querySelectorAll(".restart")) btn.addEventListener("click", start);
for(let btn of document.querySelectorAll(".newgame")) btn.addEventListener("click", () => location.href = location.href);
for(let btn of document.querySelectorAll(".menu, .burgerContainer > button")) btn.addEventListener("click", () => document.querySelector(".burger").classList.toggle("active"));

for (let i = 1; i < 11; i++) {
    fetch(`../assets/${i}.svg`).then((req) => {
        req.text().then((text) => {
            images.push(text);
        });
    });
}

images.sort(() => Math.random() - 0.5);

(lastSelect = null), (lastElements = []);

for (let startdiv of startdivs) {
    const buttons = startdiv.querySelectorAll("button");
    for (let button of buttons) {
        button.addEventListener("click", () => {
            for (let newbutton of buttons) {
                newbutton.classList.remove("active");
            }
            button.classList.add("active");
            options[button.parentElement.parentElement.className] =
                button.innerHTML;
        });
    }
}

document.querySelector(".start").addEventListener("click", start);

function createInfoBox(text, mbText, className, defaultValue) {
    const box = document.createElement("div");
    box.classList.add("infobox");
    const label = document.createElement("p");
    label.innerHTML = text;
    label.classList.add("pc");
    const mbLabel = document.createElement("p");
    mbLabel.innerHTML = mbText;
    mbLabel.classList.add("mobile");
    box.classList.add(className);
    label.classList.name = "text";
    const value = document.createElement("h2");
    value.innerHTML = defaultValue;
    value.classList.add("value");
    box.appendChild(label);
    box.appendChild(mbLabel);
    box.appendChild(value);
    return box;
}

function createPopup(players) {
    const popup = document.createElement("div");
    popup.classList.add("resultPopup");
    const h1 = document.createElement("h1");
    const p = document.createElement("p");
    if (players == 1) {
        h1.innerHTML = "You did it!";
        p.innerHTML = "Game over! Here's how you got on...";
        const popupInfo = document.createElement("div");
        const time = document.createElement("div");
        const timeP = document.createElement("p");
        timeP.innerHTML = "Time Elapsed";
        const timeValue = document.createElement("h3");
        timeValue.innerHTML = `${minutes}:${String(seconds).padStart(2, "0")}`;
        time.appendChild(timeP);
        time.appendChild(timeValue);
        const moves = document.createElement("div");
        const movesP = document.createElement("p");
        movesP.innerHTML = "Moves Taken";
        const movesValue = document.createElement("h3");
        movesValue.innerHTML = `${
            document.querySelector(".moves .value").innerHTML
        } Moves`;
		moves.classList.add("entry")
		time.classList.add("entry")

        moves.appendChild(movesP);
        moves.appendChild(movesValue);
        popupInfo.appendChild(moves);
        popupInfo.appendChild(time);
        popupInfo.classList.add("results")
		popup.appendChild(h1);
        popup.appendChild(p);
        popup.appendChild(popupInfo);
    } else {
        const scores = {};
        for (let el of document.querySelectorAll(".infobox")) {
            const value = parseInt(el.querySelector(".value").innerHTML);
            const name = el.querySelector(".mobile").innerHTML[1];
            scores[name] = value;
        }
        let maxScore = 0;
        let isTie = false;
        let playerScore = 0;
        for (const [key, value] of Object.entries(scores)) {
            isTie = false;
            console.log(scores);
            if (maxScore < value) {
                maxScore = value;
                playerScore = key;
            } else if (maxScore == value) {
                isTie = true;
            }
        }
        if (!isTie) {
            h1.innerHTML = `Player ${playerScore} won!`;
        } else {
            h1.innerHTML = `It's a tie!`;
        }
        p.innerHTML = "Game over! Here are the results...";
        const results = document.createElement("div");
		results.classList.add("results")
        const entries = Object.entries(scores);
        entries.sort((a, b) => b[1] - a[1]);
        for (let entry of entries) {
            const entryDiv = document.createElement("div");
			entryDiv.classList.add("entry")
            const text = document.createElement("p");
            text.innerHTML = `Player ${entry[0]}${
                entry[1] == maxScore ? " (Winner!)" : ""
            }`;
            const pairs = document.createElement("h3");
            pairs.innerHTML = `${entry[1]} Pairs`;
            if (entry[1] == maxScore) {
                entryDiv.classList.add("black");
            }
            entryDiv.appendChild(text);
            entryDiv.appendChild(pairs);
            results.appendChild(entryDiv);
        }
        popup.appendChild(h1);
        popup.appendChild(p);
        popup.appendChild(results);
    }
    const actions = document.createElement("div");
    const restart = document.createElement("button");
    restart.innerHTML = "Restart";
    restart.classList.add("restart");
	restart.addEventListener("click", start)
    const newGame = document.createElement("button");
    newGame.innerHTML = "Setup new game";
    newGame.classList.add("newgame");
	newGame.addEventListener("click", () => {location.href = location.href})
    actions.appendChild(restart);
    actions.appendChild(newGame);
	actions.classList.add("actions")
	const containerDiv = document.createElement("div")
	containerDiv.classList.add("popupContainer")
    popup.appendChild(actions);
	containerDiv.appendChild(popup);
    return containerDiv;
}

let interval = null;
let time = 0;
let elapsedTime = Date.now() - time;
let seconds = Math.floor(elapsedTime / 1000) % 60;
let minutes = Math.floor(elapsedTime / 60000);

function start() {
	document.querySelector(".grid").innerHTML = "";
	document.querySelector(".info").innerHTML = "";
    const size = parseInt(options["size"][0]);
    if (parseInt(options["players"]) == 1) {
        info.appendChild(createInfoBox("Time", "Time", "time", "0:00"));
        info.appendChild(createInfoBox("Moves", "Moves", "moves", "0"));
        clearInterval(interval);
        let time = Date.now();
        interval = setInterval(() => {
            elapsedTime = Date.now() - time;
            seconds = Math.floor(elapsedTime / 1000) % 60;
            minutes = Math.floor(elapsedTime / 60000);
            document.querySelector(
                ".time .value"
            ).innerHTML = `${minutes}:${String(seconds).padStart(2, "0")}`;
        }, 0);
    } else {
        for (let i = 0; i < parseInt(options["players"]); i++) {
            info.appendChild(
                createInfoBox(
                    `Player ${i + 1}`,
                    `P${i + 1}`,
                    `player${i + 1}`,
                    "0"
                )
            );
        }
        info.querySelector("div:first-child").classList.add("active");
    }
		document.querySelector(".popupContainer")?.remove();
		document.querySelector(".startFormContainer")?.remove();
    const buttons = [];
    for (let i = 0; i < size ** 2; i++) {
        const button = document.createElement("button");
        if (options["theme"] == "Numbers") {
            button.innerHTML = Math.ceil((i + 1) / 2);
        } else {
            button.innerHTML = images[Math.floor(i / 2)];
        }
        buttons.push(button);
    }
    buttons.sort(() => Math.random() - 0.5);
    for (let button of buttons) grid.appendChild(button);
    grid.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;
    for (let button of buttons) {
        button.addEventListener("click", (e) => {
            console.log(document.querySelectorAll(".revealed").length);
            if (document.querySelectorAll(".revealed").length == size ** 2)
                return;
            if (lastElements.length == 2) {
                if (lastElements[0].innerHTML != lastElements[1].innerHTML) {
                    for (let el of lastElements) {
                        el.classList.remove("revealed");
                    }
                } else {
                    for (let el of lastElements) {
                        if (el.classList.contains("revealed")) {
                            el.classList.add("found");
                        }
                    }

                    if (parseInt(options["players"]) != 1) {
                        const currentPlayer =
                            document.querySelectorAll(".infobox .value")[turn];
                        currentPlayer.innerHTML =
                            parseInt(currentPlayer.innerHTML) + 1;
                    }
                }
                if (!button.classList.contains("revealed")) {
                    for (let el of lastElements) {
                        el.classList.remove("yellow");
                    }
                }
                if (document.querySelectorAll(".found").length != size ** 2) {
                    if (parseInt(options["players"]) == 1) {
                        const moves = document.querySelector(".moves .value");
                        moves.innerHTML = parseInt(moves.innerHTML) + 1;
                    } else {
                        for (let el of document.querySelectorAll(".infobox")) {
                            el.classList.remove("active");
                        }
                        document
                            .querySelectorAll(".infobox")
                            [
                                (turn = ++turn % parseInt(options["players"]))
                            ].classList.add("active");
                    }
                }
                lastElements = [];
            }
            if (!button.classList.contains("revealed")) {
                let reset = false;
                button.classList.add("revealed");
                button.classList.add("yellow");
                lastElements.push(button);
                lastSelect = Number(button.innerHTML);
                lastSelectedElement = button;
                if (reset) {
                    lastSelect = null;
                }
            }
            if (document.querySelectorAll(".revealed").length == size ** 2) {
				clearInterval(interval)
                document.body.appendChild(
                    createPopup(parseInt(options["players"]))
                );
                return;
            }
        });
    }
}