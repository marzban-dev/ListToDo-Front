import React from 'react';
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import Member from "components/Member";
import "./members.scss";

const Members =
    ({
         members,
         limit,
         compressed,
         axis = "r",
         width = 28,
         gap = 10
     }) => {
        const renderMembers = () => {
            const membersList = [];

            const addMember = (i) => {

                const memberStyle = {
                    transform: compressed && `translateX(${axis === "l" ? "-" : ""}${(members.length - i - 1) * gap}px)`,
                    zIndex: i * 10,
                    width: width + "px",
                    height: width + "px",
                    position: "relative",
                    transition: "transform 0.2s",
                    marginLeft: "0.1rem",
                }

                membersList.push(
                    <Member picture={members[i].owner.profile_img} name={members[i].owner.username} style={memberStyle}/>
                );
            }

            if (limit > 1) {
                for (let i in members) {
                    if (i < limit) {
                        addMember(i)
                    }
                }
            } else for (let i in members) addMember(i);

            return membersList;
        }

        return (
            <div className="members" style={{flexDirection: axis === "l" ? "row-reverse" : "row"}}>
                <ReactTooltip/>
                {renderMembers()}
                {
                    members.length - limit > 0 && (
                        <div className="members-count" style={{
                            zIndex: (members.length - 1) * 10,
                            width: width + "px",
                            height: width + "px"
                        }}>
                            <span>{members.length - limit}</span>
                        </div>
                    )
                }
            </div>
        );
    }

Members.propTypes = {
    members: PropTypes.array.isRequired,
    compressed: PropTypes.bool,
    limit: PropTypes.number,
    axis: PropTypes.oneOf(["l", "r"]),
    width: PropTypes.number,
    gap: PropTypes.number,
    withBorder: PropTypes.bool
}

export default Members;