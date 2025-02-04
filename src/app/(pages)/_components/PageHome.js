'use client';

import PageModules from '@/components/PageModules';

export default function PageHome({ data }) {
	const { pageModules } = data || {};

	return (
		<div className="p-home">
			{pageModules &&
				pageModules?.map((module, i) => (
					<PageModules key={i} module={module} />
				))}
		</div>
	);
}
