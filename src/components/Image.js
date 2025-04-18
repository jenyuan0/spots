'use client';

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { buildImageSrc } from '@/lib/helpers';
import { useInView } from 'react-intersection-observer';

export default function Img(props) {
	const {
		image,
		alt = 'image',
		className,
		responsiveImage,
		breakpoint = 600,
		quality = 80,
		format = 'webp',
	} = props;

	const { ref, inView } = useInView({ triggerOnce: true });
	const [isLoaded, setIsLoaded] = useState(false);
	const pictureRef = useRef();
	const [renderedDimensions, setRenderedDimensions] = useState({ width: 0 });

	// Get image dimensions and create src
	const imageId = getImageId(image);
	const dimensions = getImageDimensions(imageId);
	const aspectRatio = image?.customRatio || dimensions?.aspectRatio;
	const placeholderSrc = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${aspectRatio * 100} 100'%3E%3C/svg%3E`;
	const imageWidth = dimensions?.width;
	const imageHeight = Math.round(imageWidth / aspectRatio);
	const imageOptions = {
		width: imageWidth,
		height: imageHeight,
		format,
		quality,
	};

	const src = renderedDimensions.width
		? buildImageSrc(image, imageOptions)
		: placeholderSrc;
	const responsiveImageSrc =
		responsiveImage &&
		(renderedDimensions.width
			? buildImageSrc(responsiveImage, imageOptions)
			: placeholderSrc);

	useEffect(() => {
		if (inView && pictureRef.current) {
			setRenderedDimensions({
				width: pictureRef.current.offsetWidth,
			});
		}
	}, [inView]);

	if (!image || !imageId) return null;

	return (
		<picture ref={pictureRef} className={className}>
			{responsiveImageSrc && (
				<>
					<source
						media={`(min-width: ${breakpoint + 1}px)`}
						width={imageWidth}
						height={imageHeight}
						srcSet={src}
					/>
					<source
						media={`(max-width: ${breakpoint}px)`}
						width={imageWidth}
						height={imageHeight}
						srcSet={responsiveImageSrc}
					/>
				</>
			)}
			<Image
				ref={ref}
				width={imageWidth}
				height={imageHeight}
				sizes={`${renderedDimensions.width}px`}
				quality={quality}
				alt={alt || image.alt || 'image'}
				src={src}
				onLoad={() => renderedDimensions.width > 0 && setIsLoaded(true)}
				className={clsx({
					lazyload: !isLoaded,
					lazyloaded: isLoaded,
				})}
			/>
		</picture>
	);
}

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
