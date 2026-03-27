import React, { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { getCaseData } from '@/sanity/lib/queries';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import MagnifyCaseEl from './MagnifyCaseEl';

export default function MagnifyCase({ mParam, pageSlug, onDataChange }) {
	const [caseContent, setCaseContent] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [currentLanguageCode] = useCurrentLang();

	useEffect(() => {
		const fetchData = async () => {
			if (!mParam) return;
			try {
				const dataSlug = mParam.split('/').pop();
				const [content] = await Promise.all([
					client.fetch(
						`coalesce(
							*[_type == "gCases" && language == "${currentLanguageCode}" && slug.current == "${dataSlug}"][0],
							*[_type == "gCases" && language == "en" && slug.current == "${dataSlug}"][0]
						){
							${getCaseData()}
						}`,
						{ language: currentLanguageCode } // Add this parameter
					),
				]);
				setCaseContent(content);
				if (onDataChange) onDataChange(content);
			} catch (e) {
				console.error('Error fetching location content:', e);
			}
		};

		if (!isLoaded) {
			setIsLoaded(true);
			fetchData();
		}
	}, [mParam, pageSlug, onDataChange, isLoaded]);

	if (!isLoaded || !caseContent) {
		return null;
	}

	const data = { content: caseContent };

	return <MagnifyCaseEl data={data?.content} />;
}
