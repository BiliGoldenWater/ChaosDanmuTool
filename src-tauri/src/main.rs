/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::time::Duration;

#[allow(unused_imports)]
use tauri::{App, AppHandle, command, Manager, Wry};
use tauri::{Assets, Context};
use tauri::async_runtime::block_on;

use chaosdanmutool::libs::config::config_manager::ConfigManager;
use chaosdanmutool::libs::network::command_broadcast_server::CommandBroadcastServer;
use chaosdanmutool::libs::network::danmu_receiver::danmu_receiver::DanmuReceiver;
#[cfg(target_os = "macos")]
use chaosdanmutool::libs::utils::window_utils::set_visible_on_all_workspaces;

fn main() {
  let context = tauri::generate_context!();

  on_init(&context);

  // region init
  let app = tauri::Builder::default()
    .setup(|app| {
      on_setup(app);
      Ok(())
    })
    // .invoke_handler(tauri::generate_handler![connect,disconnect,listen,broadcast,close])
    .menu(if cfg!(target_os = "macos") {
      tauri::Menu::os_default("Chaos Danmu Tool")
    } else {
      tauri::Menu::default()
    })
    .build(context)
    .expect("error while building tauri application");
  // endregion

  //region run
  app.run(|app_handle, event| match event {
    tauri::RunEvent::Ready {} => {
      // ready event
      println!("[RunEvent.Ready] ready");
      on_ready(app_handle)
    }
    tauri::RunEvent::ExitRequested { api, .. } => {
      // exit requested event
      println!("[RunEvent.ExitRequested] exit requested");
      api.prevent_exit();
      println!("[RunEvent.ExitRequested] exit prevented");
    }
    tauri::RunEvent::Exit => {
      println!("[RunEvent.Exit] exiting");
      ConfigManager::save();
    }

    _ => {}
  });
  //endregion
}

fn on_init<A: Assets>(context: &Context<A>) {
  ConfigManager::init(context);
}

fn on_setup(app: &mut App<Wry>) {
  start_ticking();

  show_main_window(app.app_handle());
}

fn on_ready(_app_handle: &AppHandle<Wry>) {}

fn start_ticking() {
  std::thread::spawn(|| loop {
    block_on(DanmuReceiver::tick());
    block_on(CommandBroadcastServer::tick());
    std::thread::sleep(Duration::from_millis(200));
  });
}

fn show_main_window(app_handle: AppHandle<Wry>) {
  let main_window = app_handle.get_window("main");

  if let Some(main_window) = main_window {
    main_window.show().expect("Failed to show main_window");
  } else {
    create_main_window(app_handle)
  }
}

fn create_main_window(app_handle: AppHandle<Wry>) {
  let main_window = tauri::WindowBuilder::new(
    &app_handle,
    "main",
    tauri::WindowUrl::App("index.html".into()),
  )
    .build()
    .unwrap();

  main_window
    .set_title("Chaos Danmu Tool")
    .expect("Failed to set title of main_window");

  #[cfg(debug_assertions)]
  {
    main_window
      .set_always_on_top(true)
      .expect("Failed to set always on top of main_window");
    main_window.open_devtools()
  }

  #[cfg(target_os = "macos")]
  set_visible_on_all_workspaces(main_window, true, true, false);
}

#[allow(unused)]
fn exit() {
  std::process::exit(0);
}
