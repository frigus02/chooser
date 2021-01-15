const MIN_PLAYERS = 2;
const CHOOSE_DELAY_MS = 2000;
const RESET_DELAY_MS = 1000;

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const description = document.getElementById("description");
const ariaLive = document.getElementById("live-region");
const version = document.getElementById("version");
const updateAvailable = document.getElementById("update-available");

const players = new Map();
let chosenPlayer;
const chosenPlayerAnimation = {
	startTime: 0,
	startValue: 0,
};

const ariaLiveLog = (msg) => {
	const element = document.createElement("div");
	element.textContent = msg;
	ariaLive.append(element);
};

const ariaLiveReset = () => {
	ariaLive.innerHTML = "";
	ariaLiveLog("Reset");
};

const resizeCanvas = () => {
	canvas.width = Math.floor(window.innerWidth);
	canvas.height = Math.floor(window.innerHeight);
};
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

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

const easeOutQuint = (t) => 1 + --t * t * t * t * t;

const draw = (function () {
	const draw = () => {
		// Reset
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (chosenPlayer !== undefined) {
			// Chosen Player
			description.hidden = true;
			const player = players.get(chosenPlayer);
			drawPlayer(player);

			const { startTime, startValue } = chosenPlayerAnimation;
			const endValue = 90;
			const elapsed = Date.now() - startTime;
			const duration = RESET_DELAY_MS;
			const t = elapsed / duration;
			const value =
				t < 1
					? startValue - (startValue - endValue) * easeOutQuint(t)
					: endValue;

			ctx.beginPath();
			ctx.fillStyle = color(player);
			ctx.rect(0, 0, canvas.width, canvas.height);
			ctx.arc(player.x, player.y, value, 0, 2 * Math.PI);
			ctx.fill("evenodd");

			return t < 1;
		} else if (players.size > 0) {
			// All players
			description.hidden = true;
			for (const player of players.values()) {
				drawPlayer(player);
			}

			return false;
		} else {
			// Help text
			description.hidden = false;
			return false;
		}
	};

	let running = false;
	const run = () => {
		if (draw()) {
			window.requestAnimationFrame(run);
		} else {
			running = false;
		}
	};
	return () => {
		if (!running) {
			window.requestAnimationFrame(run);
			running = true;
		}
	};
})();

const color = (index, alpha = 1) =>
	`hsla(${index * 222.5 + 348}, 100%, 51.4%, ${alpha})`;

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

const addPlayer = (id, x, y) => {
	const color = pickUnusedColor();
	players.set(id, { x, y, color });
	draw();
	ariaLiveLog(`Player ${id} added`);
};

const updatePlayer = (id, x, y) => {
	const player = players.get(id);
	if (player) {
		player.x = x;
		player.y = y;
		draw();
	}
};

const removePlayer = (id) => {
	players.delete(id);
	draw();
	ariaLiveLog(`Player ${id} removed`);
};

const choosePlayer = (function () {
	const choosePlayer = () => {
		if (players.size < MIN_PLAYERS) return;

		const choosen = Math.floor(Math.random() * players.size);
		chosenPlayer = Array.from(players.keys())[choosen];

		const player = players.get(chosenPlayer);
		chosenPlayerAnimation.startTime = Date.now();
		chosenPlayerAnimation.startValue = Math.max(
			player.x,
			canvas.width - player.x,
			player.y,
			canvas.height - player.y
		);

		draw();

		ariaLiveLog(`Player ${chosenPlayer} chosen`);
	};

	let timeout;
	return () => {
		window.clearTimeout(timeout);
		if (chosenPlayer === undefined && players.size >= MIN_PLAYERS) {
			timeout = window.setTimeout(choosePlayer, CHOOSE_DELAY_MS);
		}
	};
})();

const reset = (function () {
	const reset = () => {
		chosenPlayer = undefined;
		players.clear();
		ariaLiveReset();
		draw();
	};

	let timeout;
	return () => {
		window.clearTimeout(timeout);
		timeout = window.setTimeout(reset, RESET_DELAY_MS);
	};
})();

document.addEventListener("pointerdown", (e) => {
	addPlayer(e.pointerId, e.clientX, e.clientY);
	choosePlayer();
});
document.addEventListener("pointermove", (e) => {
	updatePlayer(e.pointerId, e.clientX, e.clientY);
});
const onPointerRemove = (e) => {
	if (chosenPlayer === e.pointerId) {
		reset();
	} else {
		removePlayer(e.pointerId);
		choosePlayer();
	}
};
document.addEventListener("pointerup", onPointerRemove);
document.addEventListener("pointercancel", onPointerRemove);

// Prevent page from scrolling.
// Chrome on Android immediately cancels pointer events if the page starts to
// scroll up or down. Because of Chrome's hiding url bar, the page does actually
// scroll, even though the page content is not enough to cause scroll bars.
// Calling preventDefault on all touchmove events helps here, but feels like a
// hack. Would be nice to find a better solution.
document.addEventListener(
	"touchmove",
	(e) => {
		e.preventDefault();
	},
	{ passive: false }
);

if ("serviceWorker" in navigator && location.hostname !== "localhost") {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js").catch((err) => {
			console.warn("ServiceWorker registration failed: ", err);
		});
	});
	navigator.serviceWorker.addEventListener("controllerchange", () => {
		updateAvailable.hidden = false;
	});
	navigator.serviceWorker.addEventListener("message", (e) => {
		if (e.data.version) {
			version.textContent = e.data.version;
		}
	});
	navigator.serviceWorker.ready.then((sw) => {
		sw.active.postMessage("version");
	});
}
