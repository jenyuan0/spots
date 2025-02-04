import { previewBaseURL } from '/sanity.config';
import Iframe from 'sanity-plugin-iframe-pane';
import { getWindowURl } from '@/lib/routes';
import { previewSecretId } from '@/sanity/env';

export function getPreviewUrl(doc) {
	const { _type, slug, _id } = doc || {};
	const url = `${getWindowURl(
		window.location.host
	)}${previewBaseURL}?documentType=${_type}&docId=${_id}&secret=${previewSecretId}${
		slug?.current ? `&slug=${slug?.current}` : ''
	}`;
	return url;
}

export const iframeOptions = {
	url: (doc) => getPreviewUrl(doc),
	urlSecretId: previewSecretId,
	loader: true,
	reload: {
		button: true,
		revision: true,
	},
};

export const getPreviewDocumentNode = (S) => {
	return [
		S.view.form(),
		S.view.component(Iframe).options(iframeOptions).title('Preview'),
	];
};
