// File: script.js
// Kanban Board with full drag‑and‑drop, card deletion, and priority filtering

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
  
  // Global reference to the card being dragged
  let draggedCard = null;
  
  // Current priority filter ('All', 'Low', 'Medium', 'High')
  let currentFilter = 'All';
  
  // Root element
  const app = document.getElementById('app');
  
  // ---------------------------------------------------------------------
  // 1. Priority filter UI
  // ---------------------------------------------------------------------
  function createFilterBar() {
    const bar = document.createElement('div');
    bar.className = 'filter-bar';
  
    const label = document.createElement('label');
    label.textContent = 'Show priority:';
    label.htmlFor = 'priority-filter';
    bar.appendChild(label);
  
    const select = document.createElement('select');
    select.id = 'priority-filter';
    ['All', 'Low', 'Medium', 'High'].forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p;
      opt.textContent = p;
      select.appendChild(opt);
    });
    select.addEventListener('change', () => {
      currentFilter = select.value;
      applyFilter();
    });
  
    bar.appendChild(select);
    app.appendChild(bar);
  }
  
  // Apply the current filter to all cards
  function applyFilter() {
    document.querySelectorAll('.card').forEach((card) => {
      const cardPriority = card.dataset.priority; // lower‑cased
      if (currentFilter === 'All' || cardPriority === currentFilter.toLowerCase()) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }
  
  // ---------------------------------------------------------------------
  // Helper: create a card <li> element from a card object
  // ---------------------------------------------------------------------
  function createCard(card) {
    // Normalise plain‑string input
    if (typeof card === 'string') {
      card = { title: card, priority: 'Low', assignee: '' };
    }
  
    const li = document.createElement('li');
    li.className = 'card';
    li.draggable = true;
    // Store priority in a data attribute for easy filtering
    li.dataset.priority = card.priority.toLowerCase();
  
    // Title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    titleDiv.textContent = card.title;
    li.appendChild(titleDiv);
  
    // Details (priority badge + assignee)
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
  
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = 'Delete this card';
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent drag start
      li.remove();
      refreshCounts();
    });
    li.appendChild(deleteBtn);
  
    // Drag events -------------------------------------------------------
    li.addEventListener('dragstart', (e) => {
      draggedCard = li;
      li.classList.add('dragging');
      // Required for Firefox – set some data
      e.dataTransfer.setData('text/plain', li.textContent);
      e.dataTransfer.effectAllowed = 'move';
    });
  
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
      draggedCard = null;
    });
  
    return li;
  }
  
  // ---------------------------------------------------------------------
  // Update column header counts
  // ---------------------------------------------------------------------
  function refreshCounts() {
    document.querySelectorAll('.column').forEach((colDiv) => {
      const header = colDiv.querySelector('h2');
      const list = colDiv.querySelector('ul');
      const title = header.dataset.title;
      header.textContent = `${title} (${list.children.length})`;
    });
  }
  
  // ---------------------------------------------------------------------
  // Prompt helpers for new cards
  // ---------------------------------------------------------------------
  function promptForCard() {
    const title = prompt('Enter card title:');
    if (!title) return null;
  
    let priority = prompt('Enter priority (Low, Medium, High):', 'Low');
    if (!priority) priority = 'Low';
    priority = ['low', 'medium', 'high'].includes(priority.toLowerCase())
      ? priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
      : 'Low';
  
    const assignee = prompt('Enter assignee name (optional):') || '';
  
    return { title: title.trim(), priority, assignee: assignee.trim() };
  }
  
  // ---------------------------------------------------------------------
  // Build columns
  // ---------------------------------------------------------------------
  function buildBoard() {
    // Board container
    const board = document.createElement('div');
    board.className = 'board';
    app.appendChild(board);
  
    columns.forEach((col) => {
      // Column container
      const colDiv = document.createElement('div');
      colDiv.className = 'column';
      colDiv.dataset.id = col.id;
  
      // Header with data-title for easy count updates
      const header = document.createElement('h2');
      header.dataset.title = col.title;
      header.textContent = `${col.title} (0)`;
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
          applyFilter(); // respect current filter
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
  
      actionsDiv.append(addBtn, renameBtn);
      colDiv.appendChild(actionsDiv);
  
      // Card list (ul)
      const list = document.createElement('ul');
      list.dataset.column = col.id;
  
      // ---------------------- Drag‑and‑Drop for the list -----------------
      list.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow drop
        list.classList.add('drag-over');
  
        // Find the closest card below the pointer
        const afterElement = getDragAfterElement(list, e.clientY);
        const dragging = document.querySelector('.card.dragging');
  
        if (dragging) {
          if (afterElement == null) {
            list.appendChild(dragging);
          } else {
            list.insertBefore(dragging, afterElement);
          }
        }
      });
  
      list.addEventListener('dragleave', () => {
        list.classList.remove('drag-over');
      });
  
      list.addEventListener('drop', (e) => {
        e.preventDefault();
        list.classList.remove('drag-over');
  
        // If drop occurs on empty list (no card under cursor)
        if (draggedCard && draggedCard.parentElement !== list) {
          list.appendChild(draggedCard);
        }
  
        refreshCounts();
      });
  
      // Helper: find element after which the dragged card should be inserted
      function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
  
        return draggableElements.reduce(
          (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
              return { offset, element: child };
            } else {
              return closest;
            }
          },
          { offset: Number.NEGATIVE_INFINITY }
        ).element;
      }
  
      // Populate initial cards
      col.cards.forEach((cardObj) => {
        list.appendChild(createCard(cardObj));
      });
  
      colDiv.appendChild(list);
      board.appendChild(colDiv);
    });
  
    // Initial count display
    refreshCounts();
    // Apply default filter (All)
    applyFilter();
  }
  
  // ---------------------------------------------------------------------
  // Initialise app
  // ---------------------------------------------------------------------
  createFilterBar();
  buildBoard();