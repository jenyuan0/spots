'use client';

import dynamic from 'next/dynamic';
import { suspend } from 'suspend-react';
import LiveQueryProvider from 'next-sanity/preview';

// suspend-react cache is global, so we use a unique key to avoid collisions
const UniqueKey = Symbol('@/sanity/lib/client');

export default function PreviewProvider({ children, token }) {
	const { client } = suspend(() => import('@/sanity/lib/client'), [UniqueKey]);

	if (!token) throw new TypeError('Missing token');
	return (
		<LiveQueryProvider
			client={client}
			token={token}
			// Uncomment below to see debug reports
			// logger={console}
		>
			{children}
		</LiveQueryProvider>
	);
}
