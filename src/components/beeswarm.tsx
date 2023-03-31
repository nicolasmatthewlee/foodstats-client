import { useEffect, useRef, useState } from "react";
import { useResizeObserver, truncateSVGText } from "./graph-utilities";
import { AccurateBeeswarm } from "accurate-beeswarm-plot";
import * as d3 from "d3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

interface Props {
  title: string;
  data: number[];
  dataLabels?: string[];
  unit: string;
  separation?: number;
}

export const Beeswarm = ({
  title,
  data,
  dataLabels,
  unit,
  separation = 1,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const svgBoxRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(svgBoxRef);
  const [svgHeight, setSvgHeight] = useState<number>(0);

  const [maxPoints, setMaxPoints] = useState<number | undefined>(1000);

  useEffect(() => {
    const usedData = data.slice(0, maxPoints);

    if (!dimensions) return;
    const svg = d3.select(svgRef.current);

    const radius = 3;

    const xScale = d3
      .scaleLinear()
      .domain([0, Math.max(...usedData)])
      .range([radius, dimensions.width - radius]);

    // data must be transformed before evaluating intersection
    const transformedData = usedData.map((x) => ({
      transformed: xScale(x),
      original: x,
    }));

    const points = new AccurateBeeswarm(
      transformedData,
      radius,
      (n: { transformed: number; original: number }) => n.transformed
    )
      .oneSided()
      .calculateYPositions();

    const maxY = Math.max(...points.map((p: { y: number }) => p.y));
    setSvgHeight(Math.abs(maxY + radius * 2 + 1));

    const xAxis = d3.axisBottom(xScale);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);

    svg
      .selectAll(".dot")
      .data(points)
      .join("circle")
      .attr("class", "dot")
      .attr("data-label", (p: { x: number; y: number }, i: number) =>
        dataLabels ? dataLabels[i] : null
      )
      .attr("cx", (p: { x: number; y: number }) => p.x)
      .attr(
        "cy",
        (p: { x: number; y: number }) => dimensions.height - radius + -p.y - 1
      ) // push one radius up so entire circle is contained in plot; -1 ensures the stroke is contained
      .attr("r", radius)
      .attr("fill", "black")
      .attr("stroke", "white")
      .on(
        "mouseenter",
        (
          event: any,
          p: { x: number; y: number; datum: { original: number } }
        ) => {
          d3.select(event.target).attr("fill", "red");

          const textElement = svg
            .selectAll(".data-label")
            .data([p])
            .join("g")
            .attr("class", "data-label")
            .style(
              "transform",
              `translate(${p.x}px,${dimensions.height - p.y - radius}px)`
            );

          const textHeight = 10;
          const textPadding = 4;

          const textFill = textElement
            .append("rect")
            .attr("height", textHeight + textPadding * 2)
            .attr("y", -(textHeight + textPadding * 2) - radius)
            .attr("fill", "white")
            .attr("stroke", "black")
            .style("stroke-width", 1.2);

          const text = textElement
            .append("text")
            .attr("y", -radius - textPadding - 1)
            .attr("x", textPadding)
            .text(`${p.datum.original} ${unit} | ${event.target.dataset.label}`)
            .style("font-size", `${textHeight}px`)
            .style("font-weight", "bold");

          truncateSVGText(text.node(), dimensions.width);

          textFill.attr(
            "width",
            text.node().getComputedTextLength() + textPadding * 2
          ); // set rect width based on text

          // adjust label position if necessary
          if (p.x + +textFill.attr("width") > dimensions.width) {
            textElement.style(
              "transform",
              `translate(${dimensions.width - +textFill.attr("width")}px,${
                dimensions.height - p.y - radius
              }px)`
            );
          }
        }
      )
      .on("mouseleave", (event: any) => {
        d3.select(event.target).attr("fill", "black");
        svg.selectAll(".data-label").remove();
      });
  }, [data, dataLabels, dimensions, separation, unit, maxPoints]);

  return (
    <div className="flex flex-col space-y-[10px]">
      <div className="flex items-center">
        <p className="text-[12px]">{title}</p>
        <div className="flex-1 flex relative justify-end">
          <button
            className="peer border px-[5px] rounded-sm text-xs text-gray-400
          hover:bg-black hover:text-white hover:border-black
          hover:rounded-b-none"
          >
            ?
          </button>
          <div
            className="hidden max-w-md right-0 top-full text-xs absolute bg-white border-black rounded-sm rounded-tr-none border p-[15px]
          peer-hover:block "
          >
            To improve rendering speed, the plot defaults to showing the first
            thousand points from the dataset (if they exist). To show the entire
            dataset, toggle the switch at the bottom.
          </div>
        </div>
      </div>

      <div
        ref={svgBoxRef}
        className="flex-1 flex space-y-[10px]"
        style={{
          marginBottom: "19px",
        }}
      >
        <svg
          ref={svgRef}
          className="w-full overflow-visible border-t border-white pb-[17px]"
          style={{ height: svgHeight }}
        >
          <g className="x-axis" />
        </svg>
      </div>

      <div>
        <div className="flex items-center space-x-[10px]">
          <button
            id="show-points"
            className=""
            onClick={(event) =>
              maxPoints ? setMaxPoints(undefined) : setMaxPoints(1000)
            }
          >
            {maxPoints ? (
              <div className="w-[18px] h-[10px] rounded-full relative border-[1px] border-black">
                <div className="absolute top-[1px] left-[1.5px] w-[6px] h-[6px] rounded-full bg-black" />
              </div>
            ) : (
              <div className="w-[18px] h-[10px] rounded-full relative border-[1px] bg-black border-black">
                <div className="absolute top-[1px] right-[1.5px] w-[6px] h-[6px] rounded-full bg-white" />
              </div>
            )}
          </button>
          <label htmlFor="show-points" className="text-xs">
            {maxPoints
              ? `showing sample of ${Math.min(data.length, 1000)} points`
              : `showing all ${data.length} points`}
          </label>
        </div>
      </div>
    </div>
  );
};
