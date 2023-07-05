import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState('');
  const [editTaskName, setEditTaskName] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3010/tasks');
      setTasks(response.data);
    } catch (error) {
      console.log('Error fetching tasks:', error);
    }
  };

  const createTask = async () => {
    if (newTask.trim() === '') {
      return;
    }

    try {
      await axios.post('http://localhost:3010/tasks', { taskName: newTask });
      fetchTasks();
      setNewTask('');
      toast.success('Task created successfully');
    } catch (error) {
      console.log('Error creating task:', error);
    }
  };

  const editTask = async () => {
    if (editTaskName.trim() === '') {
      return;
    }

    try {
      await axios.put(`http://localhost:3010/tasks/${editTaskId}`, { taskName: editTaskName });
      fetchTasks();
      setEditTaskId('');
      setEditTaskName('');
      toast.success('Task edited successfully');
    } catch (error) {
      console.log('Error editing task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3010/tasks/${taskId}`);
      fetchTasks();
      toast.success('Task deleted successfully');
    } catch (error) {
      console.log('Error deleting task:', error);
    }
  };

  const handleEditClick = (task) => {
    setEditTaskId(task.id);
    setEditTaskName(task.task_name);
  };

  const handleCancelEdit = () => {
    setEditTaskId('');
    setEditTaskName('');
  };

  return (
    <div className="app-container">
    <h1>To-Do App</h1>
    <div className="add-task-container">
      <input
        type="text"
        placeholder="Enter task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button className="add-task-button" onClick={createTask}>
        Add Task
      </button>
    </div>
    {tasks.length > 0 ? (
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            {editTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editTaskName}
                  onChange={(e) => setEditTaskName(e.target.value)}
                />
                <div>
                  <button className="edit-task-button" onClick={editTask}>
                    Save
                  </button>
                  <button
                    className="edit-task-button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>{task.task_name}</span>
                <div>
                  <button
                    className="edit-task-button"
                    onClick={() => handleEditClick(task)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="edit-task-button"
                    onClick={() => deleteTask(task.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p>No tasks available</p>
    )}
  <ToastContainer/>
  </div>
);
}

export default App;
