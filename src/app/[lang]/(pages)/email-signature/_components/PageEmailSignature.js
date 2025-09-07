'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';

export default function PageEmailSignature() {
	const COPY_TEXT_INITIAL = 'Click to copy';
	const COPY_TEXT_CLICKED = 'Copied!';
	const clipboardRef = useRef();
	const [buttonText, setButtonText] = useState(COPY_TEXT_INITIAL);

	const sitUrl = process.env.SITE_URL;

	const [name, setName] = useState('Ashley Lin');
	const [position, setPosition] = useState('Travel Advisor');

	const onHandleCopy = () => {
		setButtonText(COPY_TEXT_CLICKED);
		setTimeout(() => {
			setButtonText(COPY_TEXT_INITIAL);
		}, 2000);

		const range = document.createRange();

		range.setStart(clipboardRef.current, 0);
		range.setEndAfter(clipboardRef.current);
		window.getSelection()?.removeAllRanges();
		window.getSelection()?.addRange(range);
		document.execCommand('copy');
		window.getSelection()?.removeAllRanges();
	};

	const onHandleInputName = (e) => {
		setName(e.target.value);
	};

	const onHandleInputPosition = (e) => {
		setPosition(e.target.value);
	};

	return (
		<div className="p-email-signature c f-v f-j-c f-a-c">
			<div className="p-email-signature__inputs f-h f-j-c gap-2">
				<div className="c-field">
					<label htmlFor="email-signature-name">Name</label>
					<input
						id="email-signature-name"
						type="text"
						value={name}
						placeholder="Enter your name"
						onChange={onHandleInputName}
					/>
				</div>
				<div className="c-field">
					<label htmlFor="email-signature-name">Position</label>
					<input
						id="email-signature-position"
						type="text"
						value={position}
						placeholder="Enter your position"
						onChange={onHandleInputPosition}
					/>
				</div>
			</div>
			<div className="p-email-signature__content f-v f-a-c cr-black bg-white">
				<table
					ref={clipboardRef}
					style={{
						color: 'black',
						backgroundColor: 'transparent',
					}}
					border="0"
				>
					<tbody>
						<tr>
							<td style={{ paddingRight: '15px' }}>
								<a href={sitUrl} target="_blank" rel="noreferrer">
									<img
										width="80"
										height="80"
										alt="Spots Travel Logo"
										src="https://www.spotstravel.co/email-signature-logo.gif"
									/>
								</a>
							</td>
							<td
								style={{
									verticalAlign: 'middle',
									fontFamily: 'Helvetica, sans-serif',
									fontSize: '12px',
									lineHeight: 1.25,
									color: 'black',
								}}
							>
								<strong style={{ fontWeight: '700' }}>{name}</strong>
								<span>{position ? ` ${position}` : ' '}</span>
								<br />
								<a
									href={'https://www.instagram.com/spotstravel.co'}
									target="_blank"
									rel="noreferrer"
									style={{
										// textDecoration: 'underline',
										color: '#023a29',
									}}
								>
									Instagram
								</a>{' '}
								/{' '}
								<a
									href={'https://www.spotstravel.co'}
									target="_blank"
									rel="noreferrer"
									style={{
										// textDecoration: 'underline',
										color: '#023a29',
									}}
								>
									spotstravel.co
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<button
				type="button"
				className="p-email-signature__copy btn"
				onClick={onHandleCopy}
				aria-label="Click to copy email signature"
			>
				<span className="btn-label">{buttonText}</span>
			</button>

			<div className="p-email-signature__instructions f-v f-a-c">
				<p className="t-b-1">Instructions:</p>
				<ul className="p-email-signature__instructions__list f-h f-j-c f-w">
					<li>
						<Link
							href="https://support.google.com/mail/answer/8395?hl=en&co=GENIE.Platform%3DAndroid"
							target="_blank"
							rel="noreferrer"
							className="btn-underline"
						>
							Gmail (app)
						</Link>
					</li>
					<li>
						<Link
							href="https://support.google.com/mail/answer/8395?hl=en&co=GENIE.Platform%3DDesktop"
							target="_blank"
							rel="noreferrer"
							className="btn-underline"
						>
							Gmail (web)
						</Link>
					</li>
					<li>
						<Link
							href="https://www.hubspot.com/email-signature-generator/add-html-signature-mail-mac"
							target="_blank"
							rel="noreferrer"
							className="btn-underline"
						>
							Apple Mail (Mac)
						</Link>
					</li>
					<li>
						<Link
							href="https://support.dominionlending.ca/hc/en-us/articles/360061469614-How-do-I-add-my-email-signature-to-Apple-Mail-iPhone"
							target="_blank"
							rel="noreferrer"
							className="btn-underline"
						>
							IOS
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
