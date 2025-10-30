import React, { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { getCaseData } from '@/sanity/lib/queries';
import MagnifyCaseEl from './MagnifyCaseEl';

export default function MagnifyCase({ mParam, pageSlug, onColorChange }) {
	const [caseContent, setCaseContent] = useState(null);
	const [color, setColor] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			if (!mParam) return;
			try {
				const dataSlug = mParam.split('/').pop();
				const content = await client.fetch(
					`*[_type == "gCases" && language == "en" && slug.current == "${dataSlug}"][0]{
        ${getCaseData()}
      }`
				);

				const contentColor = content && content.color;
				const enrichedContent = { ...content, color: contentColor };

				setCaseContent(enrichedContent);
				setColor(contentColor);
				if (onColorChange) onColorChange(contentColor);
			} catch (e) {
				console.error('Error fetching location content:', e);
			}
		};

		if (!isLoaded) {
			setIsLoaded(true);
			fetchData();
		}
	}, [mParam, pageSlug, onColorChange, isLoaded]);

	if (!isLoaded || !caseContent) {
		return null;
	}

	const data = { content: caseContent };

	return <MagnifyCaseEl data={data?.content} />;
}
