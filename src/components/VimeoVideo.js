import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
import clsx from 'clsx';
import Player from '@vimeo/player';
import Img from '@/components/Image';
import { useInView } from 'react-intersection-observer';
import getVideoId from 'get-video-id';

export default function VimeoVideo({
	data,
	className,
	background = true,
	autoplay = false,
	loop = false,
	controls = false,
	muted = true,
	videoPlayCallBackFunc,
	videoPauseCallBackFunc,
	videoEndCallBackFunc,
	videoTimeupdateCallBackFunc,
	...props
}) {
	const { ref, inView } = useInView();
	const iframeRef = useRef();
	const [iframePlayer, setIframePlayer] = useState(null);
	const [videoInfo, setVideoInfo] = useState({
		width: 0,
		height: 0,
		title: null,
	});
	const videoId = getVideoId(data.vimeoUrl)?.id || false;

	useEffect(() => {
		if (iframeRef.current && iframePlayer === null) {
			const player = new Player(iframeRef.current);

			setIframePlayer(player);
			Promise.all([
				player.getVideoWidth(),
				player.getVideoHeight(),
				player.getVideoTitle(),
			]).then(function (data) {
				setVideoInfo({
					width: data[0],
					height: data[1],
					title: data[2],
				});
			});
		}
	}, [iframePlayer]);

	useEffect(() => {
		if (iframePlayer) {
			iframePlayer.on('play', function (e) {
				videoPlayCallBackFunc(e);
			});

			iframePlayer.on('pause', function (e) {
				videoPauseCallBackFunc(e);
			});
		}
	}, [iframePlayer, videoPlayCallBackFunc, videoPauseCallBackFunc]);

	useEffect(() => {
		if (iframePlayer) {
			iframePlayer.on('ended', function (e) {
				videoEndCallBackFunc(e);
			});
		}
	}, [iframePlayer, videoEndCallBackFunc]);

	useEffect(() => {
		if (iframePlayer) {
			iframePlayer.on('timeupdate', function (e) {
				videoTimeupdateCallBackFunc(e);
			});
		}
	}, [iframePlayer, videoTimeupdateCallBackFunc]);

	useEffect(() => {
		if (iframePlayer && (autoplay === true || background == true)) {
			inView ? iframePlayer.play() : iframePlayer.pause();
		}
	}, [iframePlayer, inView, autoplay, background]);

	useEffect(() => {
		if (iframePlayer) {
			iframePlayer.on('error', function () {
				setIframePlayer(null);
				console.error('Error in loading video');
			});
		}
	}, [iframePlayer]);

	return (
		<div
			ref={ref}
			className={clsx('c-vimeo-video bg-subtle', className, {
				'is-loaded': iframePlayer,
			})}
			style={{
				'--aspect-ratio': (videoInfo.width / videoInfo.height).toFixed(2),
			}}
			{...props}
		>
			<iframe
				className="c-vimeo-video__iframe p-fill"
				ref={iframeRef}
				title={videoInfo.title}
				width={videoInfo.width}
				height={videoInfo.height}
				src={`https://player.vimeo.com/video/${videoId}${
					background
						? `?background=1`
						: `?controls=${controls ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${
								loop ? 1 : 0
							}`
				}`}
				allow="autoplay; fullscreen;"
				frameBorder="0"
			/>

			{data.thumbnail && !iframePlayer && (
				<span className="c-vimeo-video__thumbnail object-fit">
					<Img image={data.thumbnail} alt={videoInfo.title} />
				</span>
			)}
		</div>
	);
}
