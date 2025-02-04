'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAppSelector } from '@/store/hook';
import { Progress } from '@/components/Progress';
import { getRandomInt } from '@/lib/helpers';

export default function ProgressLoader() {
	const [progress, setProgress] = useState(0);
	const intervalIdRef = useRef(null);

	const { progressStatus } = useAppSelector(
		(state) => state.globalProgressLoader
	);

	const updateLoader = useCallback((newProgress) => {
		setProgress(Math.min(100, Math.max(0, newProgress)));
	}, []);

	const completeLoader = useCallback(() => {
		if (intervalIdRef.current) {
			clearInterval(intervalIdRef.current);
			intervalIdRef.current = null;
		}

		setProgress(100);
		const timeout = setTimeout(() => setProgress(101), 400);
		return () => clearTimeout(timeout);
	}, []);

	const startProgress = useCallback(() => {
		updateLoader(getRandomInt(0, 30));
		if (intervalIdRef.current) {
			clearInterval(intervalIdRef.current);
		}
		intervalIdRef.current = setInterval(() => {
			setProgress((currentProgress) => {
				if (currentProgress >= 100) {
					completeLoader();
					return currentProgress;
				}

				return currentProgress + getRandomInt(5, 10);
			});
		}, 1000);
	}, [completeLoader, updateLoader]);

	useEffect(() => {
		if (progressStatus === 'start') {
			startProgress();
		} else if (progressStatus === 'complete') {
			completeLoader();
		}

		return () => {
			if (intervalIdRef.current) {
				clearInterval(intervalIdRef.current);
			}
		};
	}, [startProgress, completeLoader, progressStatus]);

	return <Progress className="g-progress" value={progress} />;
}
