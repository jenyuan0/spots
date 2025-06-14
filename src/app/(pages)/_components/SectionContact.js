'use client';

import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import CustomPortableText from '@/components/CustomPortableText';
import Button from '@/components/Button';
import Field from '@/components/Field';
import { useInView } from 'react-intersection-observer';
import { IconWhatsApp, IconEmail } from '@/components/SvgIcons';

export default function SectionContact({ data }) {
	const { contactHeading, contactSubheading, contactPlaceholder } = data;
	const [subject, setSubject] = useState('Hotel search');
	const [message, setMessage] = useState(null);

	useEffect(() => {
		setMessage(contactPlaceholder);
	}, [contactPlaceholder]);

	return (
		<section className={'p-booking__contact'}>
			<div className="p-booking__contact__header wysiwyg">
				<h2 className="t-h-1">{contactHeading}</h2>
				<p className="t-h-4">{contactSubheading}</p>
			</div>
			<div className="p-booking__contact__body">
				<Field
					type={'textarea'}
					isHideLabel={true}
					placeholder={contactPlaceholder}
					onChange={(e) => setMessage(e.target.value)}
				/>
			</div>
			<div className="p-booking__contact__footer">
				<div className="p-booking__contact__cta">
					<Button
						icon={<IconWhatsApp />}
						className={'btn cr-green-d'}
						href={`https://wa.me/33686047390?text=${encodeURI(message)}`}
						target={'_blank'}
					>
						Send via WhatsApp
					</Button>
					<div className="t-l-2 cr-subtle-5">Or</div>
					<Button
						icon={<IconEmail />}
						className={'btn cr-blue-d'}
						href={`mailto:vip@spotstravel.co?subject=${encodeURI(subject)}&body=${encodeURI(message)}`}
						target={'_blank'}
					>
						Send via Email
					</Button>
				</div>
			</div>
		</section>
	);
}
