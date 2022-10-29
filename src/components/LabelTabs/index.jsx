import React, {useState} from "react";
import ListTab from "components/LabelTabs/components/ListTab";
import AnimateComponent from "components/UI/AnimateComponent";
import {ShowProjects} from "components/ShowProjects";
import {ShowTasks} from "components/ShowTasks";
import LoadingWrapper from "components/UI/LoadingWrapper";
import {useLabelProjectsQuery, useLabelTasksQuery} from "hooks/useDetailsData";
import "./labelTabs.scss";

const LabelTabs = ({selectedLabelId}) => {
    const {data: labelTasks} = useLabelTasksQuery(selectedLabelId);
    const {data: labelProjects} = useLabelProjectsQuery(selectedLabelId);

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
                        <AnimateComponent>
                            <ListTab isEmpty={labelTasks?.length === 0} emptyListWarning="There is no any task">
                                <LoadingWrapper
                                    type="dots"
                                    show={!!labelTasks}
                                    style={{width: "100%", height: "100%"}}
                                    size="sm"
                                >
                                    {!!labelTasks && (
                                        <ShowTasks
                                            onSortEnd={null}
                                            tasks={labelTasks}
                                            axis="xy"
                                            sortable={false}
                                            showParents
                                            secondaryColor
                                        />
                                    )}
                                </LoadingWrapper>
                            </ListTab>
                        </AnimateComponent>
                    )}

                    {tabState === "projects" && (
                        <AnimateComponent>
                            <ListTab isEmpty={labelProjects?.length === 0} emptyListWarning="There is no any project">
                                <LoadingWrapper
                                    type="dots"
                                    show={!!labelTasks}
                                    style={{width: "100%", height: "100%"}}
                                    size="sm"
                                >
                                    {!!labelProjects && (
                                        <ShowProjects
                                            onSortEnd={null}
                                            projects={labelProjects}
                                            axis="xy"
                                            sortable={false}
                                            secondaryColor
                                        />
                                    )}
                                </LoadingWrapper>
                            </ListTab>
                        </AnimateComponent>
                    )}
                </div>
            </div>

        </div>
    );
}

export default LabelTabs;