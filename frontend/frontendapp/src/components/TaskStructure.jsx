import { MdDelete } from "react-icons/md";
import { TiPencil } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
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
}) => {
  const curtime = new Date();
  const taskdate = new Date(isexpired);
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
      <h3 style={{ marginLeft: "20px", marginTop: "9px" }}>
        {completed && (
          <p>
            Completed At:
            {completedat.slice(0, 19).replace("Z", " ")}
          </p>
        )}
        {taskdate < curtime && <p style={{ color: "red" }}>Expired</p>}
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
