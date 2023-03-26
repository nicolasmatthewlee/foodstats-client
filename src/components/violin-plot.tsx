import { useEffect, useRef, useState } from "react";
import { useResizeObserver, truncateSVGText } from "./graph-utilities";
import * as d3 from "d3";

interface Props {
  title: string;
  data: number[];
}

export const ViolinPlot = ({ title, data }: Props) => {
  const svgBoxRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = useResizeObserver(svgBoxRef);
  const [yAxisPadding, setYAxisPadding] = useState<number>(0);

  // create bins
  // domain explicitly set because all values within [0-100] in a 100g sample
  const bins = d3.bin().thresholds(19).domain([0, 100])(data);
  const heights = bins.map((bin: number[]) => bin.length);

  useEffect(() => {
    if (!dimensions) return;
    const svg = d3.select(svgRef.current);

    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(...heights)])
      .range([dimensions.height, 0]);

    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, dimensions.width]);

    const xAxis = d3.axisBottom(xScale);

    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions?.height}px)`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
    svg.select(".y-axis").call(yAxis);

    // padding = width of largest y-tick text + its horizontal offset
    setYAxisPadding(
      svg
        .selectAll(".tick:last-of-type>text")
        ._groups[0][1].getComputedTextLength() +
        Math.abs(
          svg.select(".y-axis").select(".tick:last-of-type>text").attr("x")
        )
    );

    svg
      .selectAll(".violin-plot")
      .data([bins])
      .join("path")
      .attr("class", "violin-plot")
      .style("fill", "rgba(0,0,0,0.2)")
      .attr(
        "d",
        d3
          .area()
          .x((d: { x0: number; x1: number; length: number }) => {
            return xScale((d.x0 + d.x1) / 2);
          })
          .y0(yScale(0))
          .y1((d: { x0: number; x1: number; length: number }) => {
            return yScale(d.length);
          })

          .curve(d3.curveCatmullRom)
      );
  }, [data, dimensions, heights, bins]);

  return (
    <div className="flex flex-col">
      <p className="text-[12px] mb-[10px]">{title}</p>
      <div
        ref={svgBoxRef}
        className="flex-1 flex space-y-[10px]"
        style={{
          marginLeft: yAxisPadding + "px",
          marginBottom: "19px",
        }}
      >
        <svg
          ref={svgRef}
          className="w-full overflow-visible border-t border-white pb-[17px]"
        >
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </div>
  );
};
