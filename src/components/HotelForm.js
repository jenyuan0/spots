import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import Field from '@/components/Field';
import { IconWhatsApp, IconEmail } from '@/components/SvgIcons';
import { client } from '@/sanity/lib/client';

export default function HotelForm({ data }) {
	const [content, setContent] = useState();
	const fetchContent = async () => {
		try {
			const data = await Promise.all([
				client.fetch(`
					*[_type == "pHotelBooking"][0]{
						contactHeading,
						contactSubheading,
						contactPlaceholder
					}
				`),
			]);
			setContent(data[0]);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		fetchContent();
	}, []);

	const [subject] = useState(data?.subject ?? 'Hotel search');
	const [heading, setHeading] = useState(data?.heading ?? '');
	const [subheading, setSubheading] = useState(data?.subheading ?? '');
	const [placeholder, setPlaceholder] = useState(data?.placeholder ?? '');
	const [message, setMessage] = useState('');

	useEffect(() => {
		if (content) {
			setHeading(data?.heading ?? content.contactHeading ?? '');
			setSubheading(data?.subheading ?? content.contactSubheading ?? '');
			setPlaceholder(data?.placeholder ?? content.contactPlaceholder ?? '');
			setMessage(data?.placeholder ?? content.contactPlaceholder ?? '');
		}
	}, [data, content]);

	return (
		<div className="g-hotel-form">
			<div className="g-hotel-form__header wysiwyg">
				{heading && <h2 className="t-h-1">{heading}</h2>}
				{subheading && <p className="t-h-4">{subheading}</p>}
			</div>
			<div className="g-hotel-form__body">
				<Field
					type={'textarea'}
					isHideLabel={true}
					placeholder={placeholder}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
			</div>
			<div className="g-hotel-form__footer">
				<div className="g-hotel-form__cta">
					<Button
						icon={<IconWhatsApp />}
						className={'btn cr-green-d'}
						href={`https://wa.me/33686047390?text=${encodeURI(message)}`}
						isNewTab={true}
					>
						Send via WhatsApp
					</Button>
					<div className="t-l-2 cr-subtle-5">Or</div>
					<Button
						icon={<IconEmail />}
						className={'btn cr-blue-d'}
						href={`mailto:vip@spotstravel.co?subject=${encodeURI(subject)}&body=${encodeURI(message)}`}
						isNewTab={true}
					>
						Send via Email
					</Button>
				</div>
			</div>
		</div>
	);
}
