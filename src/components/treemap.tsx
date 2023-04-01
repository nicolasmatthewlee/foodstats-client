import { useEffect, useRef } from "react";
import { useResizeObserver } from "./graph-utilities";
import * as d3 from "d3";
import { truncateSVGText } from "./graph-utilities";

interface Props {
  title: string;
  height: string;
  data: Object;
}

export const Treemap = ({ title, height, data }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const svgBoxRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(svgBoxRef);

  const treemapPadding = 2;

  useEffect(() => {
    if (!dimensions) return;
    const svg = d3.select(svgRef.current);

    // reformat data for tree hierarchy for use with d3 treemap
    // must call sum for treemap to compute size
    const root = d3.hierarchy(data).sum((d: { size: number }) => d.size);
    d3
      .treemap()
      .size([dimensions.width, dimensions.height])
      .padding(treemapPadding)(root);

    svg
      .selectAll(".bin")
      .data(root.leaves())
      .join("rect")
      .attr("class", "bin")
      .attr(
        "x",
        (d: { x0: number; y0: number; x1: number; y1: number }) => d.x0
      )
      .attr(
        "y",
        (d: { x0: number; y0: number; x1: number; y1: number }) => d.y0
      )
      .attr(
        "width",
        (d: { x0: number; y0: number; x1: number; y1: number }) => d.x1 - d.x0
      )
      .attr(
        "height",
        (d: { x0: number; y0: number; x1: number; y1: number }) => d.y1 - d.y0
      )
      .attr(
        "fill",
        (
          d: { x0: number; y0: number; x1: number; y1: number },
          i: number,
          n: any[]
        ) => `rgb(${255 - (255 * i) / n.length},${0},${0})`
      )
      .on(
        "mouseenter",
        (event: Event, d: { data: { name: string; size: number } }) => {
          svg
            .append("text")
            .attr("class", "hover-label")
            .text(`${d.data.name}: ${d.data.size}`)
            .style("font-size", "10px")
            .attr("x", treemapPadding)
            .attr("y", "-1px")
            .each(
              (
                d: { x0: number; y0: number; x1: number; y1: number },
                i: number,
                nodeList: any[]
              ) => truncateSVGText(nodeList[i], dimensions.width)
            );
        }
      )
      .on("mouseleave", () => svg.selectAll(".hover-label").remove());

    const textPadding = 3;
    const textSize = 10;
    svg
      .selectAll(".bin-label")
      .data(root.leaves())
      .join("text")
      .attr("class", "bin-label")
      .attr(
        "x",
        (d: { x0: number; y0: number; x1: number; y1: number }) =>
          d.x0 + textPadding
      )
      .attr(
        "y",
        (d: { x0: number; y0: number; x1: number; y1: number }) =>
          d.y0 + textSize + textPadding
      )
      .text(
        (d: { data: { name: string; size: number } }) =>
          `${d.data.name}: ${d.data.size}`
      )
      .style("font-size", `${textSize}px`)
      .style("fill", "white")
      .each(
        (
          d: { x0: number; y0: number; x1: number; y1: number },
          i: number,
          nodeList: any[]
        ) => truncateSVGText(nodeList[i], d.x1 - d.x0 - textPadding * 2)
      );
  });

  return (
    <div className="flex flex-col" style={{ height: height }}>
      <p
        className="text-[12px] pb-[10px]"
        style={{ paddingLeft: treemapPadding }}
      >
        {title}
      </p>
      <div ref={svgBoxRef} className="flex-1 flex">
        <svg ref={svgRef} className="w-full overflow-visible"></svg>
      </div>
    </div>
  );
};
