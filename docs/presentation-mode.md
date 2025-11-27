# Presentation Mode (Headless View)

**QueryBook** includes a "Presentation Mode" designed for clean demonstrations, embedding in iframes, or sharing read-only views of your notebooks.

## How it Works

This mode strips away all "Editor" UI elements, leaving only the content (Text notes and visualizations). It transforms the application from an interactive IDE into a clean documentation viewer.

### Activation

You can trigger this mode via any of these URL Query Parameters:

- `presentation=true` (primary parameter)
- `readOnly=true` (alias)
- `hideEditButtons=true` (alias)

```
https://your-app-url.com/?presentation=true
```

All three parameters trigger the exact same behavior (see `shared/hooks/useAppQuery.ts:22-25`).

### UI Changes

When active (`?presentation=true`):

1. **Header Hidden**: The top navigation bar (Title, Theme Toggle) is removed.
2. **Toolbar Hidden**: The Import, Export, and Load URL buttons are removed.
3. **Read-Only Cells**:
   - Text cells cannot be edited.
   - Request cells cannot be deleted or reconfigured (Mode switchers become static badges).
   - *Note: Requests can still be executed (Play button) to demonstrate live API calls.*
4. **No Creation Controls**: The "Add Text", "Add Request", and "Add Split Row" buttons are hidden.
5. **No Context Menu**: Right-clicking cells does not trigger the edit menu.

---

## Use Case: Sharing & Embedding

The most powerful use of this feature is combining it with the `notebook` query parameter. This allows you to send a single link that:
1. Loads a specific configuration (from a remote JSON).
2. Displays it instantly in a clean UI.

### URL Structure

```
https://your-app-url.com/?notebook={JSON_URL}&presentation=true
```

### Example Scenarios

#### 1. Basic Presentation
You have a `demo-auth-flow.json` hosted on GitHub Gist or a public S3 bucket. You want to send this to a recruiter or client.

**The Link:**
```
https://querybook.vercel.app/?notebook=https://gist.githubusercontent.com/user/123/raw/demo.json&presentation=true
```

**The Result:**
The user opens the link and immediately sees the notebook. They see the documentation and content blocks. They can interact with demos, but they cannot accidentally delete cells or see the editor tools.

#### 2. Embedded Portfolio (Light Theme)
For embedding in a personal website with light theme:

```
https://your-app.com/?notebook=https://example.com/portfolio.json&readOnly=true&theme=light
```

#### 3. Compact Presentation
Load with all cells collapsed and custom width:

```
https://your-app.com/?notebook=https://example.com/data.json&presentation=true&collapseCells=true&cellWidth=800
```

---

## Query Parameters Reference

### Presentation Mode Parameters

| Parameter      | Value    | Description                                                                 |
| :------------- | :------- | :-------------------------------------------------------------------------- |
| `presentation` | `true`   | Enables Presentation mode (primary parameter)                               |
| `readOnly`     | `true`   | Alias for `presentation=true`                                               |
| `hideEditButtons` | `true` | Alias for `presentation=true`                                            |

### Commonly Combined Parameters

| Parameter      | Type | Default | Description                                                                 |
| :------------- | :--- | :------ | :-------------------------------------------------------------------------- |
| `notebook` or `notebookUrl` | `string` | `null` | URL of a Notebook JSON file to load automatically |
| `theme`        | `string` | `dark` | Color theme: `dark` or `light`                                             |
| `cellWidth`    | `number` | `1024` | Width of notebook container in pixels                                      |
| `collapseCells` | `boolean` | `false` | Start with all cells collapsed                                           |

For complete details on all available URL parameters, see [URL Parameters Documentation](./url-parameters.md).
