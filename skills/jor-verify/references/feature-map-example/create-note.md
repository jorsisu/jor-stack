# Create a note

Create note lets a user save a titled note from the browser, cancel an unfinished draft, and confirm the saved note from a second view.

## Sub-features

- `create-open` opens a blank editor from each entry point.
- `create-save` persists a title and body.
- `create-cancel` discards an unfinished draft.
- `create-responsive` keeps the editor usable at every breakpoint.

## How to get to it (user POV)

- Choose the `New note` button in the toolbar on `/notes`.
- Press `n` on `/notes` while focus is outside an editable field.

## Driving it with Chrome DevTools MCP

Preconditions:

- `doctor` reports Notes healthy at `http://localhost:5173`.
- No note is titled `Release checklist`.

- **Open editor.** `navigate_page` to `/notes`, `take_snapshot`, then `click` the uid of button `New note`. A form named `Note editor` appears with focus in the `Title` textbox.
- **Enter content.** `take_snapshot`, then `fill_form` the `Title` textbox with `Release checklist` and the `Body` textbox with `Tag and publish`. The `Save note` button becomes enabled.
- **Save note.** `click` button `Save note`, then `wait_for` `Note saved`. The heading reads `Release checklist`.
- **Confirm persistence.** `click` link `All notes`, `take_snapshot`, `click` link `Release checklist`. The editor shows both saved values.
- **Cancel draft.** `click` `New note`, `fill` `Title` with `Discard me`, `click` `Cancel`. The note list returns and the snapshot has no `Discard me` link.
- **Keyboard entry.** Focus the page body, `press_key` `n`. The `Note editor` form appears.
- **Responsive.** Run `breakpoints` on `/notes` with target state `new-note-editor`. After each reload, click `New note` and confirm the `Note editor` form and `Save note` button in a snapshot before taking the screenshot. At 360 the `Save note` button stays visible without horizontal scroll.
- **Proof.** Back on `All notes`, run `snapshot`. The snapshot file and screenshot show `Release checklist`; the console list has no errors.

## Gotchas

- Pressing `n` while a textbox has focus types the character instead of opening a new editor.
- Titles are trimmed on save. Assert the rendered title, not the draft input value.
- A save status alone is insufficient proof. Reopen the note from the list.
- uids change after every navigation; re-snapshot before clicking.
- Delete `Release checklist` during cleanup, but keep its proof artifacts.
