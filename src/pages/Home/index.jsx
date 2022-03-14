import React from "react";
import {Link} from "react-router-dom";
import "./home.scss";

const Home = () => {
    return (
        <div className="home">
            <h1>Welcome</h1>
            <p>
                <div>
                    This software will help you to list and classify your tasks,
                    you can also create project, and focus on your goals with the rest of the team.
                </div>
                <br/>
                <div>To get started tap here <Link to="/tasks" className="far fa-tasks"></Link></div>
                <div>If you aren't registered tap here <Link to="/signup" className="far fa-user-plus"></Link></div>
            </p>
        </div>
    );
};

export default Home;
