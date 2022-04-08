import { Task } from "components/Task";
import "./completedTasksSection.scss";

const CompletedTasksSection = ({ tasks, dateTitle }) => {
    return (
        <div className="completed-tasks-section">
            <div className="completed-tasks-section-title">
                <span />
                <h1>{dateTitle}</h1>
            </div>
            <div className="completed-tasks-section-tasks">
                {tasks.map((task) => (
                    <Task task={task} key={task.id} dragHandlerIcon={false} showParents />
                ))}
            </div>
        </div>
    );
};

export default CompletedTasksSection;
