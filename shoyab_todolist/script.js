const inputtdl = document.querySelector('.textarea');
const buttontdl = document.querySelector('.buttoninput');
const listtdl = document.querySelector('.todolist');
const categorySelector = document.getElementById('category');

// Load todos and sticky notes on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTodoLists();
  loadStickyNotes();
});

// Event Listeners
buttontdl.addEventListener('click', (e) => {
  e.preventDefault();
  addTodo();
});

listtdl.addEventListener('click', handleTodoClick);

// Add new todo
function addTodo() {
  if (inputtdl.value.trim() === '') return;

  const todo = {
    text: inputtdl.value,
    category: categorySelector.value,
    id: Date.now()
  };

  createTodoElement(todo);
  saveTodoList(todo);
  inputtdl.value = '';
}

// Create and show the todo element
function createTodoElement(todo) {
  const itemall = document.createElement('div');
  itemall.classList.add('itemall');
  itemall.setAttribute('data-id', todo.id);

  const item = document.createElement('p');
  item.classList.add('item');
  item.innerHTML = `<strong>${todo.category}</strong>: ${todo.text}`;
  itemall.appendChild(item);

  const checkbutton = document.createElement("button");
  checkbutton.innerHTML = '<i class="fa-solid fa-check"></i>';
  checkbutton.classList.add("check-button");
  itemall.appendChild(checkbutton);

  const trashbutton = document.createElement("button");
  trashbutton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  trashbutton.classList.add("trash-button");
  itemall.appendChild(trashbutton);

  listtdl.appendChild(itemall);
}

// Save todo to localStorage
function saveTodoList(todo) {
  const todos = getTodosFromStorage();
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Load todos from localStorage
function loadTodoLists() {
  const todos = getTodosFromStorage();
  todos.forEach(todo => createTodoElement(todo));
}

// Get todos from localStorage
function getTodosFromStorage() {
  return JSON.parse(localStorage.getItem('todos')) || [];
}

// Delete or check todo
function handleTodoClick(e) {
  const item = e.target;
  const todolist = item.closest('.itemall');

  if (!todolist) return;

  if (item.closest('.check-button')) {
    todolist.classList.toggle('checklist');
  }

  if (item.closest('.trash-button')) {
    const todoId = todolist.getAttribute('data-id');
    todolist.remove();
    removeTodoFromStorage(todoId);
  }
}

// Remove todo from localStorage
function removeTodoFromStorage(todoId) {
  let todos = getTodosFromStorage();
  todos = todos.filter(todo => todo.id != todoId);
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Mood-based theme changer
function setMood(mood) {
  document.body.className = ''; // remove existing classes
  document.body.classList.add(mood);
}

// ================= Sticky Notes =================

// Create a new sticky note with delete option
function createStickyNote() {
  const stickyContainer = document.getElementById('sticky-container');
  const note = document.createElement('div');
  note.className = 'sticky-note';
  note.style.top = '20px';
  note.style.left = '20px';

  const deleteBtn = document.createElement('span');
  deleteBtn.className = 'delete-note';
  deleteBtn.innerHTML = '❌';
  deleteBtn.title = 'Delete Note';
  deleteBtn.onclick = () => {
    note.remove();
    saveStickyNotes();
  };

  const textarea = document.createElement('textarea');
  textarea.placeholder = "Type here...";
  textarea.addEventListener('input', saveStickyNotes);

  note.appendChild(deleteBtn);
  note.appendChild(textarea);
  stickyContainer.appendChild(note);

  makeDraggable(note);
  saveStickyNotes();
}

// Load sticky notes from localStorage
function loadStickyNotes() {
  const stickyContainer = document.getElementById('sticky-container');
  const data = JSON.parse(localStorage.getItem('stickyNotes')) || [];

  data.forEach(noteData => {
    const note = document.createElement('div');
    note.className = 'sticky-note';
    note.style.top = noteData.top;
    note.style.left = noteData.left;

    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'delete-note';
    deleteBtn.innerHTML = '❌';
    deleteBtn.title = 'Delete Note';
    deleteBtn.onclick = () => {
      note.remove();
      saveStickyNotes();
    };

    const textarea = document.createElement('textarea');
    textarea.value = noteData.text;
    textarea.addEventListener('input', saveStickyNotes);

    note.appendChild(deleteBtn);
    note.appendChild(textarea);
    stickyContainer.appendChild(note);

    makeDraggable(note);
  });
}

// Save sticky notes to localStorage
function saveStickyNotes() {
  const notes = document.querySelectorAll('.sticky-note');
  const data = [];

  notes.forEach(note => {
    const textarea = note.querySelector('textarea');
    data.push({
      text: textarea.value,
      top: note.style.top,
      left: note.style.left
    });
  });

  localStorage.setItem('stickyNotes', JSON.stringify(data));
}

// Make sticky notes draggable
function makeDraggable(note) {
  let isDragging = false;
  let offsetX, offsetY;

  note.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - note.offsetLeft;
    offsetY = e.clientY - note.offsetTop;
    note.style.zIndex = 1000;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      note.style.left = (e.clientX - offsetX) + 'px';
      note.style.top = (e.clientY - offsetY) + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    saveStickyNotes();
  });
}
