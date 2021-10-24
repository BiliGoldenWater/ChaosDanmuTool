import React from "react";
import {
  DanmuViewCustomConfig,
  defaultDanmuViewCustom,
} from "../../../utils/Config";

export const ConfigContext = React.createContext({
  config: { ...defaultDanmuViewCustom },
  setConfig: (config: DanmuViewCustomConfig): void => {
    console.log(config);
  },
});
