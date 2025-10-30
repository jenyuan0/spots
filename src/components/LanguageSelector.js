import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { hasArrayValue } from '@/lib/helpers';
import { i18n } from '../../languages.js';
import * as Flags from 'country-flag-icons/react/3x2';

const generateUrl = (languageId, pathname) => `/${languageId}/${pathname}`;

const stripLangFromPath = (pathname, currentLangCode) => {
	if (!pathname || !currentLangCode) return pathname;
	const segments = pathname.split('/').filter(Boolean);
	if (segments[0]?.toLowerCase() === currentLangCode.toLowerCase()) {
		segments.shift();
	}
	return segments.join('/');
};

const FlagIcon = ({ country }) => {
	if (!country) return <Flags.US className="c-language-selector__flag" />;
	const Flag = Flags[country.toUpperCase()];
	return Flag ? (
		<Flag className="c-language-selector__flag" />
	) : (
		<Flags.US className="c-language-selector__flag" />
	);
};

const LanguageSelector = () => {
	const [currentLanguageCode] = useCurrentLang();
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef(null);

	const currentSlug = stripLangFromPath(pathname, currentLanguageCode);
	const currentLanguage =
		i18n.languages.find((lang) => lang.id === currentLanguageCode) ||
		i18n.defaultLanguage;

	const handleLanguageChange = useCallback(() => {
		setIsOpen(false);
	}, []);

	const handleKeyDown = useCallback(
		(e, index) => {
			if (!isOpen) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					setIsOpen(true);
				}
				return;
			}

			switch (e.key) {
				case 'Escape':
					e.preventDefault();
					setIsOpen(false);
					break;
				case 'ArrowDown':
					e.preventDefault();
					const nextIndex = (index + 1) % i18n.languages.length;
					document.getElementById(`lang-option-${nextIndex}`)?.focus();
					break;
				case 'ArrowUp':
					e.preventDefault();
					const prevIndex =
						(index - 1 + i18n.languages.length) % i18n.languages.length;
					document.getElementById(`lang-option-${prevIndex}`)?.focus();
					break;
				default:
					break;
			}
		},
		[isOpen]
	);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}
	}, [isOpen]);

	if (!hasArrayValue(i18n.languages)) return null;

	return (
		<div className="c-language-selector" ref={containerRef}>
			<button
				className={clsx('c-language-selector__trigger f-h f-j-c f-a-c', {
					'is-open': isOpen,
				})}
				onClick={() => setIsOpen(!isOpen)}
				onKeyDown={(e) => handleKeyDown(e, 0)}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-label={`Select language. Current: ${currentLanguage?.title}`}
			>
				<span className="c-language-selector__trigger-content f-h f-a-c">
					<FlagIcon country={currentLanguage?.country} />
					<span className="c-language-selector__label t-l-2">
						{currentLanguage?.subtitle}
					</span>
				</span>
				<svg
					className="c-language-selector__icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</button>

			{isOpen && (
				<ul
					className="c-language-selector__options"
					role="listbox"
					aria-label="Language options"
				>
					{i18n.languages.map((language, index) => (
						<li key={language.id} role="presentation">
							<Link
								id={`lang-option-${index}`}
								href={generateUrl(language.id, currentSlug)}
								onClick={() => handleLanguageChange(language.id)}
								onKeyDown={(e) => handleKeyDown(e, index)}
								className={clsx('c-language-selector__option f-h f-a-c', {
									'is-active': currentLanguage?.id === language.id,
								})}
								role="option"
								aria-selected={currentLanguage?.id === language.id}
								tabIndex={currentLanguage?.id === language.id ? 0 : -1}
							>
								<FlagIcon country={language.country} />
								<span className="c-language-selector__label t-l-2">
									{language.title}
								</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default LanguageSelector;
