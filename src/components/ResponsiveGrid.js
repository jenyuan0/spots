import clsx from 'clsx';

export default function ResponsiveGrid({ className, children, size = 'med' }) {
	return (
		<div className={clsx('c-responsive-grid', className)} data-size={size}>
			<div className="c-responsive-grid__grid">{children}</div>
		</div>
	);
}
