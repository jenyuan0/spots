import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Carousel from '@/components/Carousel';
import useLightbox from '@/hooks/useLightbox';
import Img from '@/components/Image';
import Button from '@/components/Button';
import { IconSave } from '@/components/SvgIcons';
import useKey from '@/hooks/useKey';

// TODO
// while image loads, fire progress bar

export default function Lightbox() {
	const [activeIndex, setActiveIndex] = useState(0);
	const {
		lightboxImages,
		setLightboxImages,
		lightboxActive,
		setLightboxActive,
	} = useLightbox();

	useEffect(() => {
		setActiveIndex(lightboxImages?.activeIndex);
	}, [lightboxImages]);

	const handleClose = () => {
		setLightboxActive(false);
		setTimeout(() => {
			setLightboxImages(null, 0);
		}, 1000);
	};

	useKey(handleClose);

	if (!lightboxImages.images) return false;

	return (
		<div
			className={clsx('g-lightbox cr-white', {
				'is-active': lightboxActive,
			})}
			role="dialog"
			aria-label="Image lightbox"
			aria-modal={lightboxActive}
		>
			<div className="g-lightbox__header">
				<div className="g-lightbox__close">
					<Button className="btn-outline cr-white" onClick={handleClose}>
						<span className="icon-close" />
						Close
					</Button>
				</div>
				<div className="g-lightbox__counter">
					<span>{activeIndex + 1}</span>
					{' / '}
					<span>{lightboxImages.images.length}</span>
				</div>
				{/* 
					TODO
					saving interests
				 */}
				{/* <div className="g-lightbox__tools">
					<Button className="trigger-outline" onClick={() => {}}>
						<IconSave />
					</Button>
				</div> */}
			</div>
			<div className="g-lightbox__images">
				<Carousel
					isShowNav={true}
					isFade={true}
					itemWidth="100%"
					gap={'10px'}
					initialActiveIndex={lightboxImages?.activeIndex}
					setActiveIndex={setActiveIndex}
				>
					{lightboxImages.images?.map((image, i) => (
						<div className="g-lightbox__image" key={`image-${i}`}>
							<div className="object-contain">
								<Img key={`lightbox-image-${i}`} image={image} />
							</div>
						</div>
					))}
				</Carousel>
			</div>
		</div>
	);
}
