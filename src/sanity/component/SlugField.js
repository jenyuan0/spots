import { Card, Flex, Text } from '@sanity/ui';
import { useFormValue } from 'sanity';
import { previewBaseURL } from '/sanity.config';

import { getWindowURl } from '@/lib/routes';
import { previewSecretId } from '@/sanity/env';

export function getUrl({ docType, slug, docId, isPreview }) {
	const baseUrl = getWindowURl(window.location.host);
	const baseApiUrl = isPreview ? previewBaseURL : '/api/view-page';
	const queryParams = [];

	queryParams.push(`documentType=${docType}`);
	queryParams.push(`docId=${docId}`);

	if (isPreview) {
		queryParams.push(`secret=${previewSecretId}`);
	}

	if (slug) {
		queryParams.push(`slug=${slug}`);
	}

	const queryString = queryParams.join('&');
	const url = `${baseUrl}${baseApiUrl}?${queryString}`;

	return url;
}

export const SlugField = (props) => {
	const { children, title, description, value = '' } = props;
	const docType = useFormValue([`_type`]);
	const docId = useFormValue([`_id`]);

	const pageUrl = getUrl({
		docType,
		docId,
		slug: value.current,
	});

	const previewPageUrl = getUrl({
		docType,
		docId,
		slug: value.current,
		isPreview: true,
	});

	return (
		<Card tone={value?.length > 15 ? 'caution' : 'positive'}>
			<Card paddingY={2}>
				<Flex>
					<Card flex={1}>
						<Text size={1} weight="semibold">
							{title}
						</Text>
					</Card>
					<Flex>
						<Text size={1} weight="semibold">
							<a href={pageUrl} target="_blank">
								View page
							</a>
						</Text>
						<Card marginLeft={3}>
							<Text size={1} weight="semibold">
								<a href={previewPageUrl} target="_blank">
									Preview changes
								</a>
							</Text>
						</Card>
					</Flex>
				</Flex>
			</Card>
			<Card paddingTop={1} paddingBottom={2}>
				<Text size={1} muted>
					{description}
				</Text>
			</Card>
			<Card>{children}</Card>
		</Card>
	);
};
