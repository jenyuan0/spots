export default function ResponsiveGrid({ children, size = 'med' }) {
	return (
		<div className="c-responsive-grid" data-size={size}>
			<div className="c-responsive-grid__grid">{children}</div>
		</div>
	);
}
