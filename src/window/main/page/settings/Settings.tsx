/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import { Button, Collapse, Divider, message, Space } from "antd";
import { MainConfigModifier } from "./configmodifier/mainconfigmodifier/MainConfigModifier";
import { DanmuViewConfigModifier } from "./configmodifier/danmuviewconfigmodifier/DanmuViewConfigModifier";
import { DanmuViewCustomsModifier } from "./configmodifier/danmuviewcustomsmodifier/DanmuViewCustomsModifier";
import { ConfigContext } from "../../utils/ConfigContext";
import { getDefaultConfig } from "../../../../utils/config/Config";

export class Settings extends React.Component {
  render(): ReactNode {
    return (
      <div>
        <ConfigContext.Consumer>
          {({ updateConfig }) => {
            return (
              <Space>
                <Button
                  onClick={() => {
                    window.electron.loadConfig();
                    updateConfig(window.electron.getConfig());
                  }}
                >
                  读取
                </Button>
                <Button
                  onClick={() => {
                    window.electron.saveConfig();
                  }}
                >
                  保存
                </Button>
                <Button
                  onClick={() => {
                    updateConfig(getDefaultConfig());
                    message.success("重置成功").then();
                  }}
                >
                  重置
                </Button>
              </Space>
            );
          }}
        </ConfigContext.Consumer>
        <Divider />
        <Collapse defaultActiveKey={"mainSettings"}>
          <Collapse.Panel key={"mainSettings"} header={"主要设置"}>
            <MainConfigModifier />
          </Collapse.Panel>
          <Collapse.Panel key={"danmuViewSettings"} header={"弹幕查看器设置"}>
            <DanmuViewConfigModifier />
          </Collapse.Panel>
          <Collapse.Panel key={"danmuViewCustoms"} header={"弹幕查看器自定义"}>
            <DanmuViewCustomsModifier />
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
}
