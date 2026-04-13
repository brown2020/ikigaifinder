import { fixupConfigRules } from "@eslint/compat";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  ...fixupConfigRules([...nextCoreWebVitals, ...nextTypeScript]),
  {
    name: "project/overrides",
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
