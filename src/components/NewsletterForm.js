import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import CustomPortableText from '@/components/CustomPortableText';
import Button from '@/components/Button';
import Field from '@/components/Field';
import { motion } from 'framer-motion';
import { useCurrentLang } from '@/hooks/useCurrentLang';

export default function NewsletterForm({ localization }) {
	const [currentLanguageCode, currentLanguageCodeDisplay] = useCurrentLang();
	const [content, setContent] = useState();
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const { newsletterSignUpLabel } = localization || {};
	const placeholder = 'Your Email';

	useEffect(() => {
		const controller = new AbortController();
		const docType = 'gNewsletter';

		(async () => {
			try {
				const doc = await client.fetch(
					`coalesce(
						*[_type == $docType && language == $language][0],
						*[_type == $docType && language == "en"][0]
					){
						heading,
						paragraph,
						successMessage,
						errorMessage
					}`,
					{ docType, language: currentLanguageCode },
					{ signal: controller.signal }
				);

				setContent(doc || {});
			} catch (error) {
				if (error.name !== 'AbortError') {
					console.error('Error fetching data:', error);
				}
			}
		})();
		return () => controller.abort();
	}, [currentLanguageCode]);

	const onHandleSubmit = async (event) => {
		event.preventDefault();
		const payload = {
			audienceId: '5b1914fc2a',
			email: event.target.querySelector('[name="email"]')?.value,
		};

		try {
			const response = await fetch('/api/mailchimp/add-list-member', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const data = await response.json();

				setIsError(
					data.error ||
						errorMessage ||
						'Something went wrong. Please try again later.'
				);
				setIsSuccess(false);
			} else {
				setIsSuccess(true);
				setIsError(false);
			}
		} catch (error) {
			console.log('error', error);
		}
	};

	return (
		<div className="g-planner-form">
			<div className="c-newsletter">
				<div className="c-newsletter__pulse" />
				<div className="c-newsletter__header wysiwyg">
					{content?.heading && (
						<h3 className="c-newsletter__heading t-h-2">{content.heading}</h3>
					)}
					{content?.paragraph && (
						<p className="c-newsletter__paragraph t-h-4">{content.paragraph}</p>
					)}
				</div>
				<form className={'c-newsletter__form'} onSubmit={onHandleSubmit}>
					<Field
						type="email"
						name="email"
						label="Email"
						placeholder={placeholder}
						className="c-newsletter__input"
						isHideLabel
						required
					/>
					<Button className={'btn cr-green-d js-gtm-newsletter-email'}>
						{newsletterSignUpLabel}
					</Button>
				</form>
				<div className="c-newsletter__footer">
					{isSuccess ? (
						<motion.div
							className="c-newsletter__success"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.2 }}
						>
							{content?.successMessage ? (
								<CustomPortableText blocks={content.successMessage} />
							) : (
								'Almost there. Please check your inbox to confirm your sign up.'
							)}
						</motion.div>
					) : (
						isError && (
							<motion.div
								className="c-newsletter__error"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.2 }}
							>
								{Array.isArray(isError) ? (
									<CustomPortableText blocks={isError} />
								) : (
									isError ||
									(content?.errorMessage && (
										<CustomPortableText blocks={content.errorMessage} />
									))
								)}
							</motion.div>
						)
					)}
				</div>
			</div>
		</div>
	);
}
