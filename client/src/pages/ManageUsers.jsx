import { useEffect, useState } from "react";
import axios from "axios";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}/role`,
        { role },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Role updated");
      fetchUsers(); // refresh
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("User deleted");
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Manage Users</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="card p-3 mb-3 shadow-sm">
            <h5>{user.name}</h5>
            <p>{user.email}</p>
            <p>
              <strong>Role:</strong>{" "}
              <span
                className={`badge ${
                  user.role === "admin"
                    ? "bg-danger"
                    : user.role === "agent"
                      ? "bg-warning text-dark"
                      : "bg-secondary"
                }`}
              >
                {user.role}
              </span>
            </p>

            <div className="mt-2">
              <button
                className="btn btn-sm btn-warning me-2"
                disabled={user.role === "agent" || user.role === "admin"}
                onClick={() => updateRole(user._id, "agent")}
              >
                Make Agent
              </button>

              <button
                className="btn btn-sm btn-danger"
                disabled={user.role === "admin"}
                onClick={() => updateRole(user._id, "admin")}
              >
                Make Admin
              </button>
            </div>
            <button
              className="btn btn-sm btn-outline-danger mt-2"
              onClick={() => deleteUser(user._id)}
            >
              Delete User
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ManageUsers;
