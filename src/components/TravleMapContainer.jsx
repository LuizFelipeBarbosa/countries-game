import {
        useRef,
        useEffect,
        useImperativeHandle,
        forwardRef,
        useState,
} from "react";
import * as d3 from "d3";
import { ReactComponent as WorldMap } from "../assets/map.svg";

const TravleMapContainer = forwardRef(({ disabled, onTransformChange }, ref) => {
        const svgRef = useRef(null);
        const gRef = useRef(null);
        const mapRef = useRef(null);
        const transformRef = useRef(d3.zoomIdentity);
        const zoomBehaviorRef = useRef(null);
        const [viewBox, setViewBox] = useState("0 0 0 0");

        const forwardPointerEvent = (event) => {
                if (svgRef.current) {
                        svgRef.current.dispatchEvent(
                                new PointerEvent(event.type, event.nativeEvent)
                        );
                }
        };

        useEffect(() => {
                if (!svgRef.current || !gRef.current) return;

                const svgSelection = d3.select(svgRef.current);
                const gSelection = d3.select(gRef.current);

                const zoomBehavior = d3
                        .zoom()
                        .scaleExtent([1, 8])
                        .on("zoom", (e) => {
                                gSelection.attr("transform", e.transform);
                                transformRef.current = e.transform;
                                onTransformChange?.(e.transform);
                        });

                svgSelection.call(zoomBehavior);
                zoomBehaviorRef.current = zoomBehavior;

                const updateViewBox = () => {
                        if (!mapRef.current) return;
                        const { width, height } = mapRef.current.getBBox();
                        setViewBox(`0 0 ${width} ${height}`);
                };

                updateViewBox();

                let resizeObserver;
                if (typeof ResizeObserver !== "undefined") {
                        resizeObserver = new ResizeObserver(updateViewBox);
                        resizeObserver.observe(svgRef.current);
                } else {
                        window.addEventListener("resize", updateViewBox);
                }

                return () => {
                        svgSelection.on(".zoom", null);
                        if (resizeObserver) {
                                resizeObserver.disconnect();
                        } else {
                                window.removeEventListener("resize", updateViewBox);
                        }
                };
        }, [onTransformChange]);

        useImperativeHandle(ref, () => ({
                reset() {
                        const svgSelection = d3.select(svgRef.current);
                        svgSelection.call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
                },
                center() {
                        const svgSelection = d3.select(svgRef.current);
                        const { width, height } = svgRef.current.getBoundingClientRect();
                        svgSelection.call(
                                zoomBehaviorRef.current.translateTo,
                                width / 2,
                                height / 2
                        );
                },
                getTransform() {
                        return transformRef.current;
                },
        }));

        return (
                <svg
                        ref={svgRef}
                        width="100%"
                        height="100%"
                        viewBox={viewBox}
                        style={{ pointerEvents: disabled ? "none" : "auto" }}
                        onPointerDown={forwardPointerEvent}
                        onPointerMove={forwardPointerEvent}
                        onPointerUp={forwardPointerEvent}
                        onPointerCancel={forwardPointerEvent}
                >
                        <g ref={gRef}>
                                <WorldMap ref={mapRef} />
                        </g>
                </svg>
        );
});

TravleMapContainer.displayName = "TravleMapContainer";

export default TravleMapContainer;
