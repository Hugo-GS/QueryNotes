# Presentation Mode (Headless View)

The **API CRUD y JWT Portfolio** includes a "Presentation Mode" designed for clean demonstrations, embedding in iframes, or sharing read-only views of your backend architecture notebooks.

## How it Works

This mode strips away all "Editor" UI elements, leaving only the content (Text notes and Request/Response visualizations). It transforms the application from an interactive IDE into a clean documentation viewer.

### Activation

You can trigger this mode via the URL Query Parameter `presentation=true`.

```
https://your-app-url.com/?presentation=true
```

### UI Changes

When active (`?presentation=true`):

1.  **Header Hidden**: The top navigation bar (Title, Theme Toggle) is removed.
2.  **Toolbar Hidden**: The Import, Export, and Load URL buttons are removed.
3.  **Read-Only Cells**:
    *   Text cells cannot be edited.
    *   Request cells cannot be deleted or reconfigured (Mode switchers become static badges).
    *   *Note: Requests can still be executed (Play button) to demonstrate live API calls.*
4.  **No Creation Controls**: The "Add Text", "Add Request", and "Add Split Row" buttons are hidden.
5.  **No Context Menu**: Right-clicking cells does not trigger the edit menu.

---

## Use Case: Sharing & Embedding

The most powerful use of this feature is combining it with the `notebook` query parameter. This allows you to send a single link that:
1.  Loads a specific configuration (from a remote JSON).
2.  Displays it instantly in a clean UI.

### URL Structure

```
https://your-app-url.com/?notebook={JSON_URL}&presentation=true
```

### Example Scenario

You have a `demo-auth-flow.json` hosted on GitHub Gist or a public S3 bucket. You want to send this to a recruiter or client.

**The Link:**
```
https://api-portfolio.vercel.app/?notebook=https://gist.githubusercontent.com/user/123/raw/demo.json&presentation=true
```

**The Result:**
The user opens the link and immediately sees the "Authentication Flow" notebook. They see the documentation and the request blocks. They can click "SEND" to see the simulated response, but they cannot accidentally delete cells or see the editor tools.

---

## Summary of Query Parameters

| Parameter      | Value    | Description                                                                 |
| :------------- | :------- | :-------------------------------------------------------------------------- |
| `presentation` | `true`   | Enables Headless mode. Hides Navbar, Toolbar, and Edit controls.            |
| `notebook`     | `https://...` | Automatically fetches and loads a Notebook JSON file from the provided URL. |