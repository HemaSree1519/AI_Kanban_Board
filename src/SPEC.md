<!-- File: SPEC.md -->
## Feature: Kanban Board

### User Stories
- **Default Columns**: As a user, I want to see three default columns – *To Do*, *In Progress*, and *Done* – so I have an initial board layout.
- **Add Columns**: As a user, I want to add additional columns on demand, giving me flexibility to organise work.
- **Delete Columns**: As a user, I want to delete a column that is no longer needed, so the board stays relevant.
- **Card Count**: As a user, I want each column header to display the number of cards it contains, so I can quickly gauge workload.
- **Create Card**: As a user, I can add a card with a **title**, **priority** (Low / Medium / High), and **assignee name** to any column.
- **Move Card**: As a user, I can move cards between columns, updating the board state and column counts.
- **Delete Card**: As a user, I can delete a card when it is no longer needed.
- **Priority Filter**: As a user, I can filter the whole board to show only cards of a selected priority level.
- **Search**: As a user, I can search across all columns by card title or assignee name, with results displayed in place.

### Acceptance Criteria
1. **Column Rendering**
   - The board initially shows *To Do*, *In Progress*, and *Done* columns.
   - Each column header displays its name and a live card count in the format `Column Name (X)`.
2. **Add Column**
   - An “Add Column” control creates a new column with a default editable name (e.g., “New Column”).
   - New columns behave identically to default columns (count, move, delete cards, etc.).
3. **Delete Column**
   - Each column header includes a delete (✕) button.
   - Clicking the delete button removes the column from the board and updates the UI.
   - Deleting a column also removes any cards it contained; column counts update accordingly.
   - The board must always retain at least one column; attempts to delete the last remaining column should be blocked with a user warning.
4. **Create Card**
   - A card creation UI requires a non‑empty title, a priority selector (Low, Medium, High), and an assignee text field.
   - Upon submission, the new card appears in the selected column and the column count increments.
5. **Card Display**
   - Each card shows the title, a coloured priority badge (e.g., red for High), and the assignee name.
6. **Move Card**
   - Moving a card from one column to another updates both source and destination counts instantly.
7. **Delete Card**
   - Deleting a card removes it from the DOM and decrements the containing column’s count.
8. **Priority Filter**
   - A dropdown (All, Low, Medium, High) filters cards globally; only cards matching the selected priority remain visible.
   - Selecting “All” shows every card.
9. **Search Bar**
   - A text input filters cards case‑insensitively by title **or** assignee name.
   - An empty search string shows all (or filtered‑by‑priority) cards.
10. **Combined Filtering**
    - Priority filter and search work together; a card is shown only if it matches **both** active criteria.
11. **Responsive UI**
    - Layout adapts to typical desktop widths; columns wrap or scroll on narrower screens.
    - **Horizontal Layout**: Columns are displayed side‑by‑side (horizontally) across the board, using a flex‑based layout that maintains equal spacing and wraps when the viewport is too narrow.

### Edge Cases
- Adding a column with a name that already exists – UI should allow it but keep names unique visually (optional warning).
- Submitting a new card with an empty title – form validation prevents creation and shows an error.
- Deleting the last card in a column – column count shows zero and remains functional.
- Moving a card to a column that has just been removed – operation should be blocked with a user warning.
- Switching the priority filter to “All” after a specific filter – all cards become visible again (subject to search term).
- Entering a very long title or assignee name – text truncates with ellipsis or wraps without breaking layout.
- Rapid successive drag‑and‑drop actions – counts remain accurate; UI does not crash.
- No cards match the active filters – column headers display counts of zero and a placeholder “No cards” message may appear.

### Non-Goals
- Persistent storage (localStorage, server API, or database) – the board is volatile for this iteration.
- Real‑time multi‑user collaboration or conflict resolution.
- User authentication or role‑based permissions.
- Advanced drag‑and‑drop animations or physics beyond basic movement.
- Mobile‑native app packaging; only a responsive web UI is targeted.
- Export/Import of board data.
- Integration with external issue‑tracking systems.