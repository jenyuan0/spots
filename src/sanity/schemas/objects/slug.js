import { SlugField } from '@/sanity/component/SlugField';
import pinyin from 'pinyin';

export async function isUniqueOtherThanLanguage(slug, context) {
	const { document, getClient } = context;
	if (!document?.language) {
		return true;
	}
	const client = getClient({ apiVersion: '2025-02-19' });
	const id = document._id.replace(/^drafts\./, '');
	const params = {
		id,
		language: document.language,
		slug,
	};
	const query = `!defined(*[
    !(sanity::versionOf($id)) &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`;
	const result = await client.fetch(query, params);
	return result;
}

export default function slug({ initialValue, readOnly, group } = {}) {
	return {
		title: 'Slug (Page URL)',
		name: 'slug',
		type: 'slug',
		components: { field: SlugField },
		options: {
			source: 'title',
			maxLength: 200,
			slugify: (input) => {
				if (!input) return '';
				// Detect Chinese
				const hasChinese = /[\u4E00-\u9FFF]/.test(input);
				const processedInput = hasChinese
					? pinyin(input, {
							style: pinyin.STYLE_NORMAL,
							heteronym: false,
						}).join(' ')
					: input;

				// Normalize apostrophes and fix possessives
				const unifiedApostrophes = processedInput.replace(
					/[\u2019\u2018\u02BC\u2032\uFF07]/g,
					"'"
				);
				const possessivesFixed = unifiedApostrophes
					// Convert singular possessives: "Friend's" -> "Friends"
					.replace(/([A-Za-z0-9])'s\b/gi, '$1s')
					// Convert plural possessives: "Friends'" -> "Friends"
					.replace(/([A-Za-z0-9]+)'\b/gi, '$1');
				let baseForSlug = possessivesFixed;

				// Ligatures → plain
				const decomposedInput = baseForSlug
					.replace(/œ/g, 'oe')
					.replace(/æ/g, 'ae')
					.replace(/Œ/g, 'OE')
					.replace(/Æ/g, 'AE')
					.replace(/ĳ/g, 'ij')
					.replace(/Ĳ/g, 'IJ')
					.replace(/ﬀ/g, 'ff')
					.replace(/ﬁ/g, 'fi')
					.replace(/ﬂ/g, 'fl')
					.replace(/ﬃ/g, 'ffi')
					.replace(/ﬄ/g, 'ffl')
					.replace(/ﬅ/g, 'ft')
					.replace(/ﬆ/g, 'st');

				return decomposedInput
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[’'`]/g, '')
					.replace(/[^\p{Letter}\p{Number}\s-]+/gu, '')
					.replace(/[\s\W-]+/g, '-')
					.replace(/^-+|-+$/g, '')
					.slice(0, 200);
			},
			isUnique: isUniqueOtherThanLanguage,
		},
		validation: (Rule) => [Rule.required()],
		initialValue: initialValue,
		readOnly: readOnly,
		group: group,
	};
}
