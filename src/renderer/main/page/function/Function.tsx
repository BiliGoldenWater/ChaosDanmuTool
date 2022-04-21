/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import "./Function.less";
import { ConfigC } from "../../../ConfigContext";
import { Content } from "../../component/content/Content";
import { FunctionPageKey, functionPageList } from "./FunctionPage";
import { FunctionInfo } from "./FunctionInfo";

export const functionPagePathKey = "functionPage";

export class Function extends React.Component {
  render(): ReactNode {
    return (
      <ConfigC>
        {({ state: { path }, setPathOption }) => {
          const pageKey: FunctionPageKey = path.searchParams.get(
            functionPagePathKey
          ) as FunctionPageKey;

          if (pageKey == null || pageKey === "") {
            const pages = functionPageList.map((value) => (
              <FunctionInfo
                key={value.key}
                info={value}
                onClick={() => {
                  setPathOption(functionPagePathKey, value.key);
                }}
              />
            ));

            return (
              <Content>
                <div className={"Function"}>{pages}</div>
              </Content>
            );
          }

          return (
            functionPageList
              .find((value) => value.key === pageKey)
              ?.render?.() ?? <Content padding>{pageKey} 未完成</Content>
          );
        }}
      </ConfigC>
    );
  }
}
