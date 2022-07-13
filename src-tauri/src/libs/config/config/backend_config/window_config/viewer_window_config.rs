/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

#[derive(serde::Serialize, serde::Deserialize, ts_rs::TS, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../src/share/type/rust/config/backendConfig/windowConfig/")]
pub struct ViewerWindowConfig {
  #[serde(default = "x_default")]
  #[serde(skip_serializing_if = "x_skip_if")]
  x: i32,
  #[serde(default = "y_default")]
  #[serde(skip_serializing_if = "y_skip_if")]
  y: i32,
  #[serde(default = "width_default")]
  #[serde(skip_serializing_if = "width_skip_if")]
  width: i32,
  #[serde(default = "height_default")]
  #[serde(skip_serializing_if = "height_skip_if")]
  height: i32,
}

fn x_default() -> i32 {
  0
}

fn x_skip_if(value: &i32) -> bool {
  *value == x_default()
}

fn y_default() -> i32 {
  0
}

fn y_skip_if(value: &i32) -> bool {
  *value == y_default()
}

fn width_default() -> i32 {
  400
}

fn width_skip_if(value: &i32) -> bool {
  *value == width_default()
}

fn height_default() -> i32 {
  600
}

fn height_skip_if(value: &i32) -> bool {
  *value == height_default()
}


