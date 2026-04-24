import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const ViewProject = () => {
  const [project, setProject] = useState({});
  const [taskinfo, setTaskInfo] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: null,
    assignedto: "",
    projectid: "",
    taskType: "project",
  });
  const { projectid } = useParams();
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/projects/assigntask", {
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
      alert("task assigned");
    } catch (error) {
      alert(error.message);
    }
  };
  const fetchmembers = async () => {
    const projectinfo = await fetch(
      `http://localhost:3000/api/projects/projectinfo/${projectid}`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    let project = await projectinfo.json();
    project.members.shift();
    setProject(project);
    setTaskInfo((prev) => {
      return { ...prev, projectid: project.projectId };
    });
  };
  useEffect(() => {
    fetchmembers();
  }, []);
  const membersdiv = {};
  const memberdiv = {};
  const projectinfodiv = {};
  return (
    <>
      {project.projectName && (
        <div style={projectinfodiv}>
          Project Name :{project.projectName}
          Project Description :{project.projectDescription}
          project Members :{project.members.length}
        </div>
      )}
      {project.members && project.members.length == 0 && (
        <h1>No Members FOund</h1>
      )}
      {project.members && project.members.length != 0 && (
        <div style={membersdiv}>
          {project.members.map((member) => {
            return (
              <div style={memberdiv} key={member.userId}>
                username:{member.username} status:
                {member.isActive ? "Active" : " Offline "}
                total tasks:{member.totalTasks}
                To Do {member.todo}
                inProgress {member.inprogress}
                Done {member.done}
              </div>
            );
          })}
        </div>
      )}
      <form onSubmit={handlesubmit}>
        Assign A Task Task Title{" "}
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
          placeholder="Enter task title"
        />
        Task Date{" "}
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
          placeholder="Write task description..."
        />
        Assign To
        <select
          value={taskinfo.assignedto}
          onChange={(e) =>
            setTaskInfo((prev) => {
              return { ...prev, assignedto: e.target.value };
            })
          }
          required
        >
          <br />
          <option value="" disabled>
            Select A Member
          </option>
          {project.members &&
            project.members.length != 0 &&
            project.members.map((member) => {
              return (
                <option key={member.userId} value={member.userId}>
                  {member.username}
                </option>
              );
            })}
        </select>
        <button type="submit">Assign Task</button>
      </form>
    </>
  );
};
