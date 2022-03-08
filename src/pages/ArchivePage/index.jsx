import React, {useState} from 'react';
import {useArchivedProjects} from "hooks/useProjectsData";
import {useArchivedSections} from "hooks/useSectionsData";
import PageContainer from "components/UI/PageContainer";
import ArchiveItem from "components/ArchiveItem";
import AnimateComponent from "components/UI/AnimateComponent";
import SkeletonLoader from "components/UI/SkeletonLoader";
import LoadingWrapper from "components/UI/LoadingWrapper";
import EmptySign from "components/UI/EmptySign";
import "./archivePage.scss";

const ArchivePage = () => {
    const {data: archivedProjects} = useArchivedProjects();
    const {data: archivedSections} = useArchivedSections();
    const [tabState, setTabState] = useState('projects');

    return (
        <PageContainer>
            <div className="archive-page-container">
                <div className="archive-tab-bar">
                    <button
                        className={[
                            "archive-tab-bar-item",
                            tabState === "projects" ? "archive-tab-bar-item-active" : null
                        ].join(" ")}
                        onClick={() => setTabState('projects')}
                    >
                        Projects
                    </button>

                    <button
                        className={[
                            "archive-tab-bar-item",
                            tabState === "sections" ? "archive-tab-bar-item-active" : null
                        ].join(" ")}
                        onClick={() => setTabState('sections')}
                    >
                        Sections
                    </button>
                </div>
                <div className="archive-list-container">
                    {tabState === "projects" && (
                        <LoadingWrapper
                            show={!!archivedProjects} customLoadingComponent={
                            <SkeletonLoader
                                type={"archive"}
                                width={1100}
                                height={300}
                                viewBox="0 0 1100 300"
                                style={{marginTop: "16px",marginLeft : "16px"}}
                            />
                        }>
                            <AnimateComponent>
                                {archivedProjects && (
                                    archivedProjects.length !== 0 ? (
                                        <div className="archive-list">
                                            {archivedProjects.map(prj => {
                                                return <ArchiveItem type="project" data={prj} key={prj.id}/>;
                                            })}
                                        </div>
                                    ) : (
                                        <EmptySign text="Yoy doesn't have any archived project"/>
                                    )
                                )}
                            </AnimateComponent>
                        </LoadingWrapper>
                    )}

                    {tabState === "sections" && (
                        <LoadingWrapper
                            show={!!archivedSections} customLoadingComponent={
                            <SkeletonLoader
                                type={"archive"}
                                width={1100}
                                height={300}
                                viewBox="0 0 1100 300"
                                style={{marginTop: "16px",marginLeft : "16px"}}
                            />
                        }>
                            <AnimateComponent>
                                {archivedSections && (
                                    archivedSections.length !== 0 ? (
                                        <div className="archive-list">
                                            {archivedSections.map(sec => {
                                                return <ArchiveItem type="section" data={sec} key={sec.id}/>;
                                            })}
                                        </div>
                                    ) : (
                                        <EmptySign text="Yoy doesn't have any archived section"/>
                                    )
                                )}
                            </AnimateComponent>
                        </LoadingWrapper>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}

export default ArchivePage;