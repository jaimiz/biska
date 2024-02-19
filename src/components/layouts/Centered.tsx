export function Centered(props: { children: React.ReactNode }) {
	return (
		<div className="flex grow flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 space-y-5">
			{props.children}
		</div>
	);
}
