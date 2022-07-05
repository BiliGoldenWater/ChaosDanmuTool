/*
 * Copyright 2021-2022 Golden_Water
 * SPDX-License-Identifier: AGPL-3.0-only
 */

#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::time::Duration;

use tauri::{App, AppHandle, command, Manager, Wry};
use tauri::async_runtime::block_on;
use tokio_tungstenite::tungstenite::Message;

use chaosdanmutool::libs::network::danmu_receiver::danmu_receiver::DanmuReceiver;
use chaosdanmutool::libs::network::websocket::websocket_server::WebSocketServer;
use chaosdanmutool::libs::network::websocket::websocket_server::WebSocketServerEvent::OnConnection;
#[cfg(target_os = "macos")]
use chaosdanmutool::libs::utils::window_utils::set_visible_on_all_workspaces;

static mut RECEIVER: Option<DanmuReceiver> = None;
static mut SERVER: Option<WebSocketServer> = None;

#[command]
fn connect() {
  unsafe {
    if let Some(receiver) = &mut RECEIVER {
      let _ = block_on(receiver.connect(34348));
    }
  }
}

#[command]
fn disconnect() {
  unsafe {
    if let Some(receiver) = &mut RECEIVER {
      block_on(receiver.disconnect());
    }
  }
}

#[command]
fn listen() {
  unsafe {
    if let Some(server) = &mut SERVER {
      server.listen("0.0.0.0:80".to_string())
    }
  }
}

#[command]
fn broadcast() {
  unsafe {
    if let Some(server) = &mut SERVER {
      block_on(server.broadcast(Message::Text("test".to_string())));
    }
  }
}

#[command]
fn close() {
  unsafe {
    if let Some(server) = &mut SERVER {
      server.close()
    }
  }
}

fn main() {
  unsafe { RECEIVER = Some(DanmuReceiver::new(30)); }
  unsafe {
    let server = WebSocketServer::new(|event| {
      match event {
        OnConnection(connection_id) => {
          println!("new connection: {}", connection_id);
          if let Some(server) = &mut SERVER {
            let connection = server.get_connection(connection_id);
            if let Some(connection) = connection {
              tauri::async_runtime::spawn(connection.send(Message::Text("test".to_string())));
            }
          }
        }
      }
    });
    SERVER = Some(server);
  }

  std::thread::spawn(|| {
    unsafe {
      loop {
        if let Some(receiver) = &mut RECEIVER {
          block_on(receiver.tick());
        }
        if let Some(server) = &mut SERVER {
          block_on(server.tick());
        }
        std::thread::sleep(Duration::from_millis(100))
      }
    }
  });

  let context = tauri::generate_context!();

  // region init
  let app = tauri::Builder::default()
    .setup(|app| {
      on_init(app);
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![connect,disconnect,listen,broadcast,close])
    .menu(if cfg!(target_os = "macos") {
      tauri::Menu::os_default("Chaos Danmu Tool")
    } else {
      tauri::Menu::default()
    })
    .build(context)
    .expect("error while building tauri application");
  // endregion

  app
    .run(|app_handle, event| match event {
      tauri::RunEvent::Ready {} => { // ready event
        on_ready(app_handle)
      }
      #[cfg(target_os = "macos")]
      tauri::RunEvent::ExitRequested { api, .. } => { // exit requested event
        println!("[RunEvent.ExitRequested] Exit prevented");
        api.prevent_exit()
      }

      _ => {}
    });
}

fn on_init(app: &mut App<Wry>) {
  show_main_window(app.app_handle());
}

fn on_ready(_app_handle: &AppHandle<Wry>) {}

fn show_main_window(app_handle: AppHandle<Wry>) {
  let main_window = app_handle.get_window("main");

  if let Some(main_window) = main_window {
    main_window.show().expect("Failed to show main_window");
  } else {
    create_main_window(app_handle)
  }
}

fn create_main_window(app_handle: AppHandle<Wry>) {
  let main_window = tauri::WindowBuilder
  ::new(&app_handle, "main", tauri::WindowUrl::App("index.html".into()))
    .build()
    .unwrap();

  main_window.set_title("Chaos Danmu Tool")
    .expect("Failed to set title of main_window");

  #[cfg(debug_assertions)]{
    main_window.set_always_on_top(true).expect("Failed to set always on top of main_window");
    main_window.open_devtools()
  }

  #[cfg(target_os = "macos")]
  set_visible_on_all_workspaces(main_window,
                                true,
                                true,
                                false);
}
