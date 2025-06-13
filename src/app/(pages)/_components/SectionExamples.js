'use client';

import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import CustomPortableText from '@/components/CustomPortableText';
import Button from '@/components/Button';
import { useInView } from 'react-intersection-observer';

function MessageBubble({ index, msg, delayOffset }) {
	return (
		<div
			className={clsx('p-booking__examples__chat__bubble', {
				'is-spots': msg.sender === 'SPOTS',
				'is-client': msg.sender !== 'SPOTS',
			})}
			style={{ animationDelay: `${delayOffset + index * 0.8}s` }}
		>
			<p className="chat-text">
				<CustomPortableText blocks={msg.text} hasPTag={false} />
			</p>
		</div>
	);
}

function ExampleChat({ example, delayOffset }) {
	let color = example?.color?.title || 'green';

	return (
		<div
			className={clsx('p-booking__examples__chat')}
			style={{
				'--cr-primary': `var(--cr-${color}-d)`,
				'--cr-secondary': `var(--cr-${color}-l)`,
			}}
		>
			<div className="p-booking__examples__chat__sequence">
				{example?.messages?.map(
					(msg, index) =>
						msg?.text && (
							<MessageBubble
								key={index}
								index={index}
								msg={msg}
								delayOffset={delayOffset}
							/>
						)
				)}
			</div>
			<Button className={`btn cr-${color}-d`}>{example.ctaLabel}</Button>
			<div className="p-booking__examples__chat__header wysiwyg">
				<h3 className="t-l-2">{example.title}</h3>
				<p className="t-h-4">{example.excerpt}</p>
			</div>
		</div>
	);
}

export default function SectionExamples({ data }) {
	const { examplesHeading, examplesList } = data;
	const { ref, inView } = useInView({ triggerOnce: true });

	return (
		<section
			ref={ref}
			className={clsx('p-booking__examples', {
				'is-in-view': inView,
			})}
		>
			<h2 className="p-booking__examples__heading t-h-1">{examplesHeading}</h2>
			<div className="p-booking__examples__lists">
				{examplesList.map((example, index) => (
					<ExampleChat key={index} example={example} delayOffset={index} />
				))}
			</div>
		</section>
	);
}
