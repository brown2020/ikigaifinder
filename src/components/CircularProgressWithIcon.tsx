import React from "react";

type CircularProgressWithIconT = {
  value: number;
  color: string;
  Icon: React.ElementType
};

const CircularProgressWithIcon = ({
  value,
  color,
  Icon
}: CircularProgressWithIconT) => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const getProgressColor = (val: number) => {
    if (color) return color; // Return custom color if provided

    switch (true) {
      case val < 25:
        return "#f44336";
      case val < 50:
        return "#ff9800";
      case val < 75:
        return "#ffc107";
      default:
        return "#4caf50";
    }
  };

  return (
    <div className="relative sm:w-14 sm:h-14 w-10 h-10 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="60"
          cy="60"
        />
        <circle
          stroke={getProgressColor(value)}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx="60"
          cy="60"
          strokeLinecap="round"
          className="transition-all duration-300 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-base">
        {/* {Math.round(value)}% */}
        <Icon size={15} />
      </div>
    </div>
  );
};

export default CircularProgressWithIcon;
