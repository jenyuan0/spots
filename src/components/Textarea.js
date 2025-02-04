import * as React from 'react';
import clsx from 'clsx';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
	return <textarea className={clsx(className)} ref={ref} {...props} />;
});

Textarea.displayName = 'Textarea';

export default Textarea;
