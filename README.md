## Running

1. Make an `auth.json` file like so:
    ```json
    {
        "token": "secret"
    }
    ```
    Get a token from https://github.com/settings/tokens/
2. `yarn install`
3. Run `node index.js matrix-org matrix-doc`,
   using the repo org and name as appropriate.
4. Open `html/matrix-org/matrix-doc/index.html` in a browser.
