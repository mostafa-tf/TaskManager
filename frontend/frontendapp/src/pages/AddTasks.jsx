import { useState } from "react";
export const AddTasks = () => {
  const [taskinfo, setTaskInfo] = useState({
    title: "",
    priority: "",
    dueDate: null,
    description: "",
  });
  const [inserted, setInserted] = useState(false);
  const [error, setError] = useState("");
  const handlesubmit = async (e) => {
    setError("");
    setInserted(false);
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(taskinfo),
      });
      const data = await res.json();

      if (res.status != 201) {
        throw new Error(data.message);
      }
      setInserted(true);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "green",
        }}
      >
        <div
          style={{
            width: "350px",
            height: "400px",
            backgroundColor: "gold",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <h2 style={{ borderBottom: "1px solid green" }}>Add Your Task</h2>
          <form onSubmit={handlesubmit}>
            Task Title{" "}
            <input
              type="text"
              value={taskinfo.title}
              onChange={(e) =>
                setTaskInfo((prev) => {
                  return { ...prev, title: e.target.value };
                })
              }
              required
              minLength={2}
              maxLength={15}
            />
            <br />
            Task Priority{" "}
            <select
              value={taskinfo.priority}
              onChange={(e) =>
                setTaskInfo((prev) => {
                  return { ...prev, priority: e.target.value };
                })
              }
            >
              <option value="">Select Priority</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <br />
            DueDate{" "}
            <input
              type="date"
              value={taskinfo.dueDate}
              onChange={(e) =>
                setTaskInfo((prev) => {
                  return { ...prev, dueDate: e.target.value };
                })
              }
              required
            />
            <br />
            Description{" "}
            <textarea
              value={taskinfo.description}
              rows={5}
              cols={25}
              onChange={(e) =>
                setTaskInfo((prev) => {
                  return { ...prev, description: e.target.value };
                })
              }
            />
            <br />
            <button
              type="submit"
              style={{ marginLeft: "130px", width: "100px", height: "80px" }}
            >
              Save task
            </button>
            {error && <p color="red">error</p>}
            {inserted && (
              <h2 style={{ color: "green" }}>Inserted To The Database</h2>
            )}
          </form>
        </div>
      </div>
    </>
  );
};
