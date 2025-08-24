import { useRef, useEffect } from "react";
import { ReactComponent as WorldMap } from "../assets/map.svg";

const TravleMapContainer = ({ disabled, onTransformChange }) => {
	const gRef = useRef(null);

	useEffect(() => {
		if (!gRef.current || !onTransformChange) return;
		const observer = new MutationObserver(() => {
			onTransformChange(gRef.current.getAttribute("transform"));
		});
		observer.observe(gRef.current, {
			attributes: true,
			attributeFilter: ["transform"],
		});
		return () => observer.disconnect();
	}, [onTransformChange]);

	return (
		<svg
			width="100%"
			height="100%"
			className={disabled ? "pointer-events-none" : undefined}
		>
			<g ref={gRef}>
				<WorldMap />
			</g>
		</svg>
	);
};

export default TravleMapContainer;
