import { useState, useEffect, useRef } from "react";
import { useResizeObserver } from "./graph-utilities";
import { select, scaleBand, scaleLinear, axisBottom, axisLeft } from "d3";

interface Props {
  title: string;
  data: number[];
  units: string[];
  labels: string[];
}

export const BarGraphHorizontal = ({ title, data, units, labels }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = useResizeObserver(svgRef);
  const [yAxisPadding, setYAxisPadding] = useState<number>(0);

  useEffect(() => {
    if (!dimensions) return;
    const svg = select(svgRef.current);

    const yScale = scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, dimensions.height])
      .padding(0.2);

    const xScale = scaleLinear()
      .domain([0, Math.max(...data)])
      .range([0, dimensions.width]);

    const xAxis = axisBottom(xScale).ticks(5);
    svg
      .select(".x-axis")
      .style("transform", `translate(0,${dimensions.height}px)`)
      .call(xAxis);

    const yAxis = axisLeft(yScale).tickFormat((n: number) => labels[n]);
    svg.select(".y-axis").call(yAxis);

    setYAxisPadding(svg.select(".y-axis").node().getBBox().width);

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")

      .attr("height", (_: number, i: number) => yScale.bandwidth())
      .attr("y", (_: number, i: number) => yScale(i))
      .attr("data-index", (_: number, i: number) => i)
      .on("mouseenter", (event: any, v: number) => {
        const textPadding = 3;
        const textFill = svg
          .selectAll(".data-label-fill")
          .data([v])
          .join("rect")
          .attr("class", "data-label-fill")
          .attr("y", +select(event.target).attr("y") - 12)
          .attr("height", 12)
          .attr("fill", "white")
          .attr("stroke", "black");
        const text = svg
          .selectAll(".data-label")
          .data([v])
          .join("text")
          .attr("class", "data-label")
          .attr("font-size", "10px")
          .attr("y", +select(event.target).attr("y") - 2)
          .attr("x", xScale(v) - textPadding)
          .attr("text-anchor", "end")
          .text(`${v} ${units[event.target.dataset.index]}`);

        textFill.attr(
          "width",
          text.node().getComputedTextLength() + textPadding * 2
        ); // set rect width based on text

        if (text.node().getComputedTextLength() + 2 * textPadding > xScale(v)) {
          text.attr("text-anchor", "start");
          text.attr("x", 1 + textPadding);
          textFill.attr("x", 1);
        } else {
          textFill.attr(
            "x",
            xScale(v) - text.node().getComputedTextLength() - textPadding * 2
          );
        }
      })
      .on("mouseleave", () => {
        svg.selectAll(".data-label").remove();
        svg.selectAll(".data-label-fill").remove();
      })
      .transition()
      .attr("width", (v: number) => xScale(v));
  }, [data, units, labels, dimensions]);

  return (
    <div className="max-w-full space-y-[10px] flex flex-col">
      <p className="text-[12px]">{title}</p>
      <svg
        ref={svgRef}
        className="w-full overflow-visible border-t border-white pb-[17px]"
        style={{
          paddingLeft: yAxisPadding,
          height: `${20 * data.length + 17}px`,
        }}
      >
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};
