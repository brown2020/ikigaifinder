import React from "react";
import AnyChart from "anychart-react";

export interface VennDiagramT {
  MissionPassion: number;
  ProfessionVocation: number;
  PassionProfession: number;
  MissionVocation: number;
  OverallCompatibility: number;
  ikigai: string
}
const VennDiagram = ({
  chartData,
}: {
  chartData: VennDiagramT;
}) => {
  console.log(chartData, "chartData");

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
      value: chartData?.PassionProfession,
      name: "Passion",
      label: { fontSize: 9 },
    },
    {
      x: ["good", "money"],
      value: chartData?.ProfessionVocation,
      name: "Profession",
      label: { fontSize: 9 },
    },
    {
      x: ["love", "need"],
      value: chartData?.MissionPassion,
      name: "Mission",
      label: { fontSize: 9 },
    },

    {
      x: ["money", "need"],
      value: chartData?.MissionVocation,
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

  // const data = [
  //   {
  //     x: "A",
  //     value: 400,
  //     name: "TIME \n Can be quickly made",
  //   },
  //   {
  //     x: "B",
  //     value: 400,
  //     name: "INGREDIENTS \n Key elements available",
  //   },
  //   {
  //     x: "C",
  //     value: 400,
  //     name: "COMPLEXITY \n Manageable level",
  //   },
  //   {
  //     x: "D",
  //     value: 400,
  //     name: "COMPLEXITY \n Manageable level",
  //   },
  //   {
  //     x: ["A", "C"],
  //     value: 80,
  //     name: "Add to \n wishlist",
  //   },
  //   {
  //     x: ["A", "B"],
  //     value: 70,
  //     name: "Possibility \n of disaster",
  //   },
  //   {
  //     x: ["A", "D"],
  //     value: 85,
  //     name: "Try on a \n holiday ddddd",
  //   },
  //   {
  //     x: ["B", "C"],
  //     value: 92,
  //     name: "Try on a \n holiday",
  //   },
  //   {
  //     x: ["B", "D"],
  //     value: 90,
  //     name: "Try on a \n holiday",
  //   },
  //   {
  //     x: ["C", "D"],
  //     value: 85,
  //     name: "Try on a \n holiday ddddd",
  //   },

  //   {
  //     x: ["A", "B", "C", "D"],
  //     value: 90,
  //     name: "The perfect \n recipe",
  //   },
  // ];

  return (
    <AnyChart
      // width={"100%"} height={200} type="venn" data={data}
      {...complexSettings}
    />
  );
};

export default VennDiagram;
