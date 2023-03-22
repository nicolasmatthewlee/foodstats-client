import { useEffect, useRef, useState } from "react";
import { select, scaleBand, scaleLinear, axisBottom, axisLeft } from "d3";
import { useResizeObserver, truncateSVGText } from "./graph-utilities";

interface Props {
  title: string;
  data: number[];
  units: string[];
  labels: string[];
}

export const BarGraph = ({ title, data, units, labels }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = useResizeObserver(svgRef);
  const [yAxisPadding, setYAxisPadding] = useState<number>(0);

  useEffect(() => {
    if (!dimensions) return;
    const svg = select(svgRef.current);

    const xScale = scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, dimensions.width])
      .padding(0.2);

    const yScale = scaleLinear()
      .domain([0, Math.max(...data)])
      .range([0, dimensions.height]);
    const yAxisScale = scaleLinear()
      .domain([0, Math.max(...data)])
      .range([dimensions?.height, 0]);

    const xAxis = axisBottom(xScale).tickFormat((n: number) => labels[n]);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions?.height}px)`)
      .call(xAxis);

    svg
      .selectAll(".x-axis>.tick>text")
      .each((v: number, i: number, nodes: any) =>
        truncateSVGText(nodes[i], xScale.bandwidth())
      );

    const yAxis = axisLeft(yAxisScale).tickSizeOuter(0);
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
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1,-1)")
      .attr("x", (_: any, i: number) => xScale(i))
      .attr("y", dimensions ? -dimensions.height : 0)
      .attr("width", xScale.bandwidth())
      .attr("data-index", (_v: number, i: number) => i)
      .on("mouseenter", (event: any, value: number) => {
        svg
          .selectAll(".data-label")
          .data([value])
          .join("text")
          .attr("class", "data-label")
          .text((v: number, i: number) => `${v} ${units[i]}`)
          .attr("x", event.target.x.baseVal.value + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .attr("y", yAxisScale(value) - 2)
          .style("font-size", "10px");
        svg
          .append("text")
          .attr("class", "data-label")
          .attr("y", -2)
          .text(labels[event.target.dataset.index])
          .style("font-size", "10px");
      })
      .on("mouseleave", () => svg.selectAll(".data-label").remove())
      .transition()
      .attr("height", (v: number) => yScale(v));
  }, [data, units, labels, dimensions]);

  return (
    <div className="max-w-full h-full space-y-[10px] flex flex-col">
      <p className="text-[12px]">{title}</p>
      <svg
        ref={svgRef}
        className="w-full h-full overflow-visible pb-[18px] border-t border-white"
        style={{ paddingLeft: yAxisPadding }}
      >
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};
