import React from "react";
import ReactCompareImage from "react-compare-image";

export default function ComparePreview({ original, upscaled }) {
  // react-compare-image handles touch & mouse comparisons and is responsive
  return (
    <div className="rounded overflow-hidden">
      <div style={{ width: "100%" }}>
        <ReactCompareImage
          leftImage={original}
          rightImage={upscaled}
          sliderLineWidth={2}
          sliderPositionPercentage={50}
        />
      </div>
    </div>
  );
}
