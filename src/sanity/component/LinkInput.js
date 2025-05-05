import { LinkIcon, MasterDetailIcon, SearchIcon } from '@sanity/icons';
import { Autocomplete, Card, Flex, Stack, Text } from '@sanity/ui';
import React, { useCallback, useEffect, useState } from 'react';
import { set, unset } from 'sanity';
import { isValidUrl } from '@/lib/helpers';
import { getRoute } from '@/lib/routes';
import { client } from '@/sanity/lib/client';

const pageDocumentOrder = [
	'pHome',
	'pContact',
	'pGeneral',
	'pGuides',
	'gGuides',
	'gCategories',
	'pLocations',
	'gLocations',
	'gItineraries',
	'pTripBespoke',
	'pTripReady',
	'pHotelBooking',
];

const fetchOptions = async () => {
	const groqQuery = `* [_type in ${JSON.stringify(pageDocumentOrder)}] {
		title,
		_type,
		_id,
		"slug": slug.current,
	}`;

	const data = await client.fetch(groqQuery);

	return data
		.map(({ _type, slug, _id, title }) => ({
			value: getRoute({ documentType: _type, slug }),
			payload: {
				pageTitle:
					_type === 'pHome'
						? 'Home Page'
						: Array.isArray(title)
							? toPlainText(title)
							: title,
				_id,
				_type,
			},
		}))
		.sort(
			(a, b) =>
				(pageDocumentOrder.indexOf(a.payload._type) ||
					pageDocumentOrder.length) -
				(pageDocumentOrder.indexOf(b.payload._type) || pageDocumentOrder.length)
		);
};

const renderOption = (option) => {
	const { value, isNew, payload } = option;
	const { pageTitle } = payload;

	return (
		<Card as="button" padding={[4, 2]}>
			<Flex>
				{isNew ? (
					<LinkIcon style={{ fontSize: 36 }} />
				) : (
					<MasterDetailIcon style={{ fontSize: 36 }} />
				)}
				<Stack space={2} flex={1} paddingLeft={1}>
					<Text size={[1, 1, 2]} textOverflow="ellipsis">
						{pageTitle}
					</Text>
					<Text size={1} muted>
						{value}
					</Text>
				</Stack>
			</Flex>
		</Card>
	);
};

export const LinkInput = (props) => {
	const { elementProps, onChange, value = '' } = props;
	const [loading, setLoading] = useState(true);
	const [pageItemData, setPageItemData] = useState([]);
	const [optionsList, setOptionsList] = useState([]);

	const handleChange = useCallback(
		(value) => {
			return onChange(value ? set(value) : unset());
		},
		[onChange]
	);

	const handleQueryChange = useCallback(
		(query) => {
			const filteredOptions = pageItemData.filter(({ value, payload }) => {
				const queryLower = query?.toLowerCase();

				return (
					value.toLowerCase().includes(queryLower) ||
					payload.pageTitle.toLowerCase().includes(queryLower)
				);
			});

			const result = filteredOptions.length
				? filteredOptions
				: isValidUrl(query)
					? [
							{
								value: getRoute({ documentType: 'externalUrl', slug: query }),
								payload: { pageTitle: query },
								isNew: true,
							},
						]
					: [];

			setOptionsList(result);
		},
		[pageItemData]
	);

	useEffect(() => {
		const loadPageItems = async () => {
			setLoading(true);
			const result = await fetchOptions();
			setPageItemData(result);
			setOptionsList(result);
			setLoading(false);
		};
		loadPageItems();
	}, []);

	return (
		<Autocomplete
			{...elementProps}
			loading={loading}
			disabled={loading}
			options={optionsList}
			value={value}
			openButton
			filterOption={() => true}
			onChange={handleChange}
			onQueryChange={handleQueryChange}
			icon={SearchIcon}
			placeholder="Paste a link or search"
			renderOption={renderOption}
			renderValue={(value, option) => {
				if (!option) {
					return value;
				}

				return option.payload.pageTitle;
			}}
		/>
	);
};
