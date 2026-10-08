import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  replaceTask,
  deleteTask
} from "./api.js";


const taskList = document.querySelector("#taskList");

const statusMessage = document.querySelector("#statusMessage");

const taskForm = document.querySelector("#taskForm");

const taskTitle = document.querySelector("#taskTitle");

const taskStatus = document.querySelector("#taskStatus");

const titleError = document.querySelector("#titleError");

const submitBtn = document.querySelector("#submitBtn");

const searchInput = document.querySelector("#searchInput");

const filterButtons = document.querySelectorAll(".filter-btn");

const taskDetails = document.querySelector("#taskDetails");


const totalTasks = document.querySelector("#totalTasks");

const completedTasks = document.querySelector("#completedTasks");

const pendingTasks = document.querySelector("#pendingTasks");

const completionRate = document.querySelector("#completionRate");


let tasks = [];

let currentFilter = "all";

let searchTerm = "";


const showStatus = (message, type) => {

  statusMessage.textContent = message;

  statusMessage.className = `status-message ${type}`;
};


const hideStatus = () => {

  statusMessage.textContent = "";

  statusMessage.className = "status-message";
};


const loadTasks = async () => {

  showStatus("Loading tasks...", "loading");

  taskList.innerHTML = "";

  try {

    tasks = await getTasks();

    updateSummary();

    renderTasks();

  } catch (error) {

    showStatus(
      "We couldn't load your tasks. Please try again.",
      "error"
    );

    taskList.innerHTML = `
      <button id="retryBtn" class="primary-btn">
        Retry
      </button>
    `;

    document
      .querySelector("#retryBtn")
      .addEventListener("click", loadTasks);

    console.error(error);
  }
};


const updateSummary = () => {

  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const pending = tasks.filter(
    (task) => !task.completed
  ).length;

  const rate = total === 0
    ? 0
    : Math.round((completed / total) * 100);


  totalTasks.textContent = total;

  completedTasks.textContent = completed;

  pendingTasks.textContent = pending;

  completionRate.textContent = `${rate}%`;
};


const getFilteredTasks = () => {

  return tasks.filter((task) => {

    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "completed" && task.completed) ||
      (currentFilter === "pending" && !task.completed);


    const matchesSearch =
      task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());


    return matchesFilter && matchesSearch;
  });
};


const renderTasks = () => {

  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = "";

  hideStatus();
  
  if (filteredTasks.length === 0) {

    showStatus(
      "No tasks match your current search or filter.",
      "empty"
    );

    return;
  }



  filteredTasks.forEach((task) => {

    const card = document.createElement("article");

    card.className = "task-card";

    const status = task.completed
      ? "completed"
      : "pending";

    const statusText = task.completed
      ? "Completed"
      : "Pending";


    card.innerHTML = `
      <span class="task-status ${status}">
        ${statusText}
      </span>

      <h3>${task.title}</h3>

      <p>Task ID: ${task.id}</p>

      <div class="task-actions">

        <button
          class="view-btn"
          data-id="${task.id}"
        >
          View
        </button>

        <button
          class="toggle-btn"
          data-id="${task.id}"
        >
          ${task.completed ? "Mark Pending" : "Complete"}
        </button>

        <button
          class="delete-btn"
          data-id="${task.id}"
        >
          Delete
        </button>

      </div>
    `;

    taskList.appendChild(card);
  });
};


const viewTask = async (id) => {

  taskDetails.classList.remove("hidden");

  taskDetails.innerHTML = `
    <p>Loading task details...</p>
  `;


  try {

    const task = await getTask(id);

    taskDetails.innerHTML = `
      <h2>Task Details</h2>

      <p>
        <strong>ID:</strong> ${task.id}
      </p>

      <p>
        <strong>Title:</strong> ${task.title}
      </p>

      <p>
        <strong>Status:</strong>
        ${task.completed ? "Completed" : "Pending"}
      </p>

      <button
        id="closeDetails"
        class="primary-btn"
      >
        Close
      </button>
    `;


    document
      .querySelector("#closeDetails")
      .addEventListener("click", () => {

        taskDetails.classList.add("hidden");

      });

  } catch (error) {

    taskDetails.innerHTML = `
      <p>
        Unable to load this task.
      </p>
    `;

    console.error(error);
  }
};

const handleCreateTask = async (event) => {

  event.preventDefault();


  const title = taskTitle.value.trim();

  const completed =
    taskStatus.value === "completed";

  if (title === "") {

    titleError.textContent =
      "Please enter a task title.";

    taskTitle.focus();

    return;
  }


  if (title.length < 3) {

    titleError.textContent =
      "Task title must be at least 3 characters.";

    taskTitle.focus();

    return;
  }


  titleError.textContent = "";


  
  submitBtn.disabled = true;

  submitBtn.textContent = "Creating...";


  try {

    const newTask = await createTask({

      title,
      completed,
      userId: 1

    });


    tasks.unshift(newTask);


    taskForm.reset();

    updateSummary();

    renderTasks();

    showStatus(
      "Task created successfully!",
      "loading"
    );


  } catch (error) {

    showStatus(
      "We couldn't create the task. Please try again.",
      "error"
    );

    console.error(error);

  } finally {

    submitBtn.disabled = false;

    submitBtn.textContent = "Add Task";
  }
};

const toggleTask = async (id) => {

  const task = tasks.find(
    (task) => task.id === id
  );


  if (!task) {
    return;
  }


  try {

    const updatedTask = await updateTask(id, {

      completed: !task.completed

    });

    task.completed = updatedTask.completed;

    updateSummary();

    renderTasks();


  } catch (error) {

    showStatus(
      "Unable to update the task.",
      "error"
    );

    console.error(error);
  }
};


const removeTask = async (id) => {

  const confirmed = confirm(
    "Are you sure you want to delete this task?"
  );


  if (!confirmed) {
    return;
  }


  try {

    await deleteTask(id);


    tasks = tasks.filter(
      (task) => task.id !== id
    );


    updateSummary();

    renderTasks();


  } catch (error) {

    showStatus(
      "Unable to delete the task.",
      "error"
    );

    console.error(error);
  }
};

taskList.addEventListener("click", (event) => {

  const id = Number(
    event.target.dataset.id
  );


  if (event.target.classList.contains("view-btn")) {

    viewTask(id);
  }


  if (event.target.classList.contains("toggle-btn")) {

    toggleTask(id);
  }


  if (event.target.classList.contains("delete-btn")) {

    removeTask(id);
  }

});


searchInput.addEventListener("input", (event) => {

  searchTerm = event.target.value;

  renderTasks();

});


filterButtons.forEach((button) => {

  button.addEventListener("click", () => {

    filterButtons.forEach((btn) => {

      btn.classList.remove("active");

    });


    button.classList.add("active");


    currentFilter =
      button.dataset.filter;


    renderTasks();

  });

});

taskForm.addEventListener(
  "submit",
  handleCreateTask
);

document
  .querySelector("#newTaskBtn")
  .addEventListener("click", () => {

    document
      .querySelector("#create-task")
      .scrollIntoView({
        behavior: "smooth"
      });

    taskTitle.focus();

  });

loadTasks();