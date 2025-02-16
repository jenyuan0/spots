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

				return processedInput
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
					.replace(/[\s\W-]+/g, '-')
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
