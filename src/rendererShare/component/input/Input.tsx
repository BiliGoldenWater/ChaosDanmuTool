/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactNode } from "react";
import "./Input.less";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  disabled?: boolean;
};

export class Input extends React.Component<Props> {
  render(): ReactNode {
    const { disabled } = this.props;
    const colorClass = !disabled ? " InputColor" : " InputDisabledColor";

    return <input className={"Input" + colorClass} {...this.props} />;
  }
}
