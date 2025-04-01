import dynamic from 'next/dynamic';
import React from 'react';
import Img from '@/components/Image';

const Marquee = dynamic(() => import('./Marquee'));
const Carousel = dynamic(() => import('./Carousel'));
const Freeform = dynamic(() => import('./Freeform'), {
	loading: () => <p>Loading...</p>,
});
const LocationList = dynamic(() => import('./LocationList'));
const Ad = dynamic(() => import('./Ad'));

export default function PageModules({ module }) {
	const type = module._type;

	switch (type) {
		case 'freeform':
			return <Freeform data={module} />;

		case 'carousel':
			return (
				<Carousel
					isShowDots={true}
					isAutoplay={module.autoplay}
					autoplayInterval={module?.autoplayInterval * 1000 || false}
				>
					{module.items?.map((el, index) => (
						<Img key={`${module._key}-${index}`} image={el} />
					))}
				</Carousel>
			);

		case 'marquee':
			return <Marquee data={module} />;

		case 'locationList':
			return <LocationList data={module} />;

		case 'locationSingle':
			return (
				<LocationCard
					data={module?.location}
					additionalContent={module?.additionalContent}
					layout="embed"
					hasDirection={true}
				/>
			);

		case 'gAds':
			return <Ad data={module} />;

		default:
			return null;
	}
}
