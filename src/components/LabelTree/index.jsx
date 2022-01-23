import React from "react";
import "labelTree.scss";

const LabelTree = ({activeTab, labelProjects, labelTasks}) => {

    return (
        <div className="label-tree-container">
            {activeTab === "tasks" ? <h1>Tasks</h1> : <h1>Projects</h1>}
        </div>
    );
}

export default LabelTree;