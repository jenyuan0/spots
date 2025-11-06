export default function LocationHighlights({
	highlights,
	localizationHighlights,
}) {
	const { iconic, trending, editorsPick, onOurRadar } =
		localizationHighlights || {};
	const map = {
		iconic: iconic || 'Iconic',
		trending: trending || 'Trending',
		'editors-pick': editorsPick || 'Editor’s Pick',
		'on-our-radar': onOurRadar || 'On Our Radar',
	};
	return highlights?.map((tag) => map[tag] || tag).join(', ');
}
