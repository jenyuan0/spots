import { SlugField } from '@/sanity/component/SlugField';
import pinyin from 'pinyin';

export default function slug({ initialValue, readOnly, group } = {}) {
	return {
		title: 'Slug (Page URL)',
		name: 'slug',
		type: 'slug',
		components: {
			field: SlugField,
		},
		options: {
			source: 'title',
			maxLength: 200,
			slugify: (input) => {
				if (!input) return '';
				// Detect if the input contains Chinese characters
				const hasChinese = /[\u4E00-\u9FFF]/.test(input);

				// Convert Chinese to Pinyin if Chinese characters are detected
				const processedInput = hasChinese
					? pinyin(input, {
							style: pinyin.STYLE_NORMAL,
							heteronym: false,
						}).join(' ')
					: input;

				// Convert common ligatures to their regular character equivalents
				const decomposedInput = processedInput
					// Latin ligatures
					.replace(/œ/g, 'oe')
					.replace(/æ/g, 'ae')
					.replace(/Œ/g, 'OE')
					.replace(/Æ/g, 'AE')
					// Germanic ligatures
					.replace(/ĳ/g, 'ij')
					.replace(/Ĳ/g, 'IJ')
					// Historical ligatures
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
					.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
					.replace(/'/g, '') // Remove apostrophes
					.replace(/[\s\W-]+/g, '-') // Convert other non-word chars to hyphens
					.replace(/^-+|-+$/g, '')
					.slice(0, 200);
			},
		},
		validation: (Rule) => [Rule.required()],
		initialValue: initialValue,
		readOnly: readOnly,
		group: group,
	};
}
