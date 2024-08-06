import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BsCircleFill,
  BsFillTrashFill,
  BsFillCheckCircleFill,
} from "react-icons/bs";
import { VscEdit } from "react-icons/vsc";
import BeatLoader from "react-spinners/BeatLoader";

function Home() {
  // const [todos, setTodos] = useState([]);
  // const [task, setTask] = useState('');
  // const [isUpdating, setIsUpdating] = useState(false);
  // const [currentTaskId, setCurrentTaskId] = useState(null);
  // const [loggedInUser, setLoggedInUser] = useState('');
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  const authHeader = useMemo(
    () => ({
      Authorization: localStorage.getItem("jwtToken"),
    }),
    []
  );

  const fetchTodos = useCallback(() => {
    setLoading(true);
    fetch(
      `${process.env.REACT_APP_BASE_URL}/tasks?page=${currentPage}&limit=6`,
      { headers: authHeader }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setTodos(result.data);
          setTotalPages(result.totalPages);
        } else {
          toast.error(result.message);
        }
      })
      .catch((err) => toast.error("Failed to fetch tasks"))
      .finally(() => setLoading(false));
  }, [currentPage, authHeader]);

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
    fetchTodos();
  }, [currentPage, authHeader, fetchTodos]);

  const handleDelete = (id) => {
    fetch(`${process.env.REACT_APP_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: authHeader,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
          toast.success("Delete Successfully");
          fetchTodos();
          if (todos.length === 1) {
            if (currentPage > 1) {
              setCurrentPage((prevPage) => prevPage - 1);
            } else {
              fetchTodos();
            }
          }
        } else {
          toast.error(result.message);
        }
      })
      .catch((err) => toast.error("Failed to delete task"));
  };

  const handleSuccess = (id) => {
    const taskToUpdate = todos.find((todo) => todo._id === id);
    if (!taskToUpdate) {
      toast.error("Task not found");
      return;
    }
    const newStatus =
      taskToUpdate.status === "pending" ? "completed" : "pending";
    fetch(`${process.env.REACT_APP_BASE_URL}/updatesuccess/${id}`, {
      method: "PUT",
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo._id === id ? { ...todo, status: newStatus } : todo
            )
          );
          toast.success(result.data.status);
        } else {
          toast.error(result.message);
        }
      })
      .catch((err) => toast.error("Failed to update task"));
  };

  const handleAdd = () => {
    fetch(`${process.env.REACT_APP_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: task }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          fetchTodos();
          setTask("");
          toast.success("Add Successfully");
        } else {
          toast.error(result.message);
        }
      })
      .catch((err) => toast.error("Failed to add task"));
  };

  const handleEdit = (id) => {
    setIsUpdating(true);
    setCurrentTaskId(id);
    const taskToUpdate = todos.find((todo) => todo._id === id);
    if (taskToUpdate) {
      setTask(taskToUpdate.description);
    }
  };

  const handleUpdate = () => {
    fetch(`${process.env.REACT_APP_BASE_URL}/tasks/${currentTaskId}`, {
      method: "PUT",
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: task }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo._id === currentTaskId ? { ...todo, description: task } : todo
            )
          );
          setTask("");
          setIsUpdating(false);
          setCurrentTaskId(null);
          toast.success("Update Successfully");
        } else {
          toast.error(result.message);
        }
      })
      .catch((err) => toast.error("Failed to update task"));
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("loggedInUser");
    toast.success("User LoggedOut");
    navigate("/login");
  };

  // Pagination Handlers
  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="nav">
        <h1>{loggedInUser}</h1>
        <button onClick={handleLogout}>LogOut</button>
      </div>
      <div className="home">
        <h2 className="todoName">Tasks List</h2>
        <div className="create_form">
          <input
            type="text"
            placeholder="Enter Task....."
            onChange={(e) => setTask(e.target.value)}
            value={task}
          />
          <button type="button" onClick={isUpdating ? handleUpdate : handleAdd}>
            {isUpdating ? "Update" : "Add"}
          </button>
        </div>
        {loading ? (
          <BeatLoader className="spiner"></BeatLoader>
        ) : todos.length === 0 ? (
          <div>
            <h2 className="no_record">No Records .....</h2>
          </div>
        ) : (
          todos.map((todo) => (
            <div key={todo._id} className="task">
              <div className="checkBox" onClick={() => handleSuccess(todo._id)}>
                {todo.status === "completed" ? (
                  <BsFillCheckCircleFill className="icon" />
                ) : (
                  <BsCircleFill className="icon" />
                )}
                <p className="des">{todo.description}</p>
                <p>{todo.status}</p>
              </div>
              <div>
                <span>
                  <VscEdit
                    className="icon"
                    onClick={() => handleEdit(todo._id)}
                  />
                </span>
              </div>
              <div>
                <span>
                  <BsFillTrashFill
                    className="icon"
                    onClick={() => handleDelete(todo._id)}
                  />
                </span>
              </div>
            </div>
          ))
        )}
        <div className="pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
}

export default Home;
