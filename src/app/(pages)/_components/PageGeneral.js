'use client';

import PageModules from '@/components/PageModules';

export default function PageGeneral({ data }) {
	const { pageModules } = data || {};

	return (
		<div className="p-general c-small">
			{pageModules?.map((module, i) => (
				<PageModules key={`page-module-${i}`} module={module} />
			))}
		</div>
	);
}
