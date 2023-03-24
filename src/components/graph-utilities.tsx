import { useEffect, useState } from "react";
import { ResizeObserver } from "resize-observer";
import { ContentRect } from "resize-observer/lib/ContentRect";

const useResizeObserver = (ref: React.RefObject<HTMLDivElement>) => {
  const target = ref.current;
  const [dimensions, setDimensions] = useState<ContentRect | null>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      setDimensions(entries[0].contentRect);
    });

    if (target) resizeObserver.observe(target);

    return () => {
      if (target) resizeObserver.unobserve(target);
    };
  }, [target]);
  return dimensions;
};

const truncateSVGText = (element: SVGTextElement, maxWidth: number) => {
  // must be called after text and all text attributes/styles are assigned
  if (element.getComputedTextLength() < maxWidth) return;
  if (maxWidth < 0) throw Error("maxWidth cannot be less than 0");

  element.textContent += "...";
  while (element.getComputedTextLength() > maxWidth) {
    element.textContent = element.textContent
      ? element.textContent.length <= 3
        ? element.textContent.slice(0, -1)
        : element.textContent.slice(0, -4) + element.textContent.slice(-3)
      : "";
  }
};

const percentile = (arr: number[], val: number) => {
  let count = 0;
  arr.forEach((v) => {
    if (v < val) {
      count++;
    } else if (v === val) {
      count += 0.5;
    }
  });
  return (100 * count) / arr.length;
};

export { useResizeObserver, truncateSVGText, percentile };
