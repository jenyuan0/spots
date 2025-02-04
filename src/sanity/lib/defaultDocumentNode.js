import { previewDocumentTypes } from '/sanity.config';
import { getPreviewDocumentNode } from '@/sanity/desk/previews/getPreviewDocumentNode';

export const defaultDocumentNode = (S, { schemaType }) => {
	if (previewDocumentTypes.includes(schemaType)) {
		return S.document().views(getPreviewDocumentNode(S));
	}

	return S.document().views([S.view.form()]);
};
