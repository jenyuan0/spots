import { useParams } from 'next/navigation';
import { formatLanguageCode, normalizeLanguageParam } from '@/lib/helpers';

export function useCurrentLang() {
	const { lang: langId } = useParams();
	const normalizeLangId = normalizeLanguageParam(langId);
	const langCode = formatLanguageCode(normalizeLangId);

	return [langCode, langId];
}
