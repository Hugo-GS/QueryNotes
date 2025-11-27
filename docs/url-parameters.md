# URL Query Parameters Documentation

**QueryBook** supports extensive configuration via URL Query Parameters. This feature is designed for:
- Embedding the application in personal portfolios (Iframes).
- Sharing specific notebook configurations with team members.
- Creating "Headless" demos for presentations.

## Available Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **`notebookUrl`** | `string` | `null` | The absolute URL of a Notebook JSON file to load automatically on startup. <br> *Alias: `notebook`* |
| **`presentation`** | `boolean` | `false` | Activates **Presentation Mode** (Hides Header, Toolbar, Editor controls). <br> *Aliases: `readOnly`, `hideEditButtons`* |
| **`theme`** | `string` | `dark` | Sets the color theme. Accepted values: `dark`, `light`. |
| **`cellWidth`** | `number` | `1024` | Sets the initial width of the notebook container in pixels. Useful for fitting into specific iframe sizes. |
| **`collapseCells`** | `boolean` | `false` | If `true`, all cells in the loaded notebook will start in a collapsed state (showing only the title/endpoint). |

---

## Usage Examples

### 1. Basic Notebook Loading
Load a notebook from an external source (e.g., GitHub Gist, S3).

```
https://your-app.com/?notebookUrl=https://example.com/my-notebook.json
```

### 2. Embedded Portfolio Mode (Read-Only)
Ideal for embedding in a personal website. It loads the notebook, hides the "Edit" buttons, hides the top navigation bar, and sets the theme to light.

```
https://your-app.com/?notebook=https://example.com/portfolio.json&readOnly=true&theme=light
```

### 3. Compact View
Load a notebook, force all cells to be collapsed initially (index view), and set a narrower container width.

```
https://your-app.com/?notebook=https://example.com/data.json&collapseCells=true&cellWidth=800
```

### 4. Direct Theme Link
Simply open the default empty app but in Light mode.

```
https://your-app.com/?theme=light
```

---

## Implementation Details

The logic for parsing these parameters is located in `shared/hooks/useAppQuery.ts`.

- **Aliases**:
  - `notebook` works exactly the same as `notebookUrl`.
  - `readOnly` and `hideEditButtons` trigger the exact same logic as `presentation=true`.
- **Priority**: URL parameters override any local default settings but can be overridden by user interaction (e.g., the user can still toggle the theme manually if the Header is visible).

---

## Related Documentation

- [Presentation Mode](./presentation-mode.md) - Detailed guide on using the headless/read-only view
