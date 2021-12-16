import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {updateTask} from "store/actions/ApiCalls.actions";
import {toast} from "react-toastify";
import {setData} from "store/actions/Main.actions";
import {useNavigate} from "react-router-dom";
import "./task.scss";

// const DragHandle = SortableHandle(() => {
//   return (
//     <div className="tasks-draggable-icon">
//       <span className="far fa-arrows"></span>
//     </div>
//   );
// });

const Task = ({task}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isTaskChecked, setIsTaskChecked] = useState(false);

    const toastifyOptions = {
        autoClose: 2000, closeOnClick: true, position: "top-center", pauseOnHover: false, hideProgressBar: true,
    };

    const priorityList = [{id: 1, color: "#dc3545"}, {id: 2, color: "#198754"}, {id: 3, color: "#0d6efd"}, {
        id: 4,
        color: "#fd7e14"
    },];

    const onCheckBoxChanged = async (e) => {
        setIsTaskChecked(true);

        try {
            await dispatch(updateTask(task.id, {completed: true}));

            dispatch(setData({
                modify: {
                    type: 'task',
                    part: 'projects',
                    id: task.id,
                    key: 'id',
                    data: {completed: true},
                    nestedProperties: ['projects', 'sections', 'tasks']
                }
            }));

            toast.success("Task Updated", toastifyOptions);
        } catch (error) {
            setIsTaskChecked(false);
            toast.error("Update Task Failed", toastifyOptions);
        }
    };

    const [isMouseDown, setIsMouseDown] = useState(false);

    return (<div className="task">
        <div className="task-input" style={{backgroundColor: task.color}}>
            {/* <DragHandle /> */}
            <input
                type="checkbox"
                id={`task-radio-btn-${task.id}`}
                onChange={onCheckBoxChanged}
                disabled={isTaskChecked}
                hidden
            />
            <label
                className={[
                    "task-input-checkbox-label",
                    isTaskChecked ? "task-input-checkbox-label-active" : null,
                    isMouseDown ? "task-input-checkbox-label-mouse-down" : null
                ].join(' ')}
                htmlFor={`task-radio-btn-${task.id}`}
                onMouseDown={() => setIsMouseDown(true)}
                onMouseUp={() => setIsMouseDown(false)}
                onMouseLeave={() => setIsMouseDown(false)}
            >
                <span className="far fa-check"></span>
            </label>
            <span className="task-input-title">{task.title}</span>
        </div>
        <div className="task-info">
            <div className="task-info-comments">
                <span className="far fa-comment"></span>
                <span className="comments-count">5</span>
            </div>
            <div className="task-info-sub-tasks" onClick={() => navigate(`subtasks/${task.id}`, {state: task})}>
                <span className="far fa-code-merge"></span>
                <span className="sub-tasks-count">2</span>
            </div>
            <button className="task-info-modify" onClick={() => navigate(`modify/${task.id}`, {state: task})}>
                 <span
                     className="far fa-pen"
                 ></span>
            </button>
            <div className="task-info-priority">
              <span
                  className="fa fa-flag"
                  style={{
                      color: task.priority ? priorityList[task.priority].color : "black",
                  }}
              ></span>
            </div>
        </div>
    </div>);
};

export default Task;
