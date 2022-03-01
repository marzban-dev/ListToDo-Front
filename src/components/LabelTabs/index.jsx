import React, {useState} from "react";
import ListTab from "components/LabelTabs/components/ListTab";
import {useQueryClient} from "react-query";
import AnimatedPage from "components/UI/AnimatedPage";
import {ShowProjects} from "components/ShowProjects";
import {ShowTasks} from "components/ShowTasks";
import "./labelTabs.scss";

const LabelTabs = ({selectedLabelId}) => {
    const queryClient = useQueryClient();
    const labelTasks = queryClient.getQueryData(['label-tasks', selectedLabelId])
    const labelProjects = queryClient.getQueryData(['label-projects', selectedLabelId])

    const [tabState, setTabState] = useState("tasks");

    return (
        <div className="label-tabs-container">
            <div className="label-tabs-wrapper">
                <div className="label-tab-bar">
                    <div
                        className={[
                            "label-tab-bar-item",
                            tabState === "tasks" ? "label-tab-bar-item-active" : null
                        ].join(" ")}
                        onClick={() => setTabState("tasks")}
                    >
                        Tasks
                    </div>

                    <div
                        className={[
                            "label-tab-bar-item",
                            tabState === "projects" ? "label-tab-bar-item-active" : null
                        ].join(" ")}
                        onClick={() => setTabState("projects")}
                    >
                        Projects
                    </div>
                </div>

                <div className="label-tab-content">
                    {tabState === "tasks" && (
                        <AnimatedPage>
                            <ListTab isEmpty={labelTasks?.length === 0} emptyListWarning="There is no any task">
                                {!!labelTasks && (
                                    <ShowTasks
                                        onSortEnd={null}
                                        tasks={labelTasks}
                                        axis="xy"
                                        sortable={false}
                                    />
                                )}
                            </ListTab>
                        </AnimatedPage>
                    )}

                    {tabState === "projects" && (
                        <AnimatedPage>
                            <ListTab isEmpty={labelProjects?.length === 0} emptyListWarning="There is no any project">
                                {!!labelProjects && (
                                    <ShowProjects
                                        onSortEnd={null}
                                        projects={labelProjects}
                                        axis="xy"
                                        sortable={false}
                                    />
                                )}
                            </ListTab>
                        </AnimatedPage>
                    )}
                </div>
            </div>

        </div>
    );
}

export default LabelTabs;