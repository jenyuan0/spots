import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { buildImageSrc } from '@/lib/helpers';
import { useInView } from 'react-intersection-observer';

export default function Img({
	image,
	alt,
	className,
	responsiveImage,
	breakpoint = 600,
	quality = 80,
	isAutoFormat,
}) {
	const { ref, inView } = useInView({ triggerOnce: true });
	const [isLoaded, setIsLoaded] = useState(false);
	const imageId = getSanityRefId(image);
	const imageDimension = getImageDimensions(imageId);
	const aspectRatio = image?.customRatio || imageDimension?.aspectRatio;
	const imageWidth = imageDimension?.width;
	const imageHeight = Math.round(imageWidth / aspectRatio);
	const src = buildImageSrc(image, {
		width: inView ? imageWidth : 100,
		height: inView ? imageHeight : Math.round(100 / aspectRatio),
		...(!isAutoFormat && { format: 'jpg' }),
		quality,
	});
	const responsiveImageSrc = buildImageSrc(responsiveImage, {
		...(!isAutoFormat && { format: 'jpg' }),
		quality,
	});
	const pictureRef = useRef();
	const [renderedDimensions, setRenderedDimensions] = useState({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		if (inView && pictureRef.current) {
			const { offsetWidth, offsetHeight } = pictureRef.current;
			setRenderedDimensions({ width: offsetWidth, height: offsetHeight });
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
				sizes={inView ? `${renderedDimensions.width}px` : '0vw'}
				src={src}
				quality={quality}
				alt={alt || image.alt || 'image'}
				onLoad={() => renderedDimensions.width > 0 && setIsLoaded(true)}
				className={clsx({
					lazyload: !isLoaded,
					lazyloaded: isLoaded && inView,
				})}
			/>
		</picture>
	);
}

const getSanityRefId = (image) => {
	if (!image) return null;
	if (typeof image === 'string') return image;
	if (image?.asset) return image.asset._ref || image.asset._id;
	return image._ref || image._id || null;
};

const getImageDimensions = (id) => {
	if (!id) return null;
	const dimensions = id.split('-')[2];
	const [width, height] = dimensions.split('x').map((num) => parseInt(num, 10));
	return { width, height, aspectRatio: width / height };
};
