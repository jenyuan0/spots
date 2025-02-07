import { colorInput } from '@sanity/color-input';
import { visionTool } from '@sanity/vision';
import { defineConfig, isDev } from 'sanity';
import { structureTool } from 'sanity/structure';
import { media } from 'sanity-plugin-media';
import { getWindowURl } from '@/lib/routes';
import deskStructure from './src/sanity/deskStructure';
import {
	apiVersion,
	dataset,
	previewSecretId,
	projectId,
	googleMapAPI,
} from './src/sanity/env';
import { googleMapsInput } from '@sanity/google-maps-input';
import pGeneral from '/src/sanity/schemas/documents/p-general';
import p404 from './src/sanity/schemas/documents/p-404';
import schemas from './src/sanity/schema';
import { portableTable } from './src/sanity/lib/portable-table';
import { noteField } from 'sanity-plugin-note-field';

export const previewBaseURL = '/api/preview';
export const previewDocumentTypes = [pGeneral.name, p404.name];
const allowDuplicateDocumentTypes = ['pGeneral', 'gGuides', 'settingsRedirect'];

const commonPlugins = [
	structureTool({
		structure: deskStructure,
	}),
	media(),
	colorInput(),
	portableTable(),
	noteField(),
	googleMapsInput({
		apiKey: googleMapAPI,
	}),
];

const devPlugins = [
	...commonPlugins,
	visionTool({ defaultApiVersion: apiVersion }),
];

export default defineConfig({
	basePath: '/sanity',
	title: 'SPOTS Paris',
	projectId,
	dataset,
	plugins: isDev ? devPlugins : commonPlugins,
	schema: {
		types: schemas,
	},
	document: {
		productionUrl: async (prev, context) => {
			// context includes the client and other details
			const { document } = context;
			const { slug, _type, _id } = document;
			if (previewDocumentTypes.includes(_type)) {
				const url = `${getWindowURl(
					window.location.host
				)}${previewBaseURL}?documentType=${_type}&docId=${_id}&secret=${previewSecretId}${
					slug?.current ? `&slug=${slug?.current}` : ''
				}`;

				return url;
			}
			return prev;
		},
		actions: (prev, context) => {
			const { schemaType } = context;
			return prev.map((originalAction) => {
				if (
					originalAction.action === 'duplicate' &&
					!allowDuplicateDocumentTypes.includes(schemaType)
				) {
					return () => null;
				}

				return originalAction;
			});
		},
	},
});
