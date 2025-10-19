const ModeCard = ({ icon: Icon, badge, title, description, onClick }) => {
        return (
                <button
                        type="button"
                        onClick={onClick}
                        className="group relative flex h-full flex-col gap-4 rounded-3xl border border-white/20 bg-white/10 p-6 text-left text-white shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white focus-visible:ring-0"
                >
                        <span className="pointer-events-none absolute inset-x-6 top-0 h-1 rounded-b-full bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400" aria-hidden="true" />
                        <div className="flex items-center justify-between">
                                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                                        <Icon className="h-6 w-6" aria-hidden="true" />
                                </span>
                                {badge ? (
                                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
                                                {badge}
                                        </span>
                                ) : null}
                        </div>
                        <div className="space-y-2">
                                <h3 className="text-xl font-semibold font-montserrat drop-shadow-sm">{title}</h3>
                                <p className="text-sm text-white/80 font-montserrat">{description}</p>
                        </div>
                </button>
        );
};

export default ModeCard;
