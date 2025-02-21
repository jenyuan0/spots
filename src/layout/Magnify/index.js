import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { client } from '@/sanity/lib/client';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/Button';
import useOutsideClick from '@/hooks/useOutsideClick';
import useEscKey from '@/hooks/useEscKey';
import useMagnify from '@/hooks/useMagnify';

export default function Magnify() {
	const { mag, setMag } = useMagnify();
	const searchParams = useSearchParams();
	const [content, setContent] = useState(null);
	const [isActive, setIsActive] = useState(false);
	const containerRef = useRef();
	const timerRef = useRef();

	const fetchContent = async (mParam) => {
		try {
			const slug = mParam.split('/').pop();
			const result = await client.fetch(
				`*[_type == "gLocations" && slug.current == "${slug}"][0]`
			);
			setMag({
				content: result,
				url: `/locations/${slug}`,
				isQueryUrl: true,
			});
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		const mParam = searchParams.get('m');
		if (mParam) {
			fetchContent(mParam);
		} else {
			setIsActive(false);
		}
		return cleanup;
	}, [searchParams]);

	useEffect(() => {
		cleanup();

		if (mag?.content) {
			setContent(mag.content);
			setIsActive(true);
			if (mag.url) {
				window.history.pushState({}, '', `?m=${mag.url}`);
			}
		}
	}, [mag]);
	// Cleanup function to prevent memory leaks
	const cleanup = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	};

	const handleClose = () => {
		if (!isActive) return;
		setIsActive(false);
		cleanup();

		timerRef.current = setTimeout(() => {
			setContent(null);
			window.history.pushState({}, '', window.location.pathname);
		}, 500);
	};

	useOutsideClick(containerRef, handleClose);
	useEscKey(handleClose);
	console.log(content);
	return (
		<div
			ref={containerRef}
			className={clsx('g-magnify', { 'is-active': isActive })}
			role="dialog"
			aria-modal={isActive}
		>
			<Button
				className={clsx('btn', content?.color && `cr-${content.color}-d`)}
				onClick={handleClose}
			>
				Close
			</Button>
			{content?.title && <h2>{content.title}</h2>}
		</div>
	);
}
