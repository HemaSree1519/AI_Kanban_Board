// File: script.js
// -------------------------------------------------
// Kanban Board – updated to keep search focus
// -------------------------------------------------

// --------------------
// Data model
// --------------------
const board = {
    columns: [
      {
        id: 'col-1',
        name: 'To Do',
        cards: [
          {
            id: `card-${Date.now()}-1`,
            title: 'Design landing page',
            priority: 'High',
            assignee: 'Alice',
          },
          {
            id: `card-${Date.now()}-2`,
            title: 'Write project spec',
            priority: 'Medium',
            assignee: 'Bob',
          },
        ],
      },
      {
        id: 'col-2',
        name: 'In Progress',
        cards: [
          {
            id: `card-${Date.now()}-3`,
            title: 'Implement auth flow',
            priority: 'High',
            assignee: 'Charlie',
          },
        ],
      },
      {
        id: 'col-3',
        name: 'Done',
        cards: [
          {
            id: `card-${Date.now()}-4`,
            title: 'Set up CI/CD',
            priority: 'Low',
            assignee: 'Dana',
          },
        ],
      },
    ],
  };
  
  let filterPriority = 'All'; // All | Low | Medium | High
  let searchTerm = '';        // text to search (title or assignee)
  
  // --------------------
  // Helper utilities
  // --------------------
  function el(tag, classNames = [], text) {
    const element = document.createElement(tag);
    if (classNames.length) element.classList.add(...classNames);
    if (text !== undefined) element.textContent = text;
    return element;
  }
  
  // --------------------
  // Rendering
  // --------------------
  function renderHeader() {
    const header = el('div');
    header.id = 'board-header';
  
    // ----- Priority filter -----
    const prioritySelect = el('select');
    ['All', 'Low', 'Medium', 'High'].forEach(p => {
      const opt = el('option', [], p);
      opt.value = p;
      if (p === filterPriority) opt.selected = true;
      prioritySelect.appendChild(opt);
    });
    prioritySelect.addEventListener('change', e => {
      filterPriority = e.target.value;
      renderBoardContent();      // only the board part is refreshed
    });
    header.appendChild(prioritySelect);
  
    // ----- Search input -----
    const searchInput = el('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search cards…';
    searchInput.value = searchTerm;
    searchInput.addEventListener('input', e => {
      searchTerm = e.target.value.trim().toLowerCase();
      renderBoardContent();      // only the board part is refreshed
    });
    header.appendChild(searchInput);
  
    return header;
  }
  
  // Build only the board (columns, cards, add‑column button)
  function renderBoardContent() {
    const app = document.getElementById('app');
  
    // ---- Remove old board & button if they exist ----
    const oldBoard = document.getElementById('board');
    if (oldBoard) oldBoard.remove();
    const oldBtn = document.getElementById('add-column-btn');
    if (oldBtn) oldBtn.remove();
  
    // ---- Create new board container ----
    const boardEl = el('div');
    boardEl.id = 'board';
  
    board.columns.forEach(col => {
      boardEl.appendChild(renderColumn(col));
    });
  
    // ---- Add‑column button ----
    const addBtn = el('button', [], 'Add Column');
    addBtn.id = 'add-column-btn';
    addBtn.addEventListener('click', onAddColumn);
  
    // ---- Append to app (header is already present) ----
    app.appendChild(boardEl);
    app.appendChild(addBtn);
  }
  
  // Render a column (including header, cards, add‑card button)
  function renderColumn(column) {
    const colDiv = el('div', ['column']);
    colDiv.dataset.id = column.id;
  
    // Header
    const header = el('div', ['column-header']);
    const title = el('span', [], `${column.name} (${column.cards.length})`);
    title.title = 'Double‑click to rename column';
    title.addEventListener('dblclick', () => {
      const newName = prompt('Rename column:', column.name);
      if (newName === null) return;
      const trimmed = newName.trim();
      if (!trimmed) {
        alert('Column name cannot be empty.');
        return;
      }
      column.name = trimmed;
      renderBoardContent();
    });
    header.appendChild(title);
  
    const delBtn = el('button', ['col-delete-btn'], '✕');
    delBtn.title = 'Delete column';
    delBtn.addEventListener('click', onDeleteColumn);
    header.appendChild(delBtn);
    colDiv.appendChild(header);
  
    // Cards container
    const cardsContainer = el('div', ['cards']);
    cardsContainer.dataset.columnId = column.id;
    cardsContainer.addEventListener('dragover', onCardDragOver);
    cardsContainer.addEventListener('drop', onCardDrop);
  
    // Apply filtering
    const filtered = column.cards.filter(card => {
      const matchesPriority = filterPriority === 'All' || card.priority === filterPriority;
      const matchesSearch = !searchTerm ||
        card.title.toLowerCase().includes(searchTerm) ||
        card.assignee.toLowerCase().includes(searchTerm);
      return matchesPriority && matchesSearch;
    });
  
    filtered.forEach(card => cardsContainer.appendChild(renderCard(card, column.id)));
  
    // Placeholder when nothing matches
    if (filtered.length === 0) {
      const placeholder = el('div', ['no-cards'], 'No cards');
      cardsContainer.appendChild(placeholder);
    }
  
    colDiv.appendChild(cardsContainer);
  
    // Add‑card button
    const addCardBtn = el('button', ['add-card-btn'], '+ Add Card');
    addCardBtn.dataset.columnId = column.id;
    addCardBtn.addEventListener('click', onAddCard);
    colDiv.appendChild(addCardBtn);
  
    return colDiv;
  }
  
  // Render a single card element
  function renderCard(card, columnId) {
    const cardDiv = el('div', ['card']);
    cardDiv.dataset.id = card.id;
    cardDiv.dataset.columnId = columnId;
    cardDiv.draggable = true;
    cardDiv.addEventListener('dragstart', onCardDragStart);
    cardDiv.addEventListener('dragend', onCardDragEnd);
  
    // Delete button
    const delBtn = el('button', ['delete-card'], '✕');
    delBtn.title = 'Delete card';
    delBtn.addEventListener('click', onDeleteCard);
    cardDiv.appendChild(delBtn);
  
    // Priority badge
    const badge = el('span', ['priority-badge'], card.priority);
    badge.classList.add(`priority-${card.priority.toLowerCase()}`);
    cardDiv.appendChild(badge);
  
    // Title
    const title = el('div', ['card-title'], card.title);
    cardDiv.appendChild(title);
  
    // Assignee
    const assignee = el('div', ['card-assignee'], `🧑 ${card.assignee}`);
    cardDiv.appendChild(assignee);
  
    return cardDiv;
  }
  
  // --------------------
  // Event Handlers
  // --------------------
  function onAddColumn() {
    const name = prompt('Enter column name:', 'New Column');
    if (name === null) return;
    const trimmed = name.trim();
    if (!trimmed) {
      alert('Column name cannot be empty.');
      return;
    }
    const newId = `col-${Date.now()}`;
    board.columns.push({ id: newId, name: trimmed, cards: [] });
    renderBoardContent();
  }
  
  function onDeleteColumn(event) {
    const colDiv = event.target.closest('.column');
    const colId = colDiv.dataset.id;
  
    if (board.columns.length === 1) {
      alert('At least one column must remain on the board.');
      return;
    }
    if (!confirm(`Delete column "${colDiv.querySelector('span').textContent}"?`)) return;
  
    board.columns = board.columns.filter(c => c.id !== colId);
    renderBoardContent();
  }
  
  function onAddCard(event) {
    const columnId = event.target.dataset.columnId;
    const column = board.columns.find(c => c.id === columnId);
    if (!column) return;
  
    const title = prompt('Card title:');
    if (title === null) return;
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert('Title cannot be empty.');
      return;
    }
  
    const priority = prompt('Priority (Low, Medium, High):', 'Low');
    if (priority === null) return;
    const prio = priority.trim().charAt(0).toUpperCase() + priority.trim().slice(1).toLowerCase();
    if (!['Low', 'Medium', 'High'].includes(prio)) {
      alert('Invalid priority.');
      return;
    }
  
    const assignee = prompt('Assignee name:') || 'Unassigned';
  
    const newCard = {
      id: `card-${Date.now()}`,
      title: trimmedTitle,
      priority: prio,
      assignee: assignee.trim() || 'Unassigned',
    };
    column.cards.push(newCard);
    renderBoardContent();
  }
  
  // Card drag‑and‑drop
  let draggingCard = null;
  
  function onCardDragStart(e) {
    draggingCard = e.target;
    e.dataTransfer.setData('text/plain', draggingCard.dataset.id);
    setTimeout(() => draggingCard.classList.add('dragging'), 0);
  }
  function onCardDragEnd() {
    if (draggingCard) draggingCard.classList.remove('dragging');
    draggingCard = null;
  }
  function onCardDragOver(e) {
    e.preventDefault(); // allow drop
  }
  function onCardDrop(e) {
    e.preventDefault();
    const targetContainer = e.currentTarget;
    const destColumnId = targetContainer.dataset.columnId;
    if (!draggingCard) return;
  
    const srcColumnId = draggingCard.dataset.columnId;
    if (srcColumnId === destColumnId) {
      // same column – simple visual reorder
      targetContainer.appendChild(draggingCard);
      return;
    }
  
    const srcCol = board.columns.find(c => c.id === srcColumnId);
    const destCol = board.columns.find(c => c.id === destColumnId);
    if (!srcCol || !destCol) {
      alert('Cannot move card: source or destination column no longer exists.');
      return;
    }
    const cardId = draggingCard.dataset.id;
    const idx = srcCol.cards.findIndex(c => c.id === cardId);
    const [card] = srcCol.cards.splice(idx, 1);
    destCol.cards.push(card);
  
    renderBoardContent();
  }
  
  // Delete card
  function onDeleteCard(event) {
    const cardDiv = event.target.closest('.card');
    const columnId = cardDiv.dataset.columnId;
    const cardId = cardDiv.dataset.id;
  
    const column = board.columns.find(c => c.id === columnId);
    column.cards = column.cards.filter(c => c.id !== cardId);
    renderBoardContent();
  }
  
  // --------------------
  // Initialisation
  // --------------------
  function initApp() {
    const app = document.getElementById('app');
    // Header (filters + search) – rendered once and kept alive
    app.appendChild(renderHeader());
    // Board area – will be refreshed on each interaction
    renderBoardContent();
  }
  
  // Kick‑off
  initApp();