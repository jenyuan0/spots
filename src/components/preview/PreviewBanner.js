'use client';

export const PreviewBanner = () => {
	return (
		<>
			<div className="preview-banner">
				{'You are previewing unpublished changes'}
				<a className="exit-button user-select-disable" href="/api/exit-preview">
					Close preview
				</a>
			</div>

			<style jsx>{`
				:global(html) {
					padding-bottom: 47px;
				}

				.preview-banner {
					position: fixed;
					display: flex;
					width: 100%;
					bottom: 0;
					left: 0;
					padding: 10px 2vw;
					gap: 10px;
					align-items: center;
					justify-content: center;
					color: white;
					font: 14px/1 'Helvetica', sans-serif;
					background-color: rgba(69, 69, 69, 0.9);
					backdrop-filter: blur(5px);
					z-index: 10000;
				}

				.exit-button {
					height: 27px;
					white-space: nowrap;
					line-height: 27px;
					padding: 0 15px;
					border-radius: 14px;
					color: black;
					background-color: white;
				}
			`}</style>
		</>
	);
};
