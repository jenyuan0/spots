'use client';

import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import CustomPortableText from '@/components/CustomPortableText';
import Carousel from '@/components/Carousel';
import Button from '@/components/Button';
import usePlanner from '@/hooks/usePlanner';
import { useInView } from 'react-intersection-observer';
import useWindowDimensions from '@/hooks/useWindowDimensions';

function MessageBubble({ index, msg, delayOffset }) {
	return (
		<div
			className={clsx('p-booking__examples__chat__bubble', {
				'is-spots': msg.sender === 'SPOTS',
				'is-client': msg.sender !== 'SPOTS',
			})}
			style={{ animationDelay: `${delayOffset + index * 0.8}s` }}
		>
			<div className="chat-text">
				<CustomPortableText blocks={msg.text} />
			</div>
		</div>
	);
}

function ExampleChat({ example, delayOffset }) {
	const { setPlannerActive, setPlannerContent } = usePlanner();
	const color = example?.color?.title || 'green';
	const handleOnClick = () => {
		setPlannerActive(true);

		switch (example.ctaLabel) {
			case 'Find Your Stay':
				setPlannerContent({
					heading: 'Find Your Stay',
					subheading:
						'Tell us where you’re going and what matters most — we’ll curate the best fits and handle the rest.',
					subject: 'Hotel search',
				});
				break;
			case 'Unlock Insider Rates':
				setPlannerContent({
					heading: 'Unlock Insider Rates',
					subheading:
						'Share your travel dates and we’ll check for insider pricing, upgrades, and perks — no strings attached.',
					subject: 'Rate check request',
					placeholder:
						'Hi! Can you check your rate for [HOTEL NAME] for [DATES]?',
				});
				break;
			case 'Start Planning':
				setPlannerContent({
					heading: 'Plan Your Trip',
					subheading:
						'Planning for a group or something specific? Tell us your needs — we’ll simplify everything.',
				});
				break;
		}
	};

	return (
		<div
			className={clsx('p-booking__examples__chat')}
			style={{
				'--cr-primary': `var(--cr-${color}-d)`,
				'--cr-secondary': `var(--cr-${color}-l)`,
			}}
		>
			<div className="p-booking__examples__chat__header wysiwyg">
				<h3 className="t-l-2">{example.title}</h3>
				<p className="t-h-4">{example.excerpt}</p>
			</div>
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
			<Button
				className={`p-booking__examples__chat__cta btn cr-${color}-d js-gtm-search`}
				onClick={handleOnClick}
			>
				{example.ctaLabel}
			</Button>
		</div>
	);
}

export default function SectionExamples({ data }) {
	const { examplesHeading, examplesList } = data;
	const { ref, inView } = useInView({ triggerOnce: true });
	const { isMdscreen } = useWindowDimensions();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<section
			ref={ref}
			className={clsx('p-booking__examples', {
				'is-in-view': inView,
			})}
		>
			<h2 className="p-booking__examples__header t-h-1">{examplesHeading}</h2>
			{isMounted &&
				(isMdscreen ? (
					<Carousel
						itemWidth="Min(85vw, 500px)"
						gap={'10px'}
						isShowDots={true}
						loop={true}
					>
						{examplesList.map((example, index) => (
							<div
								key={`example-${index}`}
								className="p-booking__examples__item"
							>
								<ExampleChat
									key={index}
									example={example}
									delayOffset={index}
								/>
							</div>
						))}
					</Carousel>
				) : (
					<div className="p-booking__examples__lists">
						{examplesList.map((example, index) => (
							<ExampleChat key={index} example={example} delayOffset={index} />
						))}
					</div>
				))}
		</section>
	);
}
