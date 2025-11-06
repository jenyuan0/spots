import { PinIcon } from '@sanity/icons';
import title from '@/sanity/schemas/objects/title';

export default function locationList({
	showStartTime = false,
	showFallbackRains = false,
	showFallbackWait = false,
} = {}) {
	return {
		name: 'locationList',
		type: 'object',
		icon: PinIcon,
		fields: [
			title({
				initialValue: 'Spots worth visiting',
				required: false,
			}),
			...(showStartTime
				? [
						{
							name: 'startTime',
							type: 'hourSelect',
						},
					]
				: []),
			{
				name: 'content',
				type: 'portableTextSimple',
			},
			{
				name: 'locations',
				type: 'array',
				of: [
					{
						type: 'reference',
						to: [{ type: 'gLocations' }],
						options: {
							filter: '_type == "gLocations" && language == "en"',
						},
					},
				],
			},
			...(showFallbackRains
				? [
						{
							title: 'Location Fallbacks (Rain)',
							name: 'fallbackRains',
							type: 'array',
							of: [
								{
									type: 'reference',
									to: [{ type: 'gLocations' }],
									options: {
										filter: '_type == "gLocations" && language == "en"',
									},
								},
							],
						},
					]
				: []),
			...(showFallbackWait
				? [
						{
							title: 'Location Fallbacks (Long Wait)',
							name: 'fallbackLongWait',
							type: 'array',
							of: [
								{
									type: 'reference',
									to: [{ type: 'gLocations' }],
									options: {
										filter: '_type == "gLocations" && language == "en"',
									},
								},
							],
						},
					]
				: []),
		],
		preview: {
			select: {
				title: 'title',
				startTime: 'startTime',
				location0: 'locations.0.title',
				location1: 'locations.1.title',
				location2: 'locations.2.title',
				location3: 'locations.3.title',
				location4: 'locations.4.title',
			},
			prepare({
				title,
				startTime,
				location0,
				location1,
				location2,
				location3,
				location4,
				images,
			}) {
				const locationTitles = [
					location0,
					location1,
					location2,
					location3,
					location4,
				].filter(Boolean);
				const subtitle =
					locationTitles.length > 0
						? `${locationTitles.join(' • ')}`
						: 'No locations';

				return {
					title: `${`[Location List] ${title || 'Untitled'}`}${showStartTime ? ` @ ${startTime || '[No specific time]'}` : ''}`,
					subtitle: subtitle,
					media: images?.[0] || PinIcon,
				};
			},
		},
	};
}
