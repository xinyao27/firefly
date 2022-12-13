#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::path::Path;
use tauri;
use tauri_plugin_sql::{Migration, MigrationKind, TauriSql};

#[tauri::command]
fn is_directory(path: String) -> bool {
    let target_path = Path::new(&path);
    target_path.is_dir()
}

fn main() {
    let builder = tauri::Builder::default();

    builder
        .plugin(TauriSql::default().add_migrations(
            "sqlite:firefly.db",
            vec![Migration {
                version: 1,
                description: "create message",
                sql: include_str!("../migrations/initial.sql"),
                kind: MigrationKind::Up,
            }],
        ))
        .invoke_handler(tauri::generate_handler![is_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
