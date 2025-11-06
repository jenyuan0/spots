import { useParams } from 'next/navigation';
import { formatLanguageCode } from '@/lib/helpers';

export function useCurrentLang() {
	const { lang: langId } = useParams();
	const langCode = formatLanguageCode(langId);

	return [langCode, langId];
}
