import React, {useEffect} from "react";
import Task from "components/Task/Task";
import {fetchTasks} from "../../store/actions/ApiCalls.actions";
import {useDispatch} from "react-redux";
import {setData} from "../../store/actions/Main.actions";
import {useNavigate} from "react-router-dom";
import "./sectionTasks.scss";

const SectionTasks = ({section}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const renderTasks = () => {
        return section.tasks ? section.tasks.map((task, index) => {
            return !task.completed ? <Task key={index} task={task}/> : null;
        }) : "loading";
    };

    useEffect(() => {
        const fn = async () => {
            try {
                if (section.tasks === null) {
                    const result = await dispatch(fetchTasks({section: section.id}));
                    dispatch(setData({
                        modify: {
                            type: 'section',
                            part: 'projects',
                            id: section.id,
                            key: 'id',
                            data: {tasks: result},
                            nestedProperties: ['projects', 'sections']
                        }
                    }));
                }
            } catch (error) {
                console.log(error)
            }
        }
        fn();
    }, []);


    return (<div className="section-tasks">
        <div className="section-tasks-head">
            <h3 className="section-tasks-head-title">{section.title}</h3>
            <div className="section-tasks-head-menu">
                <span className="far fa-ellipsis-v"></span>
            </div>
        </div>

        <section className="section-tasks-list">
            {renderTasks()}
        </section>

        <div className="section-tasks-add-button">
            <button onClick={() => navigate(`/tasks/create/${section.id}`)}>
                <span className="far fa-plus"></span>
            </button>
        </div>
    </div>);
};

export default React.memo(SectionTasks);
