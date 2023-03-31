import { useState, useEffect, useRef } from "react";
import { useResizeObserver } from "./graph-utilities";
import * as d3 from "d3";

interface Props {
  title: string;
  data: number[];
  units: string[];
  labels: string[];
}

export const BarGraphHorizontal = ({ title, data, units, labels }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const svgBoxRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(svgBoxRef);
  const [yAxisPadding, setYAxisPadding] = useState<number>(0);

  useEffect(() => {
    if (!dimensions) return;
    const svg = d3.select(svgRef.current);

    const yScale = d3
      .scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, dimensions.height])
      .padding(0.2);

    const xScale = d3
      .scaleLinear()
      .domain([0, Math.max(...data)])
      .range([0, dimensions.width]);

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat((n: number) => d3.format(".2s")(n));
    svg
      .select(".x-axis")
      .style("transform", `translate(0,${dimensions.height}px)`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale).tickFormat((n: number) => labels[n]);
    svg.select(".y-axis").call(yAxis);

    setYAxisPadding(svg.select(".y-axis").node().getBBox().width);

    svg
      .selectAll(".y-axis>.tick>text")
      .style("cursor", "default")
      .on("mouseenter", (event: MouseEvent, i: number) => {
        svg
          .selectAll(`.data-label[data-index="${i}"]`)
          .style("visibility", "visible");
        svg
          .selectAll(`.data-label-fill[data-index="${i}"]`)
          .style("visibility", "visible");
      })
      .on("mouseleave", () => {
        svg.selectAll(".data-label").style("visibility", "hidden");
        svg.selectAll(".data-label-fill").style("visibility", "hidden");
      });

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("height", (_: number, i: number) => yScale.bandwidth())
      .attr("y", (_: number, i: number) => yScale(i))
      .attr("data-index", (_: number, i: number) => i)
      .each((v: number, i: number, nodelist: any) => {
        const target = nodelist[i];

        const textPadding = 3;
        const textFill = svg
          .append("rect")
          .attr("class", "data-label-fill")
          .attr("y", +d3.select(target).attr("y") - 12)
          .attr("height", 12)
          .attr("fill", "white")
          .attr("stroke", "black")
          .attr("data-index", i)
          .style("visibility", "hidden");
        const text = svg
          .append("text")
          .attr("class", "data-label")
          .attr("font-size", "10px")
          .attr("y", +d3.select(target).attr("y") - 2)
          .attr("x", xScale(v) - textPadding)
          .attr("text-anchor", "end")
          .text(`${d3.format(".3s")(v)} ${units[target.dataset.index]}`)
          .attr("data-index", i)
          .style("visibility", "hidden");

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
      .on("mouseenter", (event: any, v: number) => {
        svg
          .selectAll(`.data-label[data-index="${event.target.dataset.index}"]`)
          .style("visibility", "visible");
        svg
          .selectAll(
            `.data-label-fill[data-index="${event.target.dataset.index}"]`
          )
          .style("visibility", "visible");
      })
      .on("mouseleave", (event: MouseEvent, v: number) => {
        svg.selectAll(".data-label").style("visibility", "hidden");
        svg.selectAll(".data-label-fill").style("visibility", "hidden");
      })
      .transition()
      .attr("width", (v: number) => xScale(v));

    return () => {
      // cleanup appended items
      svg.selectAll(".data-label").remove();
      svg.selectAll(".data-label-fill").remove();
    };
  }, [data, units, labels, dimensions]);

  return (
    <div className="flex flex-col">
      <p className="text-[12px]">{title}</p>
      <div
        ref={svgBoxRef}
        className="flex-1 flex space-y-[10px]"
        style={{
          marginLeft: yAxisPadding,
          marginBottom: "19px",
        }}
      >
        <svg
          ref={svgRef}
          className="w-full overflow-visible border-t border-white pb-[17px]"
          style={{ height: `${20 * data.length + 17}px` }}
        >
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </div>
  );
};
