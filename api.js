const API_URL = "https://jsonplaceholder.typicode.com/todos";


// GET all tasks
export const getTasks = async () => {

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks.");
  }

  return await response.json();
};


// GET one task
export const getTask = async (id) => {

  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch task.");
  }

  return await response.json();
};


// POST new task
export const createTask = async (task) => {

  const response = await fetch(API_URL, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(task)

  });

  if (!response.ok) {
    throw new Error("Failed to create task.");
  }

  return await response.json();
};


// PATCH task
export const updateTask = async (id, updates) => {

  const response = await fetch(`${API_URL}/${id}`, {

    method: "PATCH",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(updates)

  });

  if (!response.ok) {
    throw new Error("Failed to update task.");
  }

  return await response.json();
};


// PUT task
export const replaceTask = async (id, task) => {

  const response = await fetch(`${API_URL}/${id}`, {

    method: "PUT",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(task)

  });

  if (!response.ok) {
    throw new Error("Failed to replace task.");
  }

  return await response.json();
};


// DELETE task
export const deleteTask = async (id) => {

  const response = await fetch(`${API_URL}/${id}`, {

    method: "DELETE"

  });

  if (!response.ok) {
    throw new Error("Failed to delete task.");
  }

  return true;
};