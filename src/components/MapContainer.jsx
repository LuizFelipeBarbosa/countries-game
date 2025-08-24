import { useCallback, useEffect, useRef, useState } from "react";
import WorldMap from "../assets/map.svg";
import { applyHighlighting } from "../utils/mapColoring";

function MapContainer({
	className = "",
	style = {},
	ariaLabel = "World Map",
	isDisabled = false,
	minZoom = 1,
	maxZoom = 8,
	onSvgLoad,
	onTransformChange,
	apiRef,
}) {
	const [zoom, setZoom] = useState(1);
	const [pan, setPan] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [svgLoaded, setSvgLoaded] = useState(false);

	const containerRef = useRef(null);
	const svgObjectRef = useRef(null);
	const pinchRef = useRef(null);

	const getSvgDocument = () => svgObjectRef.current?.contentDocument ?? null;
	const resetColors = (codes, baseColor = "#d4d4d8") => {
		const doc = getSvgDocument();
		if (!doc || !codes?.length) return;
		applyHighlighting(doc, baseColor, codes);
	};
	const colorCountries = (color, codes) => {
		const doc = getSvgDocument();
		if (!doc || !codes?.length) return;
		applyHighlighting(doc, color, codes);
	};
	const colorCountry = (code, color) => {
		const doc = getSvgDocument();
		if (!doc || !code) return;
		applyHighlighting(doc, color, [code]);
	};

	useEffect(() => {
		if (!apiRef) return;
		apiRef.current = {
			resetColors,
			colorCountries,
			colorCountry,
			getSvgDocument,
		};
		return () => {
			if (apiRef) apiRef.current = null;
		};
	}, [apiRef]);

	const calculatePanLimits = (containerRect, svgRect, currentZoom) => {
		const horizontalOverflow = Math.max(
			0,
			(svgRect.width * currentZoom - containerRect.width) / 2
		);
		const verticalOverflow = Math.max(
			0,
			(svgRect.height * currentZoom - containerRect.height) / 2
		);

		return {
			minX: -horizontalOverflow,
			maxX: horizontalOverflow,
			minY: -verticalOverflow,
			maxY: verticalOverflow,
		};
	};

	const handleMouseDown = (e) => {
		if (isDisabled) return;
		setIsDragging(true);
		setDragStart({ x: e.clientX, y: e.clientY });
	};

	const handleMouseMove = (e) => {
		if (isDisabled) return;
		if (isDragging) {
			const dx = e.clientX - dragStart.x;
			const dy = e.clientY - dragStart.y;
			setPan((prevPan) => {
				const container = containerRef.current;
				const svgObject = svgObjectRef.current;
				if (!container || !svgObject) return prevPan;

				const containerRect = container.getBoundingClientRect();
				const svgRect = svgObject.getBoundingClientRect();

				const { minX, maxX, minY, maxY } = calculatePanLimits(
					containerRect,
					svgRect,
					zoom
				);

				const newX = Math.min(Math.max(prevPan.x + dx, minX), maxX);
				const newY = Math.min(Math.max(prevPan.y + dy, minY), maxY);

				return { x: newX, y: newY };
			});
			setDragStart({ x: e.clientX, y: e.clientY });
		}
	};

	const handleMouseUp = () => {
		if (isDisabled) return;
		setIsDragging(false);
	};

	const handleZoom = useCallback(
		(delta, clientX, clientY) => {
			if (isDisabled) return;
			setZoom((prevZoom) => {
				const container = containerRef.current;
				const svgObject = svgObjectRef.current;
				if (!container || !svgObject) return prevZoom;

				const containerRect = container.getBoundingClientRect();
				const svgRect = svgObject.getBoundingClientRect();

				const x = clientX - containerRect.left;
				const y = clientY - containerRect.top;

				const contentX = (x - pan.x) / prevZoom;
				const contentY = (y - pan.y) / prevZoom;

				const newZoom = Math.max(
					minZoom,
					Math.min(prevZoom + delta, maxZoom)
				);

				let newPanX = x - contentX * newZoom;
				let newPanY = y - contentY * newZoom;

				const { minX, maxX, minY, maxY } = calculatePanLimits(
					containerRect,
					svgRect,
					newZoom
				);
				newPanX = Math.min(Math.max(newPanX, minX), maxX);
				newPanY = Math.min(Math.max(newPanY, minY), maxY);

				setPan({ x: newPanX, y: newPanY });

				return newZoom;
			});
		},
		[isDisabled, pan, minZoom, maxZoom]
	);

	const handleWheel = (e) => {
		if (isDisabled) return;
		e.preventDefault();
		const delta = e.deltaY * -0.001;
		handleZoom(delta, e.clientX, e.clientY);
	};

	useEffect(() => {
		if (onTransformChange) onTransformChange({ zoom, pan });
	}, [zoom, pan, onTransformChange]);

	// Touch handling
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		if (isDisabled) return;

		const opts = { passive: false };

		const onTouchStart = (e) => {
			e.preventDefault();
			if (e.touches.length === 1) {
				setIsDragging(true);
				setDragStart({
					x: e.touches[0].clientX,
					y: e.touches[0].clientY,
				});
			} else if (e.touches.length === 2) {
				const distance = Math.hypot(
					e.touches[0].clientX - e.touches[1].clientX,
					e.touches[0].clientY - e.touches[1].clientY
				);
				pinchRef.current = {
					initialDistance: distance,
					startZoom: zoom,
				};
			}
		};

		const onTouchMove = (e) => {
			e.preventDefault();
			if (e.touches.length === 1 && isDragging) {
				const touch = e.touches[0];
				const dx = touch.clientX - dragStart.x;
				const dy = touch.clientY - dragStart.y;
				setPan((prevPan) => {
					const containerEl = containerRef.current;
					const svgObject = svgObjectRef.current;
					if (!containerEl || !svgObject) return prevPan;

					const containerRect = containerEl.getBoundingClientRect();
					const svgRect = svgObject.getBoundingClientRect();

					const { minX, maxX, minY, maxY } = calculatePanLimits(
						containerRect,
						svgRect,
						zoom
					);

					const newX = Math.min(Math.max(prevPan.x + dx, minX), maxX);
					const newY = Math.min(Math.max(prevPan.y + dy, minY), maxY);

					return { x: newX, y: newY };
				});
				setDragStart({ x: touch.clientX, y: touch.clientY });
			} else if (e.touches.length === 2 && pinchRef.current) {
				const distance = Math.hypot(
					e.touches[0].clientX - e.touches[1].clientX,
					e.touches[0].clientY - e.touches[1].clientY
				);
				const scale = distance / pinchRef.current.initialDistance;
				const newZoom = pinchRef.current.startZoom * scale;
				const delta = newZoom - zoom;
				const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
				const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
				handleZoom(delta, midX, midY);
			}
		};

		const onTouchEnd = () => {
			setIsDragging(false);
			pinchRef.current = null;
		};

		container.addEventListener("touchstart", onTouchStart, opts);
		container.addEventListener("touchmove", onTouchMove, opts);
		container.addEventListener("touchend", onTouchEnd);
		container.addEventListener("touchcancel", onTouchEnd);

		return () => {
			container.removeEventListener("touchstart", onTouchStart);
			container.removeEventListener("touchmove", onTouchMove);
			container.removeEventListener("touchend", onTouchEnd);
			container.removeEventListener("touchcancel", onTouchEnd);
		};
	}, [isDisabled, isDragging, dragStart, zoom, handleZoom]);

	// Ensure wheel is non-passive to allow preventDefault
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const preventDefaultScroll = (e) => e.preventDefault();
		container.addEventListener("wheel", preventDefaultScroll, {
			passive: false,
		});
		return () => {
			container.removeEventListener("wheel", preventDefaultScroll);
		};
	}, []);

	// Handle SVG load
	useEffect(() => {
		const svgObject = svgObjectRef.current;
		if (!svgObject) return;

		const onLoad = () => {
			setSvgLoaded(true);
			if (svgObject.contentDocument) {
				onSvgLoad?.(svgObject.contentDocument);
			}
		};

		if (svgObject.contentDocument) {
			setSvgLoaded(true);
			onSvgLoad?.(svgObject.contentDocument);
			return;
		}

		svgObject.addEventListener("load", onLoad);
		return () => svgObject.removeEventListener("load", onLoad);
	}, [onSvgLoad]);

	return (
		<div
			ref={containerRef}
			className={`relative w-full h-full overflow-hidden select-none ${className}`}
			style={{
				cursor: isDisabled
					? "default"
					: isDragging
					? "grabbing"
					: "grab",
				touchAction: "none",
				...style,
			}}
			onMouseDown={isDisabled ? undefined : handleMouseDown}
			onMouseMove={isDisabled ? undefined : handleMouseMove}
			onMouseUp={isDisabled ? undefined : handleMouseUp}
			onMouseLeave={isDisabled ? undefined : handleMouseUp}
			onWheel={isDisabled ? undefined : handleWheel}
			aria-label={ariaLabel}
		>
			<div
				style={{
					transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
					transformOrigin: "0 0",
				}}
			>
				<object
					ref={svgObjectRef}
					type="image/svg+xml"
					data={WorldMap}
					aria-label={ariaLabel}
					className="w-full h-full pointer-events-none"
				/>
			</div>
		</div>
	);
}

export default MapContainer;
