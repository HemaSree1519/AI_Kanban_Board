// File: script.js
// Simple Kanban Board with drag‑and‑drop and column options

// Column definitions
const columns = [
    { id: 'todo', title: 'To Do', cards: ['Buy groceries', 'Write blog post'] },
    { id: 'inprogress', title: 'In Progress', cards: ['Develop feature X'] },
    { id: 'done', title: 'Done', cards: ['Set up repo'] },
  ];
  
  // Reference to the root element
  const app = document.getElementById('app');
  
  // Create board container
  const board = document.createElement('div');
  board.className = 'board';
  app.appendChild(board);
  
  // Helper to create a card element
  function createCard(text) {
    const li = document.createElement('li');
    li.className = 'card';
    li.draggable = true;
    li.textContent = text;
  
    // Drag events
    li.addEventListener('dragstart', e => {
      li.classList.add('dragging');
      e.dataTransfer.setData('text/plain', text);
    });
  
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
    });
  
    return li;
  }
  
  // Build each column
  columns.forEach(col => {
    const colDiv = document.createElement('div');
    colDiv.className = 'column';
    colDiv.dataset.id = col.id;
  
    // Header
    const header = document.createElement('h2');
    header.textContent = col.title;
    colDiv.appendChild(header);
  
    // Action buttons (Add Card, Rename Column)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'col-actions';
  
    const addBtn = document.createElement('button');
    addBtn.textContent = '+ Card';
    addBtn.title = 'Add a new card';
    addBtn.addEventListener('click', () => {
      const txt = prompt('Enter card text:');
      if (txt && txt.trim()) {
        list.appendChild(createCard(txt.trim()));
      }
    });
  
    const renameBtn = document.createElement('button');
    renameBtn.textContent = 'Rename';
    renameBtn.title = 'Rename this column';
    renameBtn.addEventListener('click', () => {
      const newTitle = prompt('New column title:', header.textContent);
      if (newTitle && newTitle.trim()) {
        header.textContent = newTitle.trim();
      }
    });
  
    actionsDiv.appendChild(addBtn);
    actionsDiv.appendChild(renameBtn);
    colDiv.appendChild(actionsDiv);
  
    // Card list (ul)
    const list = document.createElement('ul');
    list.dataset.column = col.id;
  
    // Drop zone events
    list.addEventListener('dragover', e => {
      e.preventDefault(); // Allow drop
      list.classList.add('drag-over');
    });
  
    list.addEventListener('dragleave', () => {
      list.classList.remove('drag-over');
    });
  
    list.addEventListener('drop', e => {
      e.preventDefault();
      list.classList.remove('drag-over');
  
      const dragged = document.querySelector('.card.dragging');
      if (dragged) {
        // Move existing card
        dragged.classList.remove('dragging');
        list.appendChild(dragged);
      } else {
        // Fallback: use transferred text
        const text = e.dataTransfer.getData('text/plain');
        if (text) {
          list.appendChild(createCard(text));
        }
      }
    });
  
    // Populate initial cards
    col.cards.forEach(cardText => {
      list.appendChild(createCard(cardText));
    });
  
    colDiv.appendChild(list);
    board.appendChild(colDiv);
  });