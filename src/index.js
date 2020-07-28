const MIN_PLAYERS = 2;
const CHOOSE_DELAY_MS = 2000;
const RESET_DELAY_MS = 1000;

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const description = document.getElementById("description");

const resizeCanvas = () => {
	canvas.width = Math.floor(window.innerWidth);
	canvas.height = Math.floor(window.innerHeight);
};
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const color = (index, alpha = 1) =>
	`hsla(${index * 222.5 + 348}, 100%, 51.4%, ${alpha})`;

const players = new Map();
document.addEventListener("pointerdown", (e) => {
	players.set(e.pointerId, {
		x: e.clientX,
		y: e.clientY,
		color: pickUnusedColor(),
	});

	triggerPlayerChoosing();
});
document.addEventListener("pointermove", (e) => {
	if (players.has(e.pointerId)) {
		players.set(e.pointerId, {
			...players.get(e.pointerId),
			x: e.clientX,
			y: e.clientY,
		});
	}
});
document.addEventListener("pointerup", (e) => {
	if (chosenPlayer === e.pointerId) {
		triggerReset();
	} else {
		players.delete(e.pointerId);
		triggerPlayerChoosing();
	}
});

const pickUnusedColor = () => {
	const alreadyChosenColors = Array.from(players.values()).map(
		(p) => p.color
	);
	let color = 0;
	while (alreadyChosenColors.includes(color)) {
		color++;
	}

	return color;
};

let chosenPlayer;
const choosePlayer = () => {
	if (players.size < MIN_PLAYERS) return;

	const choosen = Math.floor(Math.random() * players.size);
	chosenPlayer = Array.from(players.keys())[choosen];
};
let choosePlayerTimeout;
const triggerPlayerChoosing = () => {
	window.clearTimeout(choosePlayerTimeout);
	if (chosenPlayer === undefined && players.size >= MIN_PLAYERS) {
		choosePlayerTimeout = window.setTimeout(choosePlayer, CHOOSE_DELAY_MS);
	}
};

const reset = () => {
	chosenPlayer = undefined;
	players.clear();
};
let resetTimeout;
const triggerReset = () => {
	window.clearTimeout(resetTimeout);
	resetTimeout = window.setTimeout(reset, RESET_DELAY_MS);
};

const drawPlayer = (player) => {
	ctx.beginPath();
	ctx.strokeStyle = color(player.color);
	ctx.lineWidth = 10;
	ctx.arc(player.x, player.y, 50, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.fillStyle = color(player.color);
	ctx.arc(player.x, player.y, 35, 0, 2 * Math.PI);
	ctx.fill();
};

window.requestAnimationFrame(function draw() {
	// Reset
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if (chosenPlayer !== undefined) {
		// Chosen Player
		description.hidden = true;
		const player = players.get(chosenPlayer);
		drawPlayer(player);

		ctx.beginPath();
		ctx.fillStyle = color(player);
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.arc(player.x, player.y, 90, 0, 2 * Math.PI);
		ctx.fill("evenodd");
	} else if (players.size > 0) {
		// All players
		description.hidden = true;
		for (const player of players.values()) {
			drawPlayer(player);
		}
	} else {
		// Help text
		description.hidden = false;
	}

	window.requestAnimationFrame(draw);
});

if ("serviceWorker" in navigator && location.hostname !== "localhost") {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js").catch((err) => {
			console.warn("ServiceWorker registration failed: ", err);
		});
	});
}
