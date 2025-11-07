const ModeCard = ({ icon: Icon, title, description, onClick }) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex h-full flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 text-left transition hover:border-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
		>
			<Icon className="h-5 w-5 text-slate-400" aria-hidden="true" />
			<div className="space-y-1">
				<h3 className="text-lg font-semibold text-white">{title}</h3>
				<p className="text-sm text-slate-400">{description}</p>
			</div>
		</button>
	);
};

export default ModeCard;
