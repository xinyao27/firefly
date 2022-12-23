use std::path::Path;
use tauri;

#[tauri::command]
pub fn is_directory(path: String) -> bool {
    let target_path = Path::new(&path);
    target_path.is_dir()
}
