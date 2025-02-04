import React from 'react';
import TablePortableText from './TablePortableText';

export default function PortableTable({ blocks, className }) {
	if (!blocks) return null;
	const { rows } = blocks;

	return (
		<div className="c-portable-table">
			<table>
				<tbody>
					{rows.map((row) => (
						<tr key={row._key}>
							{row?.cells.map((cell, index) => {
								const { text } = cell;
								return (
									<td key={row._key + index}>
										<TablePortableText blocks={text} />
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
