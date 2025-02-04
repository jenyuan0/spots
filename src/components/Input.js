import * as React from 'react';
import clsx from 'clsx';

const Input = React.forwardRef(
	({ className, type = 'text', ...props }, ref) => {
		return (
			<input type={type} className={clsx(className)} ref={ref} {...props} />
		);
	}
);

Input.displayName = 'Input';

export default Input;
