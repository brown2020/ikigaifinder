import React from "react";

const IkigaiDiagram = ({
  className = "h-10 w-10",
  fill = "none",
  strokeColor = "black",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      className={className}
    >
      <circle
        cx="250"
        cy="150"
        r="135"
        fill={fill}
        stroke={strokeColor}
        strokeWidth="25"
      />
      <circle
        cx="350"
        cy="250"
        r="135"
        fill={fill}
        stroke={strokeColor}
        strokeWidth="25"
      />
      <circle
        cx="250"
        cy="350"
        r="135"
        fill={fill}
        stroke={strokeColor}
        strokeWidth="25"
      />
      <circle
        cx="150"
        cy="250"
        r="135"
        fill={fill}
        stroke={strokeColor}
        strokeWidth="25"
      />
    </svg>
  );
};

export default IkigaiDiagram;
