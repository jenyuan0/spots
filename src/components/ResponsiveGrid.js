export default function ResponsiveGrid({ children }) {
	return (
		<div className="c-responsive-grid">
			<div className="c-responsive-grid__grid">{children}</div>
		</div>
	);
}
