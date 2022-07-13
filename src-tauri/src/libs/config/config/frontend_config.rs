/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

use crate::libs::config::config::frontend_config::main_view_config::MainViewConfig;
use crate::libs::config::config::frontend_config::viewer_view_config::ViewerViewConfig;
use crate::libs::config::config::{ALLOW_CONFIG_SKIP_IF, INTERNAL_VIEWER_UUID};

pub mod main_view_config;
pub mod viewer_view_config;

#[derive(serde::Serialize, serde::Deserialize, ts_rs::TS, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
#[ts(export, export_to = "../src/share/type/rust/config/")]
pub struct FrontendConfig {
  #[serde(default = "main_view_default")]
  #[serde(skip_serializing_if = "main_view_skip_if")]
  pub main_view: MainViewConfig,
  #[serde(default = "viewer_view_default")]
  #[serde(skip_serializing_if = "viewer_view_skip_if")]
  pub viewer_view: Vec<ViewerViewConfig>,
}

//region main_view
fn main_view_default() -> MainViewConfig {
  serde_json::from_str("{}").unwrap()
}

fn main_view_skip_if(value: &MainViewConfig) -> bool {
  *value == main_view_default() && *ALLOW_CONFIG_SKIP_IF.read().unwrap()
}
//endregion

//region viewer_view
fn viewer_view_default() -> Vec<ViewerViewConfig> {
  let mut default_internal: ViewerViewConfig = serde_json::from_str("{}").unwrap();
  default_internal.uuid = INTERNAL_VIEWER_UUID.to_string().clone();
  default_internal.name = "内部查看器".to_string();
  vec![default_internal]
}

fn viewer_view_skip_if(value: &Vec<ViewerViewConfig>) -> bool {
  *value == viewer_view_default() && *ALLOW_CONFIG_SKIP_IF.read().unwrap()
}
//endregion
