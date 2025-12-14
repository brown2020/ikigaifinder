import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    name: "project/overrides",
    rules: {
      // This rule is overly aggressive for real-world React codebases and
      // flags many legitimate synchronization patterns.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
