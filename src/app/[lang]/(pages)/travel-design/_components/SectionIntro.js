'use client';

import React, { useEffect, useRef } from 'react';
import CustomPortableText from '@/components/CustomPortableText';

function ScrollFill({ blocks }) {
	const rootRef = useRef(null);

	// Wrap text nodes into word spans while preserving existing markup (<a>, <em>, etc.).
	// Each span includes its trailing whitespace, so spacing remains correct.
	const wrapTextNodesIntoWords = (rootEl) => {
		const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
			acceptNode(node) {
				const v = node.nodeValue;
				if (!v || !v.trim()) return NodeFilter.FILTER_REJECT;
				const parent = node.parentElement;
				if (!parent) return NodeFilter.FILTER_REJECT;
				const tag = parent.tagName?.toLowerCase();
				if (tag === 'script' || tag === 'style')
					return NodeFilter.FILTER_REJECT;
				return NodeFilter.FILTER_ACCEPT;
			},
		});

		const textNodes = [];
		while (walker.nextNode()) textNodes.push(walker.currentNode);

		textNodes.forEach((node) => {
			const text = node.nodeValue || '';

			// Match non-whitespace runs and keep any trailing whitespace in the same token.
			// Example: "Travel is" -> ["Travel ", "is"]
			const tokens = text.match(/\S+\s*/g);
			if (!tokens || tokens.length === 0) return;

			const frag = document.createDocumentFragment();
			tokens.forEach((token) => {
				// Avoid empty spans.
				if (!token) return;

				const span = document.createElement('span');
				span.className = 'c-filltext__word';
				span.textContent = token;
				frag.appendChild(span);
			});

			node.parentNode?.replaceChild(frag, node);
		});
	};

	// Group word spans into visual lines (based on offsetTop) and wrap each line.
	const wrapWordsIntoLines = (rootEl) => {
		const words = Array.from(rootEl.querySelectorAll('.c-filltext__word'));
		if (!words.length) return [];

		// Unwrap any previous line wrappers.
		rootEl.querySelectorAll('.c-filltext__line').forEach((line) => {
			while (line.firstChild)
				line.parentNode?.insertBefore(line.firstChild, line);
			line.parentNode?.removeChild(line);
		});

		const tolerance = 2;
		const lines = [];
		let current = [];
		let currentTop = null;

		words.forEach((w) => {
			const top = w.offsetTop;
			if (currentTop === null) {
				currentTop = top;
				current.push(w);
				return;
			}

			if (Math.abs(top - currentTop) <= tolerance) {
				current.push(w);
			} else {
				lines.push(current);
				current = [w];
				currentTop = top;
			}
		});
		if (current.length) lines.push(current);

		lines.forEach((lineWords) => {
			const line = document.createElement('span');
			line.className = 'c-filltext__line';
			const first = lineWords[0];
			first.parentNode?.insertBefore(line, first);
			lineWords.forEach((w) => line.appendChild(w));
		});

		return Array.from(rootEl.querySelectorAll('.c-filltext__line'));
	};

	// Reveal words based on a line-local progress value:
	// - progress = 0 when the top of the line hits the viewport midpoint
	// - progress = 1 when the bottom of the line hits the viewport midpoint
	const updateReveal = (rootEl) => {
		const introEl = rootEl.closest('.p-design__intro');
		// Use the top edge of the intro section (in viewport coordinates) as the reveal threshold.
		const midY = introEl
			? introEl.getBoundingClientRect().top + scrollY
			: window.innerHeight / 1.6;
		const lines = Array.from(rootEl.querySelectorAll('.c-filltext__line'));

		lines.forEach((line, index) => {
			const rect = line.getBoundingClientRect();
			const height = Math.max(rect.height, 1);
			const progress = (midY - rect.top) / height;
			const p = Math.max(0, Math.min(1, progress));

			const words = Array.from(line.querySelectorAll('.c-filltext__word'));
			const n = words.length;
			if (!n) return;

			// How many words should be visible at this progress?
			// If only 1 word, it becomes visible as soon as progress > 0.
			const visibleCount = p <= 0 ? 0 : Math.min(n, Math.ceil(p * n));
			words.forEach((w, i) => {
				const shouldShow = i < visibleCount;
				w.classList.toggle('is-visible', shouldShow);
			});
		});
	};

	useEffect(() => {
		const rootEl = rootRef.current;
		if (!rootEl) return;

		const reduceMotion = window.matchMedia?.(
			'(prefers-reduced-motion: reduce)'
		).matches;

		const build = () => {
			// Reset any previous processing by letting React re-render on blocks change.
			// At this point, the DOM contains the latest PortableText output.
			wrapTextNodesIntoWords(rootEl);
			wrapWordsIntoLines(rootEl);

			if (reduceMotion) {
				rootEl
					.querySelectorAll('.c-filltext__word')
					.forEach((w) => w.classList.add('is-visible'));
				return;
			}

			updateReveal(rootEl);
		};

		setTimeout(build, 100);

		if (reduceMotion) return;

		let raf = 0;
		const onScrollOrResize = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => updateReveal(rootEl));
		};

		window.addEventListener('scroll', onScrollOrResize, { passive: true });
		window.addEventListener('resize', onScrollOrResize);

		const ro = new ResizeObserver(() => {
			// Line breaks can change with layout; rebuild line wrappers.
			build();
		});
		ro.observe(rootEl);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('scroll', onScrollOrResize);
			window.removeEventListener('resize', onScrollOrResize);
			ro.disconnect();
		};
	}, [blocks]);

	return (
		<div className="c-filltext" ref={rootRef}>
			<CustomPortableText blocks={blocks} />
		</div>
	);
}

export default function SectionIntro({ data }) {
	const { introHeading, introParagraph } = data || {};

	return (
		<section className="p-design__intro">
			{introHeading && (
				<h2 className="p-design__intro__title t-l-2">{introHeading}</h2>
			)}
			{introParagraph && (
				<div className="p-design__intro__paragraph">
					<ScrollFill blocks={introParagraph} />
				</div>
			)}
		</section>
	);
}
