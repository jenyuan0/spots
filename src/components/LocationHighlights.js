export default function LocationHighlights({ highlights }) {
	const map = {
		iconic: 'Iconic',
		trending: 'Trending',
		'editors-pick': 'Editor’s Pick',
		'on-our-radar': 'On Our Radar',
	};
	return highlights?.map((tag) => map[tag] || tag).join(', ');
}
