import * as React from 'react';
import clsx from 'clsx';
import { hasArrayValue } from '@/lib/helpers';

const Select = React.forwardRef(
	({ options, placeholder, className, ...props }, ref) => {
		if (!hasArrayValue(options)) return null;

		return (
			<select className={clsx(className)} ref={ref} {...props}>
				<option disabled={true} {...(!props.value ? { value: '' } : {})}>
					{placeholder || 'Select option'}
				</option>
				{options.map((item, index) => {
					const { value, title, isDefault } = item || {};
					const optionTitle = title || value;

					return (
						<option key={index} disabled={isDefault} value={item.value}>
							{optionTitle}
						</option>
					);
				})}
			</select>
		);
	}
);

Select.displayName = 'Select';

export default Select;
