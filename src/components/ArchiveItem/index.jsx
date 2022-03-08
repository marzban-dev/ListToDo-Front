import React from "react";
import "./archiveItem.scss";
import {useUpdateSectionQuery} from "hooks/useSectionsData";
import catchAsync from "utils/CatchAsync";
import {useUpdateProjectQuery} from "hooks/useProjectsData";

const ArchiveItem = ({type, data}) => {
    const {mutateAsync: updateSection} = useUpdateSectionQuery(data.id, data.project.id);
    const {mutateAsync: updateProject} = useUpdateProjectQuery(data?.project?.project);

    const unArchiveSection = catchAsync(async () => {
        await updateSection({id: data.id, data: {archive: false}});
    }, {
        onLoad: `Un archiving section ${data.title}`,
        onSuccess: `Section ${data.title} un archived`,
        onError: `Un archive section ${data.title} failed`
    });

    const unArchiveProject = catchAsync(async () => {
        await updateProject({
            data: {archive: false},
            personalizeData: {
                label: data.label,
                color: data.color,
            },
            projectData: data.project
        });
    }, {
        onLoad: `Un archiving project ${data.project.title}`,
        onSuccess: `Project ${data.project.title} un archived`,
        onError: `Un archive project ${data.project.title} failed`
    });

    return (
        <div className="archive-item">
            <div className="archive-item-info">
                <div className="archive-item-info-left">
                    <span className={["far", type === "project" ? "fa-briefcase" : "fa-tasks"].join(' ')}></span>
                    <h4>{type === "project" ? data.project.title : data.title}</h4>
                </div>
                <button
                    className="archive-item-remove-btn"
                    onClick={type === "project" ? unArchiveProject : unArchiveSection}
                >
                    <span className="fa fa-folder-times"></span>
                </button>
            </div>
            <div className="archive-item-date">
                <span className="archive-item-data-date">
                  {new Date(data.created).toLocaleDateString()} {new Date(data.created).toLocaleTimeString()}
                </span>
            </div>
        </div>
    )
}

export default ArchiveItem;