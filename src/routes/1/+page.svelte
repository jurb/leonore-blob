<script>
	import { getStroke } from 'perfect-freehand-for-svelte';
	import { getSvgPathFromStroke } from '$lib/utils';
	import { onMount } from 'svelte';

	let points = [];
	let width = 700;
	let height = 700;
	let isWandering = false;
	let lastMouseX = 0;
	let lastMouseY = 0;
	const maxPoints = 250;
	const delayMs = 230;

	// Wandering parameters
	const wanderChance = 0.01; // Chance to start wandering on each frame
	const wanderDuration = 2000; // How long to wander in ms
	const returnDuration = 1000; // How long to take to return to mouse
	let wanderVelocityX = 0;
	let wanderVelocityY = 0;

	onMount(() => {
		const updateDimensions = () => {
			width = window.innerWidth;
			height = window.innerHeight;
		};
		window.addEventListener('resize', updateDimensions);
		return () => window.removeEventListener('resize', updateDimensions);
	});

	function handlePointerMove(e) {
		lastMouseX = e.pageX;
		lastMouseY = e.pageY;

		if (!isWandering) {
			setTimeout(() => {
				points = [...points, [e.pageX, e.pageY, e.pressure]].slice(-maxPoints);
				// points = [...points, [e.pageX, e.pageY, e.pressure]]
			}, delayMs);
		}
	}

	function startWandering() {
		if (isWandering) return;
		isWandering = true;

		// Set random velocities
		wanderVelocityX = (Math.random() - 0.5) * 20;
		wanderVelocityY = (Math.random() - 0.5) * 20;

		// Get current position (last point or mouse position)
		let currentX = points.length > 0 ? points[points.length - 1][0] : lastMouseX;
		let currentY = points.length > 0 ? points[points.length - 1][1] : lastMouseY;

		const wanderInterval = setInterval(() => {
			// Add some randomness to velocity
			wanderVelocityX += (Math.random() - 0.5) * 2;
			wanderVelocityY += (Math.random() - 0.5) * 2;

			// Keep velocities in bounds
			wanderVelocityX = Math.max(-20, Math.min(20, wanderVelocityX));
			wanderVelocityY = Math.max(-20, Math.min(20, wanderVelocityY));

			// Update position
			currentX += wanderVelocityX;
			currentY += wanderVelocityY;

			// Bounce off edges
			if (currentX < 0 || currentX > width) wanderVelocityX *= -1;
			if (currentY < 0 || currentY > height) wanderVelocityY *= -1;

			points = [...points, [currentX, currentY, 0.5]].slice(-maxPoints);
		}, 16); // 60fps-ish

		// Stop wandering after duration
		setTimeout(() => {
			clearInterval(wanderInterval);
			returnToMouse();
		}, wanderDuration);
	}

	function returnToMouse() {
		const startX = points[points.length - 1][0];
		const startY = points[points.length - 1][1];
		const startTime = Date.now();

		const returnInterval = setInterval(() => {
			const progress = (Date.now() - startTime) / returnDuration;
			if (progress >= 1) {
				clearInterval(returnInterval);
				isWandering = false;
				return;
			}

			// Ease back to mouse position
			const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
			const currentX = startX + (lastMouseX - startX) * easedProgress;
			const currentY = startY + (lastMouseY - startY) * easedProgress;

			points = [...points, [currentX, currentY, 0.5]].slice(-maxPoints);
		}, 16);
	}

	// Randomly decide to start wandering
	setInterval(() => {
		if (!isWandering && Math.random() < wanderChance) {
			startWandering();
		}
	}, 100);

	$: stroke = getStroke(points, {
		size: 35,
		thinning: 0,
		smoothing: 0.1,
		streamline: 1
	});

	$: pathData = getSvgPathFromStroke(stroke);
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 {width} {height}"
	style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; touch-action: none;"
	on:pointermove={handlePointerMove}
>
	<path d={pathData} />
</svg>

<article>
	<h1>Tool-Building With AI</h1>

	<p class="intro">
		Imagine a future where any software tool you need can be generated on the fly, completely free
		of charge, and custom-tailored to your specific needs and preferences. Whether it’s a tool for
		submitting your taxes, measuring data, or finding great restaurants near you—how might the world
		of software look if tools could be generated in a matter of minutes by everyone?
	</p>

	<p>
		The democratization of software creation has long been part of the vision for how humans and
		computers would interact. Alan Kay, renowned for his groundbreaking work on object-oriented
		programming and graphical user interfaces, envisioned a future where users would become
		creators—not just consumers—of technology.1 His vision focused on equipping users with powerful
		yet accessible tools to create their own software and media. Smalltalk exemplified this vision:
		a programming language that let users create and modify programs within a unified environment.
		Kay provided pre-written tools and examples, enabling people to build their own creative tools
		without needing extensive programming expertise.
	</p>
</article>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
	h1,
	p {
		font-family:
			Inter,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
	}

	.intro {
		font-size: 1.25rem;
	}

	article {
		max-width: 700px;
	}
</style>
