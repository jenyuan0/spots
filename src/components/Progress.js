'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import clsx from 'clsx';

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		className={clsx('c-progress', className)}
		data-progress={value}
		{...props}
	>
		<ProgressPrimitive.Indicator
			className="c-progress__indicator"
			style={{
				transform: `scaleX(${value > 100 ? 0 : value / 100})`,
			}}
		/>
	</ProgressPrimitive.Root>
));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
