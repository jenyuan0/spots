import clsx from 'clsx';
import React, {
	useEffect,
	useState,
	useRef,
	useCallback,
	useMemo,
} from 'react';
import Button from '@/components/Button';
import Field from '@/components/Field';
import { motion } from 'framer-motion';
import { useCurrentLang } from '@/hooks/useCurrentLang';

export default function NewsletterForm({ data, plan }) {
	const [currentLanguageCode] = useCurrentLang();
	const { heading, audienceID, successMessage, errorMessage } = data || {};
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const placeholder = 'Your Email';

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
				if (data.error) {
					setIsError(data.error);
				} else {
					setIsError(errorMessage);
				}
			} else {
				setIsSuccess(true);
			}
		} catch (error) {
			console.log('error', error);
		}
	};

	return (
		<div className="g-planner-form c-form">
			<div className="c-newsletter">
				<div className="c-newsletter__header wysiwyg">
					<h3 className="c-newsletter__heading t-h-2">Join the Inner Circle</h3>
					<p className="c-newsletter__paragraph t-h-4">
						Curated hotel picks, seasonal offers, and hidden perks.
						Occasionally, not often.
					</p>
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
						Sign Up
					</Button>
				</form>

				<div className="c-newsletter__footer">
					{isSuccess ? (
						<motion.div
							className="c-newsletter__success"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.4 }}
						>
							{successMessage ? (
								<CustomPortableText blocks={successMessage} />
							) : (
								'Success. Thank you.'
							)}
						</motion.div>
					) : (
						isError && (
							<motion.div
								className="c-newsletter__error cr-accent"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.4 }}
							>
								{Array.isArray(isError) ? (
									<CustomPortableText blocks={isError} />
								) : (
									isError ||
									'There was an issue submitting, please try again later.'
								)}
							</motion.div>
						)
					)}
				</div>
			</div>
		</div>
	);
}
