<script>
	import { getStroke } from 'perfect-freehand-for-svelte';
	import { getSvgPathFromStroke } from '$lib/utils';
	import Scroller from "@sveltejs/svelte-scroller";
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
  
	// Scroller bindings
	let index, offset, progress;
  
	// Blob animation variables
	let points = [];
	const blobSize = tweened(35, {
	  duration: 6000,
	  easing: t => t * (2 - t) // Ease out quad
	});
	let width = 700;
	let height = 700;
	const maxPoints = 500;
  
	// Wandering parameters
	let currentX = width / 2;
	let currentY = height / 2;
	let angle = Math.random() * Math.PI * 2;
	let speed = 2;
	const turnRate = 0.15;
  
	onMount(() => {
	  const updateDimensions = () => {
		width = window.innerWidth;
		height = window.innerHeight;
		currentX = width / 2;
		currentY = height / 2;
	  };
  
	  window.addEventListener('resize', updateDimensions);
	  updateDimensions();
  
	  // Animation loop
	  const animate = () => {
		if (progress > 0) { // Only animate when scrolling has started
		  blobSize.set(100);
		  
		  // Smoothly change direction
		  angle += (Math.random() - 0.5) * turnRate;
		  
		  // Update position
		  currentX += Math.cos(angle) * speed;
		  currentY += Math.sin(angle) * speed;
		  
		  // Bounce off edges with smooth transition
		  if (currentX < 0 || currentX > width) {
			angle = Math.PI - angle;
			currentX = Math.max(0, Math.min(width, currentX));
		  }
		  if (currentY < 0 || currentY > height) {
			angle = -angle;
			currentY = Math.max(0, Math.min(height, currentY));
		  }
		  
		  // Add new point
		  points = [...points, [currentX, currentY, 0.5]].slice(-maxPoints);
		}
		requestAnimationFrame(animate);
	  };
	  
	  animate();
	  
	  return () => {
		window.removeEventListener('resize', updateDimensions);
	  };
	});
  
	$: stroke = getStroke(points, {
	  size: $blobSize,
	  thinning: 0,
	  smoothing: 0.1,
	  streamline: 1
	});
  
	$: pathData = getSvgPathFromStroke(stroke);
  </script>
  
  <style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
	
	section {
	  height: 100vh;
	  max-width: 700px;
	  margin: 0 auto;
	  /* padding: 2rem; */
	}
  
	h1, h2, p {
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
  
	h1 {
	  font-size: 2.5rem;
	  /* margin-bottom: 2rem; */
	}
  
	h2 {
	  font-size: 1.75rem;
	  /* margin-top: 3rem; */
	  /* margin-bottom: 1.5rem; */
	}
  
	.intro {
	  font-size: 1.25rem;
	  line-height: 1.75;
	  /* margin-bottom: 2rem; */
	}
  
	p {
	  line-height: 1.6;
	  /* margin-bottom: 1.5rem; */
	}
  
	.background {
	  position: relative;
	  width: 100%;
	  height: 100%;
	}
  </style>
  
  <svelte:window bind:innerWidth={width} bind:innerHeight={height} />
  
  <Scroller top={0} bottom={0.8} bind:index bind:offset bind:progress>
	<div slot="background" class="background">
	  <svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 {width} {height}"
		style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none;"
	  >
		{#if progress > 0}
		  <path d={pathData} />
		{/if}
	  </svg>
	</div>
  
	<div slot="foreground">
	  <section>
		<h1>Tool-Building With AI</h1>
		<p class="intro">
		  Imagine a future where any software tool you need can be generated on the fly, completely free
		  of charge, and custom-tailored to your specific needs and preferences. Whether it's a tool for
		  submitting your taxes, measuring data, or finding great restaurants near you—how might the world
		  of software look if tools could be generated in a matter of minutes by everyone?
		</p>
	  </section>
  
	  <section>
		<h2>The Vision of Personal Computing</h2>
		<p>
		  The democratization of software creation has long been part of the vision for how humans and
		  computers would interact. Alan Kay, renowned for his groundbreaking work on object-oriented
		  programming and graphical user interfaces, envisioned a future where users would become
		  creators—not just consumers—of technology. His vision focused on equipping users with powerful
		  yet accessible tools to create their own software and media.
		</p>
		<p>
		  Smalltalk exemplified this vision: a programming language that let users create and modify
		  programs within a unified environment. Kay provided pre-written tools and examples, enabling
		  people to build their own creative tools without needing extensive programming expertise.
		</p>
	  </section>
  
	  <section>
		<h2>The Promise of AI-Assisted Development</h2>
		<p>
		  Today, we stand at the threshold of a new era in software development. Large language models
		  and AI assistants are beginning to bridge the gap between human intention and functional
		  code. These tools can understand natural language descriptions of desired functionality and
		  generate corresponding implementations, making software creation more accessible than ever
		  before.
		</p>
		<p>
		  This democratization of development could lead to an explosion of personalized tools,
		  each crafted to solve specific problems for individuals or small groups. Instead of
		  adapting our workflows to existing software, we might soon describe our ideal tools
		  and have them materialize before us.
		</p>
	  </section>
  
	  <section>
		<h2>Challenges and Considerations</h2>
		<p>
		  However, this vision comes with its own set of challenges. How do we ensure the quality
		  and safety of AI-generated code? What happens to software maintenance and documentation
		  in a world of rapidly generated tools? And how do we preserve interoperability and
		  standards while enabling unprecedented personalization?
		</p>
		<p>
		  Moreover, we must consider the impact on the software development profession. Rather than
		  replacing developers, AI tools might elevate their role to that of architects and
		  curators, focusing on system design and integration while delegating implementation
		  details to AI assistants.
		</p>
	  </section>
  
	  <section>
		<h2>The Path Forward</h2>
		<p>
		  As we move toward this future, we need to carefully balance automation with human oversight.
		  The goal isn't to remove humans from the loop but to amplify their creative and
		  problem-solving capabilities. Success will require developing new interfaces, workflows,
		  and mental models for human-AI collaboration in software development.
		</p>
		<p>
		  The most exciting aspect of this evolution might be its potential to unlock creativity
		  and innovation at unprecedented scales. When the technical barriers to implementation
		  are lowered, more people can focus on imagining new possibilities and solving real
		  problems.
		</p>
	  </section>
	</div>
  </Scroller>