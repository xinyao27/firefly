#[tauri::command]
async fn start_oauth_server(window: Window) -> Result<u16, String> {
    println!("Starting server");

    start(None, move |url| {
        // Because of the unprotected localhost port, you must verify the URL here.
        // Preferebly send back only the token, or nothing at all if you can handle everything else in Rust.

        // convert the string to a url
        let url = url::Url::parse(&url).unwrap();

        // get the code query parameter
        let code = url
            .query_pairs()
            .find(|(k, _)| k == "code")
            .unwrap_or_default()
            .1;

        // get the state query parameter
        let state = url
            .query_pairs()
            .find(|(k, _)| k == "state")
            .unwrap_or_default()
            .1;

        // create map of query parameters
        let mut query_params = HashMap::new();

        query_params.insert("code".to_string(), code.to_string());
        query_params.insert("state".to_string(), state.to_string());
        query_params.insert(String::from("redirect_uri"), url.to_string());

        if window.emit("redirect_uri", query_params).is_ok() {
            println!("Sent redirect_uri event");
        } else {
            println!("Failed to send redirect_uri event");
        }
    })
    .map_err(|err| err.to_string())
}
