const ModeCard = ({ icon: Icon, badge, title, description, onClick }) => {
        return (
                <button
                        type="button"
                        onClick={onClick}
                        className="group relative flex h-full flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-left text-slate-100 transition hover:-translate-y-1 hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-100"
                >
                        <div className="flex items-center justify-between">
                                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-200">
                                        <Icon className="h-6 w-6" aria-hidden="true" />
                                </span>
                                {badge ? (
                                        <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                                                {badge}
                                        </span>
                                ) : null}
                        </div>
                        <div className="space-y-2">
                                <h3 className="font-montserrat text-xl font-semibold text-white">{title}</h3>
                                <p className="text-sm text-slate-300 font-montserrat">{description}</p>
                        </div>
                </button>
        );
};

export default ModeCard;
