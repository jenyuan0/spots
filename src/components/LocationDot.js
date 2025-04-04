import { useState, useEffect } from 'react';
import Link from '@/components/CustomLink';
import useMagnify from '@/hooks/useMagnify';
import useKey from '@/hooks/useKey';
import { getRandomInt } from '@/lib/helpers';

export default function LocationDot({ data, initialLightOrDark }) {
	const { slug, color } = data;
	const [lightOrDark, setLightOrDark] = useState(initialLightOrDark);
	const setMag = useMagnify((state) => state.setMag);
	const { hasPressedKeys } = useKey();

	useEffect(() => {
		if (!lightOrDark) {
			setLightOrDark(getRandomInt(0, 10) % 2 ? 'l' : 'd');
		}
	}, []);

	return (
		<Link
			className="c-location-dot"
			style={{ '--cr-primary': `var(--cr-${color}-${lightOrDark})` }}
			href={`/locations/${slug}`}
			{...(!hasPressedKeys && {
				onClick: (e) => {
					e.preventDefault();
					setMag({
						slug,
						type: 'location',
						color,
					});
				},
			})}
		/>
	);
}
