import React from "react";
import ContentLoader from "react-content-loader";
import PropTypes from "prop-types";

const SkeletonLoader = ({type, speed = 1, width, height, viewBox, style,className}) => {

    let backgroundColor = "";
    let foregroundColor = "";

    const currentAppTheme = document.querySelector('body').getAttribute('theme');
    switch (currentAppTheme) {
        case 'light' :
            backgroundColor = "#d8d7d7";
            foregroundColor = "#e2e1e1";
            break;
        case 'dark' :
            backgroundColor = "#363b43";
            foregroundColor = "#3f454e";
            break;
    }

    let skeletonSettings = {
        speed,
        width,
        height,
        viewBox,
        backgroundColor: backgroundColor,
        foregroundColor: foregroundColor,
        style,
        className
    }

    switch (type) {
        case "sections":
            return (
                <ContentLoader {...skeletonSettings}>
                    <rect x="32" y="0" rx="15" ry="15" width="350" height="66"/>
                    <rect x="422" y="0" rx="15" ry="15" width="350" height="66"/>
                    <rect x="812" y="0" rx="15" ry="15" width="350" height="66"/>
                </ContentLoader>
            )
        case "tasks":
            return (
                <ContentLoader {...skeletonSettings}>
                    <circle cx="23" cy="39" r="23"/>
                    <rect x="61" y="16" rx="15" ry="15" width="289" height="46"/>
                    <circle cx="23" cy="101" r="23"/>
                    <rect x="61" y="78" rx="15" ry="15" width="289" height="46"/>
                    <circle cx="23" cy="163" r="23"/>
                    <rect x="61" y="140" rx="15" ry="15" width="289" height="46"/>
                    <circle cx="23" cy="225" r="23"/>
                    <rect x="61" y="202" rx="15" ry="15" width="289" height="46"/>
                </ContentLoader>
            );
        case "profile" :
            return (
                <ContentLoader {...skeletonSettings}>
                    <circle cx="25" cy="25" r="25"/>
                </ContentLoader>
            )
        case "wallpaper" :
            return (
                <ContentLoader {...skeletonSettings}>
                    <rect x="0" y="0" rx="0" ry="0" width="100%" height="100%"/>
                </ContentLoader>
            )
        case "projects" :
            return (
                <ContentLoader {...skeletonSettings}>
                    <rect x="0" y="32" rx="15" ry="15" width="350" height="208"/>
                    <rect x="374" y="32" rx="15" ry="15" width="350" height="208"/>
                    <rect x="748" y="32" rx="15" ry="15" width="350" height="208"/>
                </ContentLoader>
            )
        case "comments" :
            return (
                <ContentLoader {...skeletonSettings}>
                    <rect x="748" y="0" rx="15" ry="15" width="350" height="137"/>
                    <rect x="200" y="0" rx="15" ry="15" width="250" height="105"/>
                    <circle cx="480" cy="20" r="20"/>
                    <rect x="125" y="129" rx="15" ry="15" width="325" height="90"/>
                    <circle cx="480" cy="149" r="20"/>
                    <rect x="270" y="243" rx="15" ry="15" width="180" height="165"/>
                    <circle cx="480" cy="263" r="20"/>
                </ContentLoader>
            )
        case "activities" :
            return (
                <ContentLoader {...skeletonSettings}>
                    <rect x="748" y="0" rx="15" ry="15" width="350" height="137"/>
                    <circle cx="6" cy="56" r="6"/>
                    <rect x="31" y="40" rx="0" ry="0" width="200" height="8"/>
                    <rect x="31" y="60" rx="0" ry="0" width="260" height="8"/>
                    <rect x="56" y="100" rx="10" ry="10" width="312" height="65"/>
                    <rect x="56" y="189" rx="10" ry="10" width="259" height="65"/>
                    <rect x="56" y="278" rx="10" ry="10" width="360" height="65"/>
                    <circle cx="6" cy="391" r="6"/>
                    <rect x="31" y="375" rx="0" ry="0" width="200" height="8"/>
                    <rect x="31" y="395" rx="0" ry="0" width="260" height="8"/>
                    <rect x="56" y="435" rx="10" ry="10" width="240" height="65"/>
                    <rect x="56" y="524" rx="10" ry="10" width="310" height="65"/>
                </ContentLoader>
            )
        case "chart" :
            return (
                <ContentLoader {...skeletonSettings}>
                    <rect x="748" y="0" rx="15" ry="15" width="350" height="137" />
                    <rect x="0" y="26" rx="0" ry="0" width="7" height="589" />
                    <rect x="0" y="493" rx="0" ry="0" width="600" height="7" />
                    <rect x="165" y="526" rx="0" ry="0" width="380" height="7" />
                    <rect x="45" y="253" rx="5" ry="5" width="42" height="216" />
                    <rect x="115" y="176" rx="5" ry="5" width="42" height="291" />
                    <rect x="185" y="208" rx="5" ry="5" width="42" height="262" />
                    <rect x="255" y="61" rx="5" ry="5" width="42" height="408" />
                    <rect x="325" y="383" rx="5" ry="5" width="42" height="86" />
                    <rect x="395" y="167" rx="5" ry="5" width="42" height="304" />
                    <rect x="465" y="292" rx="5" ry="5" width="42" height="179" />
                </ContentLoader>
            )
        case "archive" :
            return (
                <ContentLoader {...skeletonSettings}>
                    <rect x="0" y="0" rx="15" ry="15" width="350" height="100" />
                    <rect x="366" y="0" rx="15" ry="15" width="350" height="100" />
                    <rect x="732" y="0" rx="15" ry="15" width="350" height="100" />
                </ContentLoader>
            )
    }
}

SkeletonLoader.propTypes = {
    type: PropTypes.oneOf([
        'sections',
        'tasks',
        'profile',
        'wallpaper',
        'projects',
        'comments',
        'activities',
        'chart',
        'archive'
    ]).isRequired,
    speed: PropTypes.number,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    viewBox: PropTypes.string.isRequired,
    style: PropTypes.object,
}

export default SkeletonLoader;