#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;
use tauri_plugin_sql::{Migration, MigrationKind, TauriSql};
mod commands;

fn main() {
    tauri::Builder::default()
        .plugin(TauriSql::default().add_migrations(
            "sqlite:firefly.db",
            vec![Migration {
                version: 1,
                description: "create message",
                sql: include_str!("../migrations/initial.sql"),
                kind: MigrationKind::Up,
            }],
        ))
        .invoke_handler(tauri::generate_handler![commands::is::is_directory])
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_window("main").unwrap().open_devtools();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
