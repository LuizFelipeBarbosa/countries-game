import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { ReactComponent as WorldMap } from "../assets/map.svg";

const TravleMapContainer = ({ disabled, onTransformChange }) => {
        const svgRef = useRef(null);
        const gRef = useRef(null);

        useEffect(() => {
                if (!svgRef.current || !gRef.current || !onTransformChange) return;

                const svgSelection = d3.select(svgRef.current);
                const gSelection = d3.select(gRef.current);

                const zoomBehavior = d3
                        .zoom()
                        .scaleExtent([1, 8])
                        .on("zoom", (e) => gSelection.attr("transform", e.transform));

                svgSelection.call(zoomBehavior);

                const observer = new MutationObserver(() => {
                        onTransformChange(gRef.current.getAttribute("transform"));
                });
                observer.observe(gRef.current, {
                        attributes: true,
                        attributeFilter: ["transform"],
                });

                return () => {
                        observer.disconnect();
                        svgSelection.on(".zoom", null);
                };
        }, [onTransformChange]);

        const forwardEvent = (e) => {
                if (svgRef.current) {
                        svgRef.current.dispatchEvent(
                                new e.nativeEvent.constructor(e.type, e.nativeEvent)
                        );
                }
        };

        return (
                <svg
                        ref={svgRef}
                        width="100%"
                        height="100%"
                        style={{ pointerEvents: disabled ? "none" : "auto" }}
                        onPointerDown={forwardEvent}
                        onPointerMove={forwardEvent}
                        onPointerUp={forwardEvent}
                        onPointerLeave={forwardEvent}
                        onWheel={forwardEvent}
                >
                        <g ref={gRef}>
                                <WorldMap />
                        </g>
                </svg>
        );
};

export default TravleMapContainer;
