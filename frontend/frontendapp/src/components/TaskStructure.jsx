import { MdDelete } from "react-icons/md";
import { TiPencil } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { IoAlarm } from "react-icons/io5";
export const TaskStructure = ({
  title,
  description,
  priority,
  completed,
  isexpired,
  completedat,
  deletefun,
  onChange,
  taskid,
  starthour,
  endhour,
}) => {
  const curtime = new Date();
  let taskdate = new Date(isexpired);
  taskdate.setDate(taskdate.getDate() + 1); // hwn 3m zed 1 day
  let copy;

  let color = "";
  if (completed) {
    color = "green";
  } else if (!completed) {
    if (curtime > taskdate) {
      color = "#fd5c63";
    } else {
      color = "silver";
    }
  }
  const expirestime = (curdate, taskdate) => {
    const diff = Math.floor((taskdate - curdate) / 1000);

    if (diff < 0) return "Expired";
    if (diff < 60) return `${diff} seconds`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days`;
    if (diff < 2419200) return `${Math.floor(diff / 604800)} weeks`;
    return `${Math.floor(diff / 2419200)} months`;
  };
  const divstyle = {
    width: "65%",
    height: "150px",
    backgroundColor: color,
    borderRadius: "30px",
    boxShadow: "5px 5px 2px black",
    marginTop: "30px",
    marginLeft: "30px",
    position: "relative",
  };
  const checkboxstyle = {
    width: "25px",
    height: "25px",
    position: "absolute",
    right: "15px",
    bottom: "20px",
  };
  const navigate = useNavigate();
  return (
    <div style={divstyle}>
      <button
        style={{
          position: "absolute",
          backgroundColor: "#008000",
          right: "100px",
          top: "0px",
        }}
        onClick={() => {
          localStorage.setItem("taskid", taskid);
          navigate("/dashboard/edittask");
        }}
      >
        <TiPencil />
      </button>
      <button
        style={{
          position: "absolute",
          backgroundColor: "red",
          right: "20px",
          top: "0px",
        }}
        onClick={deletefun}
      >
        <MdDelete />
      </button>
      <h3 style={{ marginLeft: "20px", marginTop: "22px" }}>Title:{title}</h3>
      <h3 style={{ marginLeft: "20px", marginTop: "9px" }}>
        Description:{description}
      </h3>
      <h3 style={{ marginLeft: "20px", marginTop: "9px" }}>
        Priority:{priority}
      </h3>
      <h3>
        <IoAlarm /> :{starthour}-{endhour}
      </h3>
      <h3 style={{ marginLeft: "20px", marginTop: "9px" }}>
        {completed && (
          <p>
            Completed At:
            {completedat.slice(0, 19).replace("T", " ")}
          </p>
        )}
        {taskdate < curtime && !completed ? (
          <p style={{ color: "red" }}>Expired</p>
        ) : (
          ""
        )}
        {taskdate > curtime && !completed ? (
          <p style={{ color: "red" }}>
            Expires In {expirestime(curtime, taskdate)} (
            {isexpired.slice(0, 10)})
          </p>
        ) : (
          ""
        )}
      </h3>
      <input
        type="checkbox"
        onChange={onChange}
        style={checkboxstyle}
        checked={completed}
      />
    </div>
  );
};
