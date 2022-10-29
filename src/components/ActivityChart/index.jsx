import React, {useEffect, useState} from "react";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import {Line} from "react-chartjs-2";
import {useChartActivityQuery} from "hooks/useDetailsData";
import LoadingWrapper from "components/UI/LoadingWrapper";
import SkeletonLoader from "components/UI/SkeletonLoader";
import "./activityChart.scss";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ActivityChart = ({gte, lte}) => {
    const [chartConfigData, setChartConfigDate] = useState(null);

    const {data: activities} = useChartActivityQuery(gte, lte, {
        onSuccess: acts => loadChartData(acts)
    });

    useEffect(() => {
        if (!!activities && !chartConfigData) loadChartData(activities);
    }, [])

    const loadChartData = acts => {
        const groupedActivities = {};
        acts.forEach(activity => {
            const activityDate = new Date(activity.created).toDateString();
            if (groupedActivities.hasOwnProperty(activityDate)) {
                groupedActivities[activityDate] = [...groupedActivities[activityDate], activity];
            } else {
                groupedActivities[activityDate] = [activity];
            }
        });

        const chartData = [];

        Object.keys(groupedActivities).forEach(groupName => {
            const activityDate = new Date(groupedActivities[groupName][0].created);
            chartData.push({
                x: activityDate.getDate(),
                y: groupedActivities[groupName].length
            });
        });

        chartData.reverse()

        setChartConfigDate({
            labels: Object
                .keys(groupedActivities)
                .map(gn => {
                    const actDate = new Date(groupedActivities[gn][0].created);
                    return `${actDate.toLocaleString("default", {month: "short"})} ${actDate.getDate()}`
                })
                .reverse(),
            datasets: [
                {
                    label: 'Your Activities',
                    data: chartData,
                    borderColor: "#4ECCA3",
                    backgroundColor: "#44b993",
                    tickColor: "#ff0000",
                    drawTicks: true
                }
            ]
        });
    }

    return (
        <LoadingWrapper
            show={!!activities && chartConfigData}
            customLoadingComponent={
                <SkeletonLoader
                    width={600}
                    height={500}
                    viewBox="0 0 600 500"
                    type="chart"
                    className="chart-loader-component"
                />
            }
        >
            <div className="chart-container">
                <Line type="line" data={chartConfigData} options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Last 3 months activities',
                        },
                    },
                    maintainAspectRatio: false,
                }}
                />
            </div>
        </LoadingWrapper>
    )
}

export default ActivityChart;