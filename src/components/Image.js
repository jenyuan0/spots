'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { buildImageSrc } from '@/lib/helpers';
import { useInView } from 'react-intersection-observer';

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

function Img({
	image,
	alt,
	className,
	responsiveImage = false,
	breakpoint = 600,
	quality = 80,
	format = 'webp',
}) {
	const { ref, inView } = useInView({ triggerOnce: true });
	const [isLoaded, setIsLoaded] = useState(false);
	const [error, setError] = useState(false);
	const pictureRef = useRef();
	const [renderedWidth, setRenderedWidth] = useState(0);

	const imageId = getImageId(image);
	const dimensions = getImageDimensions(imageId);
	const aspectRatio = image?.customRatio || dimensions?.aspectRatio || 1;
	const placeholderSrc = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${aspectRatio * 100} 100'%3E%3C/svg%3E`;
	const imageWidth = dimensions?.width;
	const imageHeight = Math.round(imageWidth / aspectRatio);
	const imageOptions = {
		width: imageWidth,
		height: imageHeight,
		format,
		quality,
	};
	const src = renderedWidth
		? buildImageSrc(image, imageOptions)
		: placeholderSrc;
	const responsiveImageData = useMemo(() => {
		if (!responsiveImage) return null;

		const id = getImageId(responsiveImage);
		const dimensions = getImageDimensions(id);
		const ratio =
			responsiveImage?.customRatio || dimensions?.aspectRatio || aspectRatio;
		const width = dimensions?.width || imageWidth;
		const height = Math.round(width / ratio);

		return {
			src: buildImageSrc(responsiveImage, {
				width,
				height,
				format,
				quality,
			}),
			width,
			height,
		};
	}, [responsiveImage, format, quality, aspectRatio, imageWidth]);

	useEffect(() => {
		if (inView && pictureRef.current) {
			setRenderedWidth(pictureRef.current.offsetWidth);
		}
	}, [inView]);

	const handleImageError = () => {
		setError(true);
		setIsLoaded(false);
	};

	if (!image || !imageId) return null;
	if (error) console.error(`Failed to load image ${imageId}`);

	return (
		<picture ref={pictureRef} className={className}>
			{responsiveImage && responsiveImageData && (
				<>
					<source
						media={`(min-width: ${breakpoint + 1}px)`}
						width={imageWidth}
						height={imageHeight}
						srcSet={src}
					/>
					<source
						media={`(max-width: ${breakpoint}px)`}
						width={responsiveImageData.width}
						height={responsiveImageData.height}
						srcSet={responsiveImageData.src}
					/>
				</>
			)}
			<Image
				ref={ref}
				width={imageWidth}
				height={imageHeight}
				sizes={`${renderedWidth}px`}
				quality={quality}
				alt={alt || image.alt || 'image'}
				src={src}
				onError={handleImageError}
				onLoad={() => renderedWidth > 0 && setIsLoaded(true)}
				className={clsx({
					lazyload: !isLoaded,
					lazyloaded: isLoaded,
					loading: !isLoaded && !error,
					'is-landscape': aspectRatio > 1,
					'is-portrait': aspectRatio <= 1,
				})}
				role="img"
				loading="lazy"
			/>
		</picture>
	);
}

export default React.memo(Img);
