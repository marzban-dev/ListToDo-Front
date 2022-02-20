import React from "react";
import EmptySign from "components/UI/EmptySign";
import LoadingWrapper from "components/UI/LoadingWrapper";
import "./listTab.scss";

const ListTab = ({children, isEmpty ,emptyListWarning = "There is no any item"}) => {

    const renderTasks = () => {
        if (!isEmpty) {
            return (
                <div className="list-tab-items">
                    {children}
                </div>
            )
        } else {
            return <EmptySign text={emptyListWarning}/>
        }
    }

    return (
        <div className="list-tab">
            <LoadingWrapper type="dots" show={children} onLoaded={renderTasks} size="sm"/>
        </div>
    );
}

export default ListTab;