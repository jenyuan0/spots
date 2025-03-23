import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import customImage from '@/sanity/schemas/objects/custom-image';
import { PriceInput } from '@/sanity/component/PriceInput';
import { getActivitiesPreview } from '@/sanity/lib/helpers';

const requiredIfCustom = ({ Rule }) => {
	Rule.custom((field, context) => {
		if (context.parent?.type === 'custom') {
			return field ? true : 'This field is required when type is custom';
		}
		return true;
	});
};

export default defineType({
	title: 'Itineraries',
	name: 'gItineraries',
	type: 'document',
	fields: [
		title(),
		{
			name: 'subtitle',
			type: 'string',
		},
		slug(),
		{
			name: 'images',
			type: 'array',
			of: [customImage({ hasCropOptions: true })],
		},
		{
			name: 'color',
			type: 'reference',
			to: [{ type: 'settingsBrandColors' }],
		},
		{
			name: 'startingColor',
			type: 'string',
			options: {
				list: [
					{ title: 'Green', value: 'green' },
					{ title: 'Blue', value: 'blue' },
					{ title: 'Red', value: 'red' },
					{ title: 'Orange', value: 'orange' },
					{ title: 'Purple', value: 'purple' },
				],
				layout: 'radio',
				direction: 'horizontal',
			},
			initialValue: 'green',
		},
		{
			title: 'Plan (by day)',
			name: 'plan',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'itineraryDay',
							type: 'reference',
							to: [{ type: 'gItinerariesDay' }],
						},
						{
							name: 'title',
							description: 'Defaults to date',
							type: 'string',
						},

						{
							title: 'Content (Highlight)',
							name: 'content',
							description:
								"Defaults to itinerary day's content when left empty",
							type: 'portableTextSimple',
						},
					],
					preview: {
						select: {
							title: 'title',
							dayTitle: 'itineraryDay.title',
							activities: 'itineraryDay.activities',
							images: 'itineraryDay.images',
						},
						prepare({ title, dayTitle, activities, images }) {
							return {
								title: title
									? `${title} (${dayTitle})`
									: dayTitle || 'Untitled',
								subtitle: getActivitiesPreview(activities),
								media: images?.[0] || false,
							};
						},
					},
				},
			],
		},
		{
			name: 'guides',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gGuides' }],
				},
			],
		},
		{
			name: 'type',
			type: 'string',
			options: {
				list: [
					{ title: 'Premade', value: 'premade' },
					{ title: 'Custom', value: 'custom' },
				],
				layout: 'radio',
				direction: 'horizontal',
			},
		},

		// PREMADE ITINERARIES
		{
			title: '# of Travelers',
			name: 'NumOfTravelers',
			type: 'number',
			hidden: ({ parent }) => parent.type !== 'premade',
		},
		{
			title: 'Budget (USD)',
			name: 'budget',
			type: 'object',
			hidden: ({ parent }) => parent.type !== 'premade',
			options: {
				columns: 2,
			},
			fields: [
				{
					title: 'Low',
					name: 'budgetLow',
					type: 'number',
					components: {
						field: PriceInput,
					},
				},
				{
					title: 'High',
					name: 'budgetHigh',
					type: 'number',
					components: {
						field: PriceInput,
					},
				},
			],
		},
		{
			name: 'accomodations',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gLocations' }],
					options: {
						filter: `_type == "gLocations" && references(*[_type == "gCategories" && slug.current == "hotels"]._id)`,
					},
				},
			],
			hidden: ({ parent }) => parent.type !== 'premade',
		},

		// CUSTOM ITINERARIES
		{
			name: 'passcode',
			type: 'string',
			hidden: ({ parent }) => parent.type !== 'custom',
		},
		{
			name: 'name',
			type: 'string',
			validation: (Rule) => requiredIfCustom({ Rule: Rule }),
			hidden: ({ parent }) => parent.type !== 'custom',
		},
		{
			name: 'startDate',
			description: 'Paris date (auto converted to the visitors local time)',
			type: 'date',
			options: {
				dateFormat: 'MM/DD/YY',
				calendarTodayLabel: 'Today',
			},
			validation: (Rule) => requiredIfCustom({ Rule: Rule }),
			hidden: ({ parent }) => parent.type !== 'custom',
		},
		{
			name: 'emergencyContact',
			type: 'portableTextSimple',
			hidden: ({ parent }) => parent.type !== 'custom',
		},
		{
			name: 'introMessage',
			type: 'portableTextSimple',
			hidden: ({ parent }) => parent.type !== 'custom',
		},
		{
			name: 'endingMessage',
			type: 'portableTextSimple',
			hidden: ({ parent }) => parent.type !== 'custom',
		},
		// {
		// 	name: 'flight',
		// 	type: 'string',
		// 	hidden: ({ parent }) => parent.type !== 'custom',
		// },
		{
			name: 'accomodation',
			type: 'object',
			hidden: ({ parent }) => parent.type !== 'custom',
			fields: [
				{
					name: 'accomodationLocation',
					type: 'reference',
					to: [{ type: 'gLocations' }],
					options: {
						filter: `_type == "gLocations" && references(*[_type == "gCategories" && slug.current == "hotels"]._id)`,
					},
				},
				{
					title: 'Check-in Time',
					name: 'accomodationCheckInTime',
					type: 'datetime',
				},
				{
					title: 'Check-out Time',
					name: 'accomodationCheckOutTime',
					type: 'datetime',
				},
				{
					title: 'Notes',
					name: 'accomodationNotes',
					type: 'portableTextSimple',
				},
				{
					title: 'Attachments',
					name: 'accomodationAttachments',
					type: 'array',
					of: [
						{
							name: 'file',
							type: 'file',
						},
					],
				},
			],
		},
		{
			title: 'Reservations',
			name: 'reservations',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							type: 'reference',
							name: 'location',
							to: [{ type: 'gLocations' }],
						},
						{
							name: 'startTime',
							type: 'datetime',
						},
						{
							name: 'endTime',
							type: 'datetime',
						},
						{
							name: 'notes',
							type: 'portableTextSimple',
						},
						{
							name: 'attachments',
							type: 'array',
							of: [
								{
									name: 'file',
									type: 'file',
								},
							],
						},
					],
					preview: {
						select: {
							title: 'location.title',
							startTime: 'startTime',
							endTime: 'endTime',
							images: 'location.images',
						},
						prepare({ title, startTime, endTime, images }) {
							// Helper functions for date/time formatting
							const formatTime = (date) => {
								if (!date) return '';
								return date.toLocaleString('en-US', {
									hour: 'numeric',
									minute: '2-digit',
									hour12: true,
								});
							};

							const formatDate = (date) => {
								if (!date) return '';
								return date.toLocaleString('en-US', {
									month: 'short',
									day: 'numeric',
								});
							};
							// Early return for missing location
							if (!title) {
								return {
									title,
									subtitle: '[Missing location]',
									media: <span>⚠️</span>,
								};
							}

							// Early return for missing start time
							if (!startTime) {
								return {
									title,
									subtitle: '[Missing time]',
									media: <span>⚠️</span>,
								};
							}

							const start = new Date(startTime);
							const end = endTime ? new Date(endTime) : null;

							// Validate dates
							if (end && end <= start) {
								return {
									title,
									subtitle: `[End time must be later than start time] ${formatDate(start)}, ${formatTime(start)}`,
									media: <span>⚠️</span>,
								};
							}

							// Generate time range string
							const timeRange = end
								? start.toDateString() === end.toDateString()
									? `${formatDate(start)}, ${formatTime(start)}—${formatTime(end)}`
									: `${formatDate(start)}, ${formatTime(start)}—${formatDate(end)}, ${formatTime(end)}`
								: `${formatDate(start)}, ${formatTime(start)}`;

							return {
								title,
								subtitle: timeRange,
								media: images?.[0] || false,
							};
						},
					},
				},
			],
			hidden: ({ parent }) => parent.type !== 'custom',
		},

		sharing({ disableIndex: true }),
	],
	preview: {
		select: {
			title: 'title',
			slug: 'slug',
		},
		prepare({ title = 'Untitled', slug = {} }) {
			return {
				title,
				subtitle: slug.current ? `/${slug.current}` : 'Missing page slug',
			};
		},
	},
});
