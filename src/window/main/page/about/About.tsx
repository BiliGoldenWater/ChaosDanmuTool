/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import {
  Button,
  Card,
  Divider,
  message,
  notification,
  Skeleton,
  Tooltip,
  Typography,
} from "antd";
import MarkdownIt from "markdown-it";
import Link from "antd/lib/typography/Link";
import { ResultStatus } from "../../../../type/TResultStatus";

const { Title, Paragraph } = Typography;

enum Status {
  FailedToLoad = "&{FailedToLoad}&",
}

class Props {
  checkUpdate: (whenDone: () => void) => void;
}

class State {
  changeLog: string;
  gettingChangeLog: boolean;
}

export class About extends React.Component<Props, State> {
  markdownIt: MarkdownIt;

  constructor(props: Props) {
    super(props);

    this.state = {
      changeLog: "",
      gettingChangeLog: false,
    };

    this.markdownIt = new MarkdownIt();

    this.updateChangeLog();
  }

  updateChangeLog(fromUser?: boolean) {
    window.electron.getChangeLog().then((changeLogRes) => {
      if (changeLogRes.status != ResultStatus.Success) {
        if (fromUser) {
          notification.error({
            message: "获取更新日志失败",
            description: changeLogRes.message,
          });
        }
        this.setState({
          changeLog: Status.FailedToLoad,
        });
        return;
      }

      this.setState({
        changeLog: changeLogRes.result,
      });
    });
  }

  render(): ReactNode {
    const p = this.props;
    const s = this.state;

    const version = (
      <Tooltip title={"检查更新"}>
        <Link
          onClick={() => {
            p.checkUpdate(message.loading("检查更新中"));
          }}
        >
          {window.electron.getVersion()}
        </Link>
      </Tooltip>
    );
    const platform = window.electron.getPlatform();
    const arch = window.electron.getArch();

    let changelog: ReactNode;

    if (s.changeLog != "" && s.changeLog != Status.FailedToLoad) {
      changelog = (
        <Card>
          <div
            dangerouslySetInnerHTML={{
              __html: this.markdownIt.render(s.changeLog),
            }}
          />
        </Card>
      );
    } else if (s.changeLog == Status.FailedToLoad) {
      changelog = (
        <Button
          loading={s.gettingChangeLog}
          onClick={() => {
            this.setState({
              gettingChangeLog: true,
            });
            this.updateChangeLog(true);
          }}
        >
          重新加载
        </Button>
      );
    } else {
      changelog = [
        <Skeleton active key={"1"} />,
        <Skeleton active key={"2"} />,
        <Skeleton active key={"3"} />,
      ];
    }

    return (
      <div>
        <Typography>
          <Title level={3}>
            Chaos Danmu Tool {version}-{platform}-{arch}
          </Title>
          <Divider />
          <Paragraph
            copyable={{
              text: "442025553",
            }}
          >
            交流群: QQ442025553
          </Paragraph>
          <Paragraph
            copyable={{
              text: "https://github.com/BiliGoldenWater/ChaosDanmuTool",
            }}
          >
            Github 存储库主页: github.com/BiliGoldenWater/ChaosDanmuTool
          </Paragraph>
          <Paragraph>
            Chaos Danmu Tool 使用 AGPL-3.0-only 许可证开源
            <br />
            你应该随程序获得一份许可证副本(文件 COPYING).
            <br />
            如果没有, 请看:{" "}
            <Typography.Link>
              https://www.gnu.org/licenses/agpl-3.0.txt
            </Typography.Link>
          </Paragraph>
          <Divider orientation="left">更新记录</Divider>
          {changelog}
        </Typography>
      </div>
    );
  }
}
