import React, { useState } from "react";
import { useArchivedProjects } from "hooks/useProjectsData";
import { useArchivedSections } from "hooks/useSectionsData";
import { useCompletedTasksQuery } from "hooks/useTasksData";
import ArchiveItem from "components/ArchiveItem";
import AnimateComponent from "components/UI/AnimateComponent";
import SkeletonLoader from "components/UI/SkeletonLoader";
import LoadingWrapper from "components/UI/LoadingWrapper";
import CompletedTasksSection from "components/CompletedTasksSection";
import EmptySign from "components/UI/EmptySign";
import "./archivePage.scss";

const ArchivePage = () => {
    const { data: archivedProjects } = useArchivedProjects();
    const { data: archivedSections } = useArchivedSections();
    const { data: completedTasks } = useCompletedTasksQuery();
    const [tabState, setTabState] = useState("projects");

    const renderCompletedTasks = () => {
        const groupedTasks = {};

        completedTasks.forEach((task) => {
            const taskDate = new Date(task.created).toDateString();
            if (groupedTasks.hasOwnProperty(taskDate)) {
                groupedTasks[taskDate] = [...groupedTasks[taskDate], task];
            } else {
                groupedTasks[taskDate] = [task];
            }
        });

        return completedTasks.length !== 0 ? (
            <div className="completed-tasks-sections">
                {Object.keys(groupedTasks).map((groupName, index) => {
                    return (
                        <CompletedTasksSection
                            key={index}
                            tasks={groupedTasks[groupName]}
                            dateTitle={groupName}
                        />
                    );
                })}
            </div>
        ) : (
            <EmptySign text="There are no any completed task" />
        );
    };

    return (
        <div className="archive-page-container">
            <div className="archive-tab-bar">
                <button
                    className={[
                        "archive-tab-bar-item",
                        tabState === "projects" ? "archive-tab-bar-item-active" : null,
                    ].join(" ")}
                    onClick={() => setTabState("projects")}
                >
                    Projects
                </button>

                <button
                    className={[
                        "archive-tab-bar-item",
                        tabState === "sections" ? "archive-tab-bar-item-active" : null,
                    ].join(" ")}
                    onClick={() => setTabState("sections")}
                >
                    Sections
                </button>

                <button
                    className={[
                        "archive-tab-bar-item",
                        tabState === "completed" ? "archive-tab-bar-item-active" : null,
                    ].join(" ")}
                    onClick={() => setTabState("completed")}
                >
                    Completed
                </button>
            </div>
            <div className="archive-list-container">
                {tabState === "projects" && (
                    <LoadingWrapper
                        show={!!archivedProjects}
                        customLoadingComponent={
                            <SkeletonLoader
                                type={"archive"}
                                width={1100}
                                height={300}
                                viewBox="0 0 1100 300"
                                style={{ marginTop: "16px", marginLeft: "16px" }}
                            />
                        }
                    >
                        <AnimateComponent>
                            {archivedProjects &&
                                (archivedProjects.length !== 0 ? (
                                    <div className="archive-list">
                                        {archivedProjects.map((prj) => {
                                            return (
                                                <ArchiveItem
                                                    type="project"
                                                    data={prj}
                                                    key={prj.id}
                                                />
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <EmptySign text="Yoy doesn't have any archived project" />
                                ))}
                        </AnimateComponent>
                    </LoadingWrapper>
                )}

                {tabState === "sections" && (
                    <LoadingWrapper
                        show={!!archivedSections}
                        customLoadingComponent={
                            <SkeletonLoader
                                type={"archive"}
                                width={1100}
                                height={300}
                                viewBox="0 0 1100 300"
                                style={{ marginTop: "16px", marginLeft: "16px" }}
                            />
                        }
                    >
                        <AnimateComponent>
                            {archivedSections &&
                                (archivedSections.length !== 0 ? (
                                    <div className="archive-list">
                                        {archivedSections.map((sec) => {
                                            return (
                                                <ArchiveItem
                                                    type="section"
                                                    data={sec}
                                                    key={sec.id}
                                                />
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <EmptySign text="Yoy doesn't have any archived section" />
                                ))}
                        </AnimateComponent>
                    </LoadingWrapper>
                )}

                {tabState === "completed" && (
                    <LoadingWrapper
                        show={!!archivedSections}
                        customLoadingComponent={
                            <SkeletonLoader
                                type={"activities"}
                                width={500}
                                height={650}
                                viewBox="0 0 500 650"
                            />
                        }
                    >
                        <AnimateComponent>
                            {completedTasks && renderCompletedTasks()}
                        </AnimateComponent>
                    </LoadingWrapper>
                )}
            </div>
        </div>
    );
};

export default ArchivePage;
