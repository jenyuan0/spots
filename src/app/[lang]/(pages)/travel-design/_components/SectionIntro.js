'use client';

import React, { useEffect, useRef } from 'react';
import CustomPortableText from '@/components/CustomPortableText';

function ScrollFill({ blocks }) {
	const rootRef = useRef(null);

	// Wrap text nodes into word spans while preserving existing markup (<a>, <em>, <i>, etc.).
	// Each span includes its trailing whitespace, so spacing remains correct.
	const wrapTextNodesIntoWords = (rootEl) => {
		const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
			acceptNode(node) {
				const v = node.nodeValue;
				if (!v || !v.trim()) return NodeFilter.FILTER_REJECT;

				const parent = node.parentElement;
				if (!parent) return NodeFilter.FILTER_REJECT;

				// Don’t process inside script/style.
				const tag = parent.tagName?.toLowerCase();
				if (tag === 'script' || tag === 'style')
					return NodeFilter.FILTER_REJECT;

				// Don’t re-wrap text that’s already inside a word span.
				if (parent.closest?.('.c-filltext__word'))
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
				// Prevent empty/zero-width-only spans.
				// (Some content sources include \u200B/\uFEFF which can render as "empty".)
				const visible = token.replace(/[\s\u200B\uFEFF]/g, '');
				if (!visible) {
					frag.appendChild(document.createTextNode(token));
					return;
				}

				const span = document.createElement('span');
				span.className = 'c-filltext__word';
				span.textContent = token;
				frag.appendChild(span);
			});

			node.parentNode?.replaceChild(frag, node);
		});
	};

	// Assign each word span to a visual line (based on offsetTop) without moving nodes.
	// This preserves inline markup like <em>/<i> because we never re-parent word spans.
	const assignWordsToVisualLines = (rootEl) => {
		const words = Array.from(rootEl.querySelectorAll('.c-filltext__word'));
		if (!words.length) return [];

		// Clear previous line ids.
		words.forEach((w) => w.removeAttribute('data-line'));

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

		lines.forEach((lineWords, idx) => {
			lineWords.forEach((w) => w.setAttribute('data-line', String(idx)));
		});

		return lines;
	};

	// Reveal words based on a line-local progress value:
	// - progress = 0 when the top of the line hits the viewport midpoint
	// - progress = 1 when the bottom of the line hits the viewport midpoint
	const updateReveal = (rootEl) => {
		const words = Array.from(rootEl.querySelectorAll('.c-filltext__word'));
		if (!words.length) return;

		const midY = window.innerHeight * 0.7;

		// Group words by their assigned visual line.
		const byLine = new Map();
		words.forEach((w) => {
			const key = w.getAttribute('data-line') || '0';
			if (!byLine.has(key)) byLine.set(key, []);
			byLine.get(key).push(w);
		});

		byLine.forEach((lineWords) => {
			if (!lineWords.length) return;

			// Determine the visual top/bottom of the line.
			const firstRect = lineWords[0].getBoundingClientRect();
			const lastRect = lineWords[lineWords.length - 1].getBoundingClientRect();
			const top = firstRect.top;
			const bottom = lastRect.bottom;
			const span = Math.max(bottom - top, 1);

			const p = Math.max(0, Math.min(1, (midY - top) / span));
			const n = lineWords.length;
			const visibleCount = p <= 0 ? 0 : Math.min(n, Math.ceil(p * n));

			lineWords.forEach((w, i) => {
				w.classList.toggle('is-visible', i < visibleCount);
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
			assignWordsToVisualLines(rootEl);

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
