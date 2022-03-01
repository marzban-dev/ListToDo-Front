import React from "react";
import PageContainer from "components/UI/PageContainer";
import {useActivityQuery} from "hooks/useDetailsData";
import ActivitySection from "components/ActivitySection";
import InfiniteScroll from "react-infinite-scroll-component";
import "./activityPage.scss";
import Spinner from "components/UI/Spinner";

const ActivityPage = () => {
    const {data: activitiesData, hasNextPage, isFetchingNextPage, isFetching, fetchNextPage} = useActivityQuery();

    const convertPagesToGroupedList = (activityPages) => {
        const groupedActivities = {};

        const allActivities = [];
        activityPages.forEach(page => page.forEach(activity => allActivities.push(activity)));
        allActivities.forEach(activity => {
            const activityDate = new Date(activity.created).toDateString();
            if (groupedActivities.hasOwnProperty(activityDate)) {
                groupedActivities[activityDate] = [...groupedActivities[activityDate], activity];
            } else {
                groupedActivities[activityDate] = [activity];
            }
        });

        return groupedActivities;
    }

    const renderActivities = () => {
        const groupedActivities = convertPagesToGroupedList(activitiesData.pages);
        console.log(hasNextPage)
        return (
            <InfiniteScroll
                next={fetchNextPage}
                hasMore={hasNextPage}
                scrollThreshold={1}
                loader={<Spinner type="circle" style={{width: "100%", padding: "3rem 0"}}/>}
                dataLength={
                    Object
                        .keys(groupedActivities)
                        .map(gN => groupedActivities[gN].length)
                        .reduce((oldL, newL) => oldL + newL)
                }
                endMessage={"No More Result"}
                scrollableTarget="scrollable-container"
            >
                <div className="activity-sections">
                    {Object.keys(groupedActivities).map((groupName, index) => {
                        return (
                            <ActivitySection
                                key={index}
                                activities={groupedActivities[groupName]}
                                dateTitle={groupName}
                            />
                        )
                    })}
                </div>
            </InfiniteScroll>
        )
    }

    return (
        <PageContainer>
            <div className="activity-page-container">
                {activitiesData && renderActivities()}
            </div>
        </PageContainer>
    );
}

export default ActivityPage;