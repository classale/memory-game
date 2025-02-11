// Code for the start form
const startdivs = document.querySelectorAll(".startForm > div");
const grid = document.querySelector(".grid");
let size = 3;
let lastSelect = null;
let lastElements = []
for (let startdiv of startdivs) {
	const buttons = startdiv.querySelectorAll("button");
	for (let button of buttons) {
		button.addEventListener("click", () => {
			for (let newbutton of buttons) {
				newbutton.classList.remove("active");
			}
			button.classList.add("active");
		});
	}
}

document.querySelector(".start").addEventListener("click", start);

function start() {
	document.querySelector(".startFormContainer").remove();
	const buttons = [];
	for (let i = 0; i < size ** 2; i++) {
        const button = document.createElement("button");
		button.innerHTML = Math.ceil((i + 1) / 2);
		buttons.push(button);
	}
	buttons.sort(() => Math.random() - 0.5);
	for (let button of buttons) grid.appendChild(button);
	grid.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;
	for (let button of buttons) {
        button.addEventListener("click", (e) => {
            if(lastElements.length == 2) {
                if(lastElements[0].innerHTML != lastElements[1].innerHTML) {
                    for(let el of lastElements) {
                        el.classList.remove("revealed")
                    }
                }
                lastElements = []
                
            };
			if (!button.classList.contains("revealed")) {
				let reset = false;
				button.classList.add("revealed");
				lastElements.push(button)
				lastSelect = Number(button.innerHTML);
				lastSelectedElement = button;
				if (reset) {
					lastSelect = null;
				}
			}
            if(lastElements.length == 2) {
                if(lastElements[0].innerHTML == lastElements[1].innerHTML) {
                    for(let button of buttons) {
                        button.classList.remove("yellow")
                    }
                    for(let el of lastElements) {
                        el.classList.add("yellow")
                    }
                }
            };
		});
	}
}