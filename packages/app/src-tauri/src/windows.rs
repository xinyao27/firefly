use crate::config;
use crate::utils;
use crate::ALWAYS_ON_TOP;
use crate::APP_HANDLE;
use mouse_position::mouse_position::Mouse;
use std::sync::atomic::Ordering;
use tauri::{LogicalPosition, Manager, PhysicalPosition};
#[cfg(target_os = "windows")]
use window_shadows::set_shadow;
#[cfg(target_os = "linux")]
use window_shadows::set_shadow;

pub const MAIN_WIN_NAME: &str = "main";
pub const COPILOT_WIN_NAME: &str = "copilot";

fn get_mouse_location() -> Result<(i32, i32), String> {
    let position = Mouse::get_mouse_position();
    match position {
        Mouse::Position { x, y } => Ok((x, y)),
        Mouse::Error => Err("Error getting mouse position".to_string()),
    }
}

#[tauri::command]
pub fn set_main_window_always_on_top() -> bool {
    let handle = APP_HANDLE.get().unwrap();
    let window = handle.get_window(MAIN_WIN_NAME).unwrap();

    let always_on_top = ALWAYS_ON_TOP.load(Ordering::Acquire);

    if !always_on_top {
        window.set_always_on_top(true).unwrap();
        ALWAYS_ON_TOP.store(true, Ordering::Release);
    } else {
        window.set_always_on_top(false).unwrap();
        ALWAYS_ON_TOP.store(false, Ordering::Release);
    }
    ALWAYS_ON_TOP.load(Ordering::Acquire)
}

#[tauri::command]
pub fn set_copilot_window_always_on_top() -> bool {
    let handle = APP_HANDLE.get().unwrap();
    let window = handle.get_window(COPILOT_WIN_NAME).unwrap();

    let always_on_top = ALWAYS_ON_TOP.load(Ordering::Acquire);

    if !always_on_top {
        window.set_always_on_top(true).unwrap();
        ALWAYS_ON_TOP.store(true, Ordering::Release);
    } else {
        window.set_always_on_top(false).unwrap();
        ALWAYS_ON_TOP.store(false, Ordering::Release);
    }
    ALWAYS_ON_TOP.load(Ordering::Acquire)
}

#[tauri::command]
pub fn show_copilot_window_with_selected_text() {
    let selected_text = match utils::get_selected_text() {
        Ok(text) => text,
        Err(e) => {
            eprintln!("Error getting selected text: {}", e);
            "".to_string()
        }
    };
    if !selected_text.is_empty() {
        show_copilot_window(false);
        utils::send_text(selected_text);
    } else {
        show_copilot_window(true);
    }
}

pub fn show_main_window(center: bool) {
    let handle = APP_HANDLE.get().unwrap();
    match handle.get_window(MAIN_WIN_NAME) {
        Some(window) => {
            let restore_previous_position = match config::get_config() {
                Ok(config) => config.restore_previous_position.unwrap_or(false),
                Err(e) => {
                    eprintln!("Error getting config: {}", e);
                    false
                }
            };

            if restore_previous_position {
                if !cfg!(target_os = "macos") {
                    window.unminimize().unwrap();
                }
            } else {
                if !center {
                    let (x, y): (i32, i32) = get_mouse_location().unwrap();
                    if cfg!(target_os = "macos") {
                        window
                            .set_position(LogicalPosition::new(x as f64, y as f64))
                            .unwrap();
                    } else {
                        window.unminimize().unwrap();
                        window
                            .set_position(PhysicalPosition::new(x as f64, y as f64))
                            .unwrap();
                    }
                } else {
                    if !cfg!(target_os = "macos") {
                        window.unminimize().unwrap();
                    }
                    window.center().unwrap();
                }
            }
            window.unminimize().unwrap();
            window.set_focus().unwrap();
            window.show().unwrap();
        }
        None => {
            let builder = tauri::WindowBuilder::new(
                handle,
                MAIN_WIN_NAME,
                tauri::WindowUrl::App("index.html".into()),
            )
            .fullscreen(false)
            .inner_size(900.0, 1080.0)
            .min_inner_size(600.0, 800.0)
            .resizable(true)
            .skip_taskbar(true)
            .center()
            .focused(true)
            .title("Firefly");

            #[cfg(target_os = "macos")]
            {
                builder
                    .title_bar_style(tauri::TitleBarStyle::Overlay)
                    .hidden_title(true)
                    .build()
                    .unwrap();
            }

            #[cfg(target_os = "windows")]
            {
                let window = builder.decorations(false).build().unwrap();

                set_shadow(&window, true).unwrap();
            }

            #[cfg(target_os = "linux")]
            {
                let window = builder.decorations(false).build().unwrap();

                set_shadow(&window, true).unwrap();
            }
        }
    }
}

pub fn show_copilot_window(center: bool) {
    let handle = APP_HANDLE.get().unwrap();
    match handle.get_window(COPILOT_WIN_NAME) {
        Some(window) => {
            let restore_previous_position = match config::get_config() {
                Ok(config) => config.restore_previous_position.unwrap_or(false),
                Err(e) => {
                    eprintln!("Error getting config: {}", e);
                    false
                }
            };

            if restore_previous_position {
                if !cfg!(target_os = "macos") {
                    window.unminimize().unwrap();
                }
            } else {
                if !center {
                    let (x, y): (i32, i32) = get_mouse_location().unwrap();
                    if cfg!(target_os = "macos") {
                        window
                            .set_position(LogicalPosition::new(x as f64, y as f64))
                            .unwrap();
                    } else {
                        window.unminimize().unwrap();
                        window
                            .set_position(PhysicalPosition::new(x as f64, y as f64))
                            .unwrap();
                    }
                } else {
                    if !cfg!(target_os = "macos") {
                        window.unminimize().unwrap();
                    }
                    window.center().unwrap();
                }
            }
            window.unminimize().unwrap();
            window.set_focus().unwrap();
            window.show().unwrap();
        }
        None => {
            let builder = tauri::WindowBuilder::new(
                handle,
                COPILOT_WIN_NAME,
                tauri::WindowUrl::App("copilot.html".into()),
            )
            .fullscreen(false)
            .inner_size(600.0, 700.0)
            .min_inner_size(560.0, 600.0)
            .resizable(false)
            .skip_taskbar(true)
            .center()
            .focused(true)
            .title("Firefly Copilot");

            #[cfg(target_os = "macos")]
            {
                builder
                    .title_bar_style(tauri::TitleBarStyle::Overlay)
                    .hidden_title(true)
                    .build()
                    .unwrap();
            }

            #[cfg(target_os = "windows")]
            {
                let window = builder.decorations(false).build().unwrap();

                set_shadow(&window, true).unwrap();
            }

            #[cfg(target_os = "linux")]
            {
                let window = builder.decorations(false).build().unwrap();

                set_shadow(&window, true).unwrap();
            }
        }
    }
}
