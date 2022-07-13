/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

#[derive(serde::Serialize, serde::Deserialize, ts_rs::TS, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../src/share/type/rust/config/frontendConfig/viewerViewConfig/statusBarConfig")]
pub struct StatusBarComponentConfig {
  #[serde(default = "show_default")]
  #[serde(skip_serializing_if = "show_skip_if")]
  show: bool,
  #[serde(default = "format_number_default")]
  #[serde(skip_serializing_if = "format_number_skip_if")]
  format_number: bool,
}

fn show_default() -> bool {
  true
}

fn show_skip_if(value: &bool) -> bool {
  *value == show_default()
}

fn format_number_default() -> bool {
  true
}

fn format_number_skip_if(value: &bool) -> bool {
  *value == format_number_default()
}

