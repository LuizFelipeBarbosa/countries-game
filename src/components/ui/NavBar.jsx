import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

const NavBar = ({ onSelect }) => {
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	const navLinks = useMemo(
		() => [
			{
				id: null,
				label: "Overview",
				description: "Start from the world map",
			},
			{
				id: "world",
				label: "World Map",
				description: "Pinpoint every nation",
			},
			{
				id: "outline",
				label: "Outline Quiz",
				description: "Match borders to countries",
			},
			{
				id: "travle",
				label: "Travle",
				description: "Daily geography puzzle",
			},
		],
		[]
	);

	const handleSelect = (id) => {
		onSelect(id);
		setIsMobileOpen(false);
	};

	return (
		<nav className="border-b border-slate-800 bg-slate-950">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
				<button
					onClick={() => handleSelect(null)}
					type="button"
					className="text-lg font-semibold text-white transition hover:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
				>
					Countries
				</button>
				<div className="hidden items-center gap-4 md:flex">
					{navLinks.map((link) => (
						<button
							key={link.id ?? "overview"}
							onClick={() => handleSelect(link.id)}
							type="button"
							className="text-sm text-slate-400 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
							aria-label={
								link.id
									? `Navigate to ${link.label
											.replace("Quiz", "")
											.trim()} mode`
									: "Go to overview"
							}
						>
							{link.label}
						</button>
					))}
				</div>
				<button
					onClick={() => setIsMobileOpen(true)}
					type="button"
					className="rounded border border-slate-800 bg-slate-900 p-2 text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100 md:hidden"
					aria-label="Open navigation menu"
				>
					<Menu className="h-4 w-4" aria-hidden="true" />
				</button>
			</div>
			{isMobileOpen ? (
				<div className="md:hidden">
					<div
						className="fixed inset-0 z-40 bg-slate-950/80"
						onClick={() => setIsMobileOpen(false)}
						aria-hidden="true"
					/>
					<div className="fixed inset-y-0 right-0 z-50 flex w-64 max-w-full flex-col gap-4 border-l border-slate-800 bg-slate-950 p-4">
						<div className="flex items-center justify-between">
							<span className="text-sm font-semibold text-white">
								Menu
							</span>
							<button
								onClick={() => setIsMobileOpen(false)}
								type="button"
								className="rounded border border-slate-800 bg-slate-900 p-2 text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
								aria-label="Close navigation menu"
							>
								<X className="h-4 w-4" aria-hidden="true" />
							</button>
						</div>
						<nav className="flex flex-col gap-2">
							{navLinks.map((link) => (
								<button
									key={link.id ?? "overview"}
									onClick={() => handleSelect(link.id)}
									type="button"
									className="rounded border border-slate-800 bg-slate-900 px-4 py-2 text-left text-sm text-slate-100 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
									aria-label={
										link.id
											? `Navigate to ${link.label
													.replace("Quiz", "")
													.trim()} mode`
											: "Go to overview"
									}
								>
									{link.label}
								</button>
							))}
						</nav>
					</div>
				</div>
			) : null}
		</nav>
	);
};

export default NavBar;
