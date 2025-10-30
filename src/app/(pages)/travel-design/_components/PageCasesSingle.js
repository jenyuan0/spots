'use client';

import React from 'react';
import MagnifyCaseEl from '@/layout/Magnify/MagnifyCaseEl';

export default function PageCasesSingle({ data }) {
	return (
		<div className="p-case-single">
			<MagnifyCaseEl data={data} />
		</div>
	);
}
