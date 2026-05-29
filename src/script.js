// File: script.js
// Simple Kanban Board with drag‑and‑drop and column options

// Column definitions – cards now carry title, priority and assignee
const columns = [
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        { title: 'Buy groceries', priority: 'Low', assignee: 'Alice' },
        { title: 'Write blog post', priority: 'Medium', assignee: 'Bob' },
      ],
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      cards: [{ title: 'Develop feature X', priority: 'High', assignee: 'Carol' }],
    },
    {
      id: 'done',
      title: 'Done',
      cards: [{ title: 'Set up repo', priority: 'Low', assignee: 'Dave' }],
    },
  ];
  
  // Reference to the root element
  const app = document.getElementById('app');
  
  // Create board container
  const board = document.createElement('div');
  board.className = 'board';
  app.appendChild(board);
  
  // Helper to create a card element from a card object
  function createCard(card) {
    // Normalise input – if a plain string is passed, treat it as a title
    if (typeof card === 'string') {
      card = { title: card, priority: 'Low', assignee: '' };
    }
  
    const li = document.createElement('li');
    li.className = 'card';
    li.draggable = true;
  
    // Title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    titleDiv.textContent = card.title;
    li.appendChild(titleDiv);
  
    // Details line (priority badge + assignee)
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'details';
  
    const prioritySpan = document.createElement('span');
    prioritySpan.className = `priority ${card.priority.toLowerCase()}`;
    prioritySpan.textContent = card.priority;
    detailsDiv.appendChild(prioritySpan);
  
    const assigneeSpan = document.createElement('span');
    assigneeSpan.textContent = card.assignee
      ? `Assignee: ${card.assignee}`
      : 'Unassigned';
    detailsDiv.appendChild(assigneeSpan);
  
    li.appendChild(detailsDiv);
  
    // Drag events
    li.addEventListener('dragstart', (e) => {
      li.classList.add('dragging');
      // Store a reference to the element being dragged
      e.dataTransfer.setData('text/plain', 'placeholder');
    });
  
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
    });
  
    return li;
  }
  
  // Refresh the count displayed in each column header
  function refreshCounts() {
    document.querySelectorAll('.column').forEach((colDiv) => {
      const header = colDiv.querySelector('h2');
      const list = colDiv.querySelector('ul');
      const title = header.dataset.title;
      header.textContent = `${title} (${list.children.length})`;
    });
  }
  
  // Prompt helpers for creating a new card
  function promptForCard() {
    const title = prompt('Enter card title:');
    if (!title) return null;
  
    let priority = prompt(
      'Enter priority (Low, Medium, High):',
      'Low'
    );
    if (!priority) priority = 'Low';
    priority = ['low', 'medium', 'high'].includes(priority.toLowerCase())
      ? priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
      : 'Low';
  
    const assignee = prompt('Enter assignee name (optional):') || '';
  
    return { title: title.trim(), priority, assignee: assignee.trim() };
  }
  
  // Build each column
  columns.forEach((col) => {
    const colDiv = document.createElement('div');
    colDiv.className = 'column';
    colDiv.dataset.id = col.id;
  
    // Header
    const header = document.createElement('h2');
    header.dataset.title = col.title; // store base title
    header.textContent = `${col.title} (0)`; // placeholder, will be updated later
    colDiv.appendChild(header);
  
    // Action buttons (Add Card, Rename Column)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'col-actions';
  
    const addBtn = document.createElement('button');
    addBtn.textContent = '+ Card';
    addBtn.title = 'Add a new card';
    addBtn.addEventListener('click', () => {
      const newCard = promptForCard();
      if (newCard) {
        list.appendChild(createCard(newCard));
        refreshCounts();
      }
    });
  
    const renameBtn = document.createElement('button');
    renameBtn.textContent = 'Rename';
    renameBtn.title = 'Rename this column';
    renameBtn.addEventListener('click', () => {
      const newTitle = prompt('New column title:', header.dataset.title);
      if (newTitle && newTitle.trim()) {
        header.dataset.title = newTitle.trim();
        refreshCounts();
      }
    });
  
    actionsDiv.appendChild(addBtn);
    actionsDiv.appendChild(renameBtn);
    colDiv.appendChild(actionsDiv);
  
    // Card list (ul)
    const list = document.createElement('ul');
    list.dataset.column = col.id;
  
    // Drop zone events
    list.addEventListener('dragover', (e) => {
      e.preventDefault(); // Allow drop
      list.classList.add('drag-over');
    });
  
    list.addEventListener('dragleave', () => {
      list.classList.remove('drag-over');
    });
  
    list.addEventListener('drop', (e) => {
      e.preventDefault();
      list.classList.remove('drag-over');
  
      const dragged = document.querySelector('.card.dragging');
      if (dragged) {
        // Move existing card
        dragged.classList.remove('dragging');
        list.appendChild(dragged);
      } else {
        // Fallback: create a simple card from transferred text
        const text = e.dataTransfer.getData('text/plain');
        if (text) {
          list.appendChild(createCard({ title: text, priority: 'Low', assignee: '' }));
        }
      }
      refreshCounts();
    });
  
    // Populate initial cards
    col.cards.forEach((cardObj) => {
      list.appendChild(createCard(cardObj));
    });
  
    colDiv.appendChild(list);
    board.appendChild(colDiv);
  });
  
  // Initial count display
  refreshCounts();