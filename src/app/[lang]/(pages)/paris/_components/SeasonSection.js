'use client';

import React, { useEffect, useState } from 'react';
import Link from '@/components/CustomLink';

export default function SeasonSection({ data }) {
	const { seasonsTitle, seasons, localization } = data;
	const { guideComingSoon } = localization || {};

	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) return null;

	return (
		<section className="p-paris__season">
			<div className="p-paris__season__table">
				<h2 className="p-paris__season__heading t-h-2">{seasonsTitle}</h2>
				{seasons.map((season, index) => {
					const { name, description, months, guide } = season;
					const headerContent = (hasCaret) => (
						<>
							{name && (
								<h3 className="t-h-5">
									{name}
									{hasCaret && <span className="icon-caret-right" />}
								</h3>
							)}
							{description && <p className="t-b-2">{description}</p>}
						</>
					);

					return (
						<div
							key={`${name}-${index}`}
							className="p-paris__season__table__section"
						>
							<div className="p-paris__season__table__header">
								{guide ? (
									<Link
										href={`/paris/guides/${guide.slug}`}
										className="p-paris__season__table__header-link"
									>
										{headerContent(true)}
									</Link>
								) : (
									<div className="p-paris__season__table__header-content">
										{headerContent(false)}
									</div>
								)}
							</div>
							<ul className="p-paris__season__table__body">
								{months?.map((month) => (
									<li key={month.name}>
										{month.guide ? (
											<h4 className="t-h-4">
												<Link href={`/paris/guides/${month.guide.slug}`}>
													{month.name}
												</Link>
											</h4>
										) : (
											<>
												<h4 className="t-h-4">{month.name}</h4>
												<div className="pill">
													{guideComingSoon || 'Guide Coming Soon'}
												</div>
											</>
										)}
									</li>
								))}
							</ul>
						</div>
					);
				})}
			</div>
		</section>
	);
}
