'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { buildImageSrc } from '@/lib/helpers';
import { useInView } from 'react-intersection-observer';
import { HalftoneCmyk } from '@paper-design/shaders-react';

function getImageId(image) {
	if (!image) return null;
	if (typeof image === 'string') return image;
	if (image?.asset) return image.asset._ref || image.asset._id;
	return image._ref || image._id || null;
}

function getImageDimensions(id) {
	if (!id) return null;
	const dimensions = id.split('-')[2];
	const [width, height] = dimensions.split('x').map((num) => parseInt(num, 10));
	return { width, height, aspectRatio: width / height };
}

function ImageHalftone({ image }) {
	const containerRef = useRef(null);
	const { ref: inViewRef, inView } = useInView({
		triggerOnce: true,
	});
	const setRefs = (node) => {
		containerRef.current = node;
		inViewRef(node);
	};
	const [renderedSize, setRenderedSize] = useState(false);
	const imageId = getImageId(image);
	const dimensions = getImageDimensions(imageId);
	const aspectRatio = image?.customRatio || dimensions?.aspectRatio || 1;
	const placeholderSrc = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${aspectRatio * 100} 100'%3E%3C/svg%3E`;
	const imageWidth = dimensions?.width;
	const imageHeight = Math.round(imageWidth / aspectRatio);
	const imageOptions = {
		width: imageWidth,
		height: imageHeight,
		format: 'webp',
		quality: 80,
	};
	const src = renderedSize
		? buildImageSrc(image, imageOptions)
		: placeholderSrc;

	useEffect(() => {
		if (inView && containerRef.current) {
			setRenderedSize({
				width: containerRef.current.offsetWidth,
				height: containerRef.current.offsetHeight,
			});
		}
	}, [inView]);

	if (!image || !imageId) return null;

	return (
		<span
			ref={setRefs}
			className={clsx('c-image-halftone', {
				'is-loaded': renderedSize,
			})}
		>
			<HalftoneCmyk
				width={renderedSize.width}
				height={renderedSize.height}
				image={src}
				colorBack="#fbfaf4"
				colorC="#00b3ff"
				colorM="#fc4f9d"
				colorY="#ffd900"
				colorK="#1e1c1c"
				size={0.01}
				gridNoise={0.2}
				type="sharp"
				softness={1}
				contrast={1.15}
				floodC={0.15}
				floodM={0}
				floodY={0}
				floodK={0}
				gainC={0.3}
				gainM={0}
				gainY={0.2}
				gainK={0}
				grainMixer={0}
				grainOverlay={0}
				grainSize={0}
				fit="cover"
			/>
		</span>
	);
}

export default ImageHalftone;
