import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "components/UI/Spinner";
import ActivitySection from "components/ActivityTree/components/ActivitySection";
import {useActivityQuery} from "hooks/useDetailsData";
import LoadingWrapper from "components/UI/LoadingWrapper";
import SkeletonLoader from "components/UI/SkeletonLoader";
import "./activityTree.scss";

const ActivityTree = () => {
    const {data: activities, hasNextPage, fetchNextPage} = useActivityQuery();

    const renderActivities = () => {

        const groupedActivities = {};
        const allActivities = [];
        activities.pages.forEach(page => page.forEach(activity => allActivities.push(activity)));

        allActivities.forEach(activity => {
            const activityDate = new Date(activity.created).toDateString();
            if (groupedActivities.hasOwnProperty(activityDate)) {
                groupedActivities[activityDate] = [...groupedActivities[activityDate], activity];
            } else {
                groupedActivities[activityDate] = [activity];
            }
        });


        return (

            <InfiniteScroll
                next={fetchNextPage}
                hasMore={hasNextPage}
                scrollThreshold={1}
                loader={<Spinner type="circle" style={{width: "100%", padding: "3rem 0"}}/>}
                dataLength={
                    Object.keys(groupedActivities).length !== 0 ? (
                        Object
                            .keys(groupedActivities)
                            .map(gN => groupedActivities[gN].length)
                            .reduce((oldL, newL) => oldL + newL)
                    ) : 0
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
        <LoadingWrapper
            show={!!activities}
            customLoadingComponent={
                <SkeletonLoader
                    type={"activities"}
                    width={500}
                    height={650}
                    viewBox="0 0 500 650"
                />
            }
        >
            {!!activities && renderActivities()}
        </LoadingWrapper>
    );
}

export default ActivityTree;
