export default function LocationHighlights({ highlights }) {
	const map = {
		'must-see': 'Must-See',
		trending: 'Trending',
		'editors-pick': 'Editor’s Pick',
		'on-our-radar': 'On Our Radar',
	};
	return highlights?.map((tag) => map[tag] || tag).join(', ');
}
