import React from "react";
import AnyChart from "anychart-react";

export interface VennDiagramT {
  Passion: number;
  Profession: number;
  Vocation: number;
  Mission: number;
  OverallCompatibility: number;
  ikigai: string;
}
const VennDiagram = ({ chartData }: { chartData: VennDiagramT }) => {
  const data = [
    {
      x: "good",
      value: 200,
      name: "Good at",
      normal: { fill: "#DC143C 0.5" },
      label: { fontSize: 9 },
    },
    {
      x: "money",
      value: 200,
      name: "Paid for",
      normal: { fill: "#B8860B 0.5" },
      label: { fontSize: 9 },
    },
    {
      x: "need",
      value: 200,
      name: "World need",
      normal: { fill: "#E9967A 0.5" },
      label: { fontSize: 9 },
    },
    {
      x: "love",
      value: 200,
      name: "Love",
      normal: { fill: "#455a64 0.5" },
      label: { fontSize: 9 },
    },

    {
      x: ["love", "good"],
      value: chartData?.Passion,
      name: "Passion",
      label: { fontSize: 9 },
    },
    {
      x: ["good", "money"],
      value: chartData?.Profession,
      name: "Profession",
      label: { fontSize: 9 },
    },
    {
      x: ["love", "need"],
      value: chartData?.Mission,
      name: "Mission",
      label: { fontSize: 9 },
    },

    {
      x: ["money", "need"],
      value: chartData?.Vocation,
      name: "Vocation",
      label: { fontSize: 9 },
    },

    {
      x: ["love", "good", "money", "need"],
      value: chartData?.OverallCompatibility,
      name: "Ikigai",
      label: { fontSize: 9 },
    },
  ];

  const complexSettings = {
    width: 250,
    height: 250,
    type: "venn",
    data,
    background: "transparent",

    color: ["	#FFE4C4", "	#000000", "	#FFEBCD", "#0000FF"],
    legend: {
      enabled: false,
      display: "hidden",
      background: "lightgreen 0.4",
      padding: 0,
    },
    lineMarker: {
      value: 4.5,
    },
  };

  return <AnyChart {...complexSettings} />;
};

export default VennDiagram;
