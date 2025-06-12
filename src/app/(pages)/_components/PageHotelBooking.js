'use client';

import React from 'react';
import SectionHero from './SectionHero';
import SectionWhy from './SectionWhy';
import SectionExamples from './SectionExamples';

export default function PageHotelBooking({}) {
	const data = {
		heroSpots: [
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
			{
				title: 'Hotel',
			},
		],
		whyListHeading: 'What You Get When You Book with Spots',
		whyList: [
			{
				title: 'Always Free',
				paragraph:
					'No markups, no hidden fees. We’re paid by hoteles, not you.',
				img: (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 189.79 189">
						<path
							fill="currentColor"
							d="M94.5 0c7.46 0 13.5 6.04 13.5 13.5S101.96 27 94.5 27 81 20.96 81 13.5 87.04 0 94.5 0Zm62.66 114.02c5.28 5.28 5.28 13.84 0 19.12s-13.84 5.28-19.12 0c-5.28-5.28-5.28-13.84 0-19.12s13.84-5.28 19.12 0ZM94.5 81c7.46 0 13.5 6.04 13.5 13.5S101.96 108 94.5 108 81 101.96 81 94.5 87.04 81 94.5 81Zm91.33 4.35c5.28 5.28 5.28 13.84 0 19.12-5.28 5.28-13.84 5.28-19.12 0-5.28-5.28-5.28-13.84 0-19.12s13.84-5.28 19.12 0ZM94.5 162c7.46 0 13.5 6.04 13.5 13.5S101.96 189 94.5 189 81 182.96 81 175.5 87.04 162 94.5 162Zm33.99-19.31c5.28 5.28 5.28 13.84 0 19.12s-13.84 5.28-19.12 0-5.28-13.84 0-19.12 13.84-5.28 19.12 0ZM67 94.5c0 7.46-6.04 13.5-13.5 13.5S40 101.96 40 94.5 46.04 81 53.5 81 67 87.04 67 94.5Zm90.16-18.71c-5.28 5.28-13.84 5.28-19.12 0s-5.28-13.84 0-19.12c5.28-5.28 13.84-5.28 19.12 0s5.28 13.84 0 19.12ZM27 94.5c0 7.46-6.04 13.5-13.5 13.5S0 101.96 0 94.5 6.04 81 13.5 81 27 87.04 27 94.5Zm101.49-47.38c-5.28 5.28-13.84 5.28-19.12 0s-5.28-13.84 0-19.12 13.84-5.28 19.12 0 5.28 13.84 0 19.12Z"
						/>
					</svg>
				),
			},
			{
				title: 'Tailored Hotel Curation',
				paragraph:
					'Tell us your vibe, we handpick options. Tailored curation, not algorithms.',
				img: (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 189">
						<path
							fill="currentColor"
							d="M94.5 121c7.46 0 13.5 6.04 13.5 13.5S101.96 148 94.5 148 81 141.96 81 134.5 87.04 121 94.5 121Zm0-40c7.46 0 13.5 6.04 13.5 13.5S101.96 108 94.5 108 81 101.96 81 94.5 87.04 81 94.5 81Zm-40 40c7.46 0 13.5 6.04 13.5 13.5S61.96 148 54.5 148 41 141.96 41 134.5 47.04 121 54.5 121Zm-41 41c7.46 0 13.5 6.04 13.5 13.5S20.96 189 13.5 189 0 182.96 0 175.5 6.04 162 13.5 162Zm0-41c7.46 0 13.5 6.04 13.5 13.5S20.96 148 13.5 148 0 141.96 0 134.5 6.04 121 13.5 121Zm0-40C20.96 81 27 87.04 27 94.5S20.96 108 13.5 108 0 101.96 0 94.5 6.04 81 13.5 81Zm38 0C58.96 81 65 87.04 65 94.5S58.96 108 51.5 108 38 101.96 38 94.5 44.04 81 51.5 81Zm84 40c7.46 0 13.5 6.04 13.5 13.5s-6.04 13.5-13.5 13.5-13.5-6.04-13.5-13.5 6.04-13.5 13.5-13.5Zm40.5 41c7.73 0 14 6.04 14 13.5s-6.27 13.5-14 13.5-14-6.04-14-13.5 6.27-13.5 14-13.5Zm0-41c7.73 0 14 6.04 14 13.5s-6.27 13.5-14 13.5-14-6.04-14-13.5 6.27-13.5 14-13.5Zm0-40c7.73 0 14 6.04 14 13.5s-6.27 13.5-14 13.5-14-6.04-14-13.5S168.27 81 176 81Zm0-41c7.73 0 14 6.04 14 13.5S183.73 67 176 67s-14-6.04-14-13.5S168.27 40 176 40Zm0-40c7.73 0 14 6.04 14 13.5S183.73 27 176 27s-14-6.04-14-13.5S168.27 0 176 0Zm-40.5 108c7.46 0 13.5-6.04 13.5-13.5S142.96 81 135.5 81 122 87.04 122 94.5s6.04 13.5 13.5 13.5Z"
						/>
					</svg>
				),
			},
			{
				title: 'Exclusive Perks & Rates',
				paragraph:
					'Insider relationships = better perks. Upgrades, credits, better rates than online.',
				img: (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 159 202">
						<path
							fill="currentColor"
							d="M81.5 0C88.96 0 95 6.04 95 13.5S88.96 27 81.5 27 68 20.96 68 13.5 74.04 0 81.5 0Zm-44 10C44.96 10 51 16.04 51 23.5S44.96 37 37.5 37 24 30.96 24 23.5 30.04 10 37.5 10Zm84 0c-7.46 0-13.5 6.04-13.5 13.5S114.04 37 121.5 37 135 30.96 135 23.5 128.96 10 121.5 10Zm-84 165c7.46 0 13.5 6.04 13.5 13.5S44.96 202 37.5 202 24 195.96 24 188.5 30.04 175 37.5 175Zm84 0c-7.46 0-13.5 6.04-13.5 13.5s6.04 13.5 13.5 13.5 13.5-6.04 13.5-13.5-6.04-13.5-13.5-13.5Zm-40 0c-7.46 0-13.5 6.04-13.5 13.5S74.04 202 81.5 202 95 195.96 95 188.5 88.96 175 81.5 175Zm0-51c-7.46 0-13.5 6.04-13.5 13.5S74.04 151 81.5 151 95 144.96 95 137.5 88.96 124 81.5 124Zm0-57C74.04 67 68 73.04 68 80.5S74.04 94 81.5 94 95 87.96 95 80.5 88.96 67 81.5 67Zm-68-22C20.96 45 27 51.27 27 59s-6.04 14-13.5 14S0 66.73 0 59s6.04-14 13.5-14Zm132 0c-7.46 0-13.5 6.27-13.5 14s6.04 14 13.5 14S159 66.73 159 59s-6.04-14-13.5-14Zm-108 79c7.46 0 13.5 6.04 13.5 13.5S44.96 151 37.5 151 24 144.96 24 137.5 30.04 124 37.5 124Zm84 0c-7.46 0-13.5 6.04-13.5 13.5s6.04 13.5 13.5 13.5 13.5-6.04 13.5-13.5-6.04-13.5-13.5-13.5Zm-108-35c7.46 0 13.5 6.04 13.5 13.5S20.96 116 13.5 116 0 109.96 0 102.5 6.04 89 13.5 89Zm132 0c-7.46 0-13.5 6.04-13.5 13.5s6.04 13.5 13.5 13.5 13.5-6.04 13.5-13.5S152.96 89 145.5 89Z"
						/>
					</svg>
				),
			},
			{
				title: 'Ultra-Responsive Concierge',
				paragraph:
					'Booking logistics, special requests, birthday surprises—we’re on it. Just message us.',
				img: (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 189 189">
						<path
							fill="currentColor"
							d="M94.5 0c7.46 0 13.5 6.04 13.5 13.5S101.96 27 94.5 27 81 20.96 81 13.5 87.04 0 94.5 0Zm81 0c7.46 0 13.5 6.04 13.5 13.5S182.96 27 175.5 27 162 20.96 162 13.5 168.04 0 175.5 0Zm-81 121c7.46 0 13.5 6.04 13.5 13.5S101.96 148 94.5 148 81 141.96 81 134.5 87.04 121 94.5 121Zm-40-40C61.96 81 68 87.04 68 94.5S61.96 108 54.5 108 41 101.96 41 94.5 47.04 81 54.5 81Zm81 0c7.46 0 13.5 6.04 13.5 13.5s-6.04 13.5-13.5 13.5-13.5-6.04-13.5-13.5S128.04 81 135.5 81Zm-114-36C28.96 45 35 51.27 35 59s-6.04 14-13.5 14S8 66.73 8 59s6.04-14 13.5-14Zm136 0c7.46 0 13.5 6.27 13.5 14s-6.04 14-13.5 14S144 66.73 144 59s6.04-14 13.5-14ZM54.5 0C61.96 0 68 6.04 68 13.5S61.96 27 54.5 27 41 20.96 41 13.5 47.04 0 54.5 0Zm-41 0C20.96 0 27 6.04 27 13.5S20.96 27 13.5 27 0 20.96 0 13.5 6.04 0 13.5 0Zm81 81c7.46 0 13.5 6.04 13.5 13.5S101.96 108 94.5 108 81 101.96 81 94.5 87.04 81 94.5 81Zm41-81c7.46 0 13.5 6.04 13.5 13.5S142.96 27 135.5 27 122 20.96 122 13.5 128.04 0 135.5 0Zm-41 162c7.46 0 13.5 6.04 13.5 13.5S101.96 189 94.5 189 81 182.96 81 175.5 87.04 162 94.5 162Zm-35 0c7.46 0 13.5 6.04 13.5 13.5S66.96 189 59.5 189 46 182.96 46 175.5 52.04 162 59.5 162Zm70.5 0c7.73 0 14 6.04 14 13.5s-6.27 13.5-14 13.5-14-6.04-14-13.5 6.27-13.5 14-13.5Z"
						/>
					</svg>
				),
			},
		],
		examplesHeading: 'Here’s How Easy It Is.',
		examplesList: [
			{
				title: 'For hotel hunting',
				excerpt: 'We understand your taste',
				color: 'green',
				ctaLabel: 'Find Your Stay',
				messages: [
					{ sender: 'Client', text: 'Headed to Lisbon next month.' },
					{
						sender: 'Client',
						text: 'Looking for something boutique, under €400/night.',
					},
					{
						sender: 'Client',
						text: 'Walkable to cafés and shops. Good light, if possible :)',
					},
					{
						sender: 'SPOTS',
						text: 'Love that. I’ve pulled three options I think you’ll really like—design-forward, walkable, and well-reviewed. I’ll include breakfast and upgrades where possible. Sending now.',
					},
					{
						sender: 'Client',
						text: 'These look amazing, leaning toward the Lumiares.',
					},
					{
						sender: 'SPOTS',
						text: 'Great pick. Want me to check availability and secure it for your dates?',
					},
				],
			},
			{
				title: 'For deal finding',
				excerpt: 'We save you money',
				color: 'orange',
				ctaLabel: 'Check Your Rates',
				messages: [
					{
						sender: 'Client',
						text: 'Can you check rates for Château Voltaire in Paris?',
					},
					{
						sender: 'Client',
						text: 'May 3 to May 7. Want to compare with what I saw online.',
					},
					{
						sender: 'SPOTS',
						text: 'Just checked—direct rate is €670/night. I can get it for €630 with breakfast, €100 F&B credit, and a possible upgrade. Let me know if you’d like me to hold it.',
					},
					{
						sender: 'Client',
						text: 'Wow, that’s a better deal than what I found—yes please.',
					},
					{
						sender: 'SPOTS',
						text: 'I’ll go ahead and reserve it. Just confirm traveler names and I’ll take care of the rest.',
					},
				],
			},
			{
				title: 'For special requests',
				excerpt: 'We elevate the experience',
				color: 'purple',
				ctaLabel: 'Tailor Your Stay',
				messages: [
					{ sender: 'Client', text: 'Hi!' },
					{
						sender: 'Client',
						text: 'Can you see if early check-in is possible?',
					},
					{
						sender: 'Client',
						text: 'Also wondering if I can request a high floor.',
					},
					{
						sender: 'SPOTS',
						text: 'Absolutely—I’ll request early check-in and note your preference for a higher floor. The hotel can usually hold bags if the room isn’t ready. Let me know if you’d like help with dinner or spa bookings too.',
					},
					{ sender: 'Client', text: 'That’s perfect, thanks so much!' },
					{
						sender: 'SPOTS',
						text: 'Of course—I’ll confirm with the hotel and follow up once it’s locked in. If you have other preferences, just send them anytime.',
					},
				],
			},
			{
				title: 'For group trips',
				excerpt: 'We handle the messy stuff',
				color: 'red',
				ctaLabel: 'Start Planning',
				messages: [
					{ sender: 'Client', text: 'Hey!' },
					{ sender: 'Client', text: 'We’re a group of six—three couples.' },
					{
						sender: 'Client',
						text: 'Different budgets, but we’d all love to stay near the Marais.',
					},
					{
						sender: 'SPOTS',
						text: 'Got it. I’ll find a few options in that area with a mix of suite and standard rooms—same vibe, flexible pricing. I’ll also check if we can link bookings for shared perks.',
					},
					{
						sender: 'Client',
						text: 'Awesome, I’ll check with the others and get back to you.',
					},
					{
						sender: 'SPOTS',
						text: 'Sounds good! I’ll keep the options warm in the meantime. Feel free to send dates when you’re ready.',
					},
				],
			},
		],
	};

	return (
		<>
			<SectionHero data={data} />
			<SectionWhy data={data} />
			<SectionExamples data={data} />
		</>
	);
}
