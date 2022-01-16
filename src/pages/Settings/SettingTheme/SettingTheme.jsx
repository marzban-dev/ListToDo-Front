import React, {useState} from "react";
import Setting from "components/Setting";
import {useDispatch} from "react-redux";
import {setAppTheme} from "store/actions/Main.actions";
import {APP_THEMES} from "config";
import "./settingTheme.scss";

const SettingTheme = () => {

    const dispatch = useDispatch();

    const [currentTheme, setCurrentTheme] = useState(
        localStorage.getItem('APP_THEME') ?
            localStorage.getItem('APP_THEME') : 'light'
    );

    const setTheme = (e) => {
        const theme = e.target.value;
        dispatch(setAppTheme(theme));
        setCurrentTheme(theme);
    };

    const Theme = ({themeTitle, themeColors}) => {
        return (
            <div className="setting-theme-item">
                <div className="setting-theme-item-head" style={{
                    color: themeColors.text,
                    backgroundColor: themeColors.primary
                }}>
                    <h5>{themeTitle}</h5>
                    <input
                        type="radio"
                        value={themeTitle}
                        name="theme-input"
                        id={`theme-${themeTitle}`}
                        onChange={setTheme}
                        checked={currentTheme === themeTitle}
                    />
                </div>
                <div className="setting-theme-item-body" style={{backgroundColor: themeColors.secondaryComplement}}>
                    <ul className="setting-theme-item-body-tasks">
                        <li className="setting-theme-item-body-tasks-task"
                            style={{backgroundColor: themeColors.secondary}}
                        >
                            <span className="theme-task-checkbox" style={{backgroundColor: themeColors.primary}}></span>
                            <span className="theme-task-text" style={{backgroundColor: themeColors.text}}></span>
                        </li>
                        <li className="setting-theme-item-body-tasks-task"
                            style={{backgroundColor: themeColors.secondary}}
                        >
                            <span className="theme-task-checkbox" style={{backgroundColor: themeColors.primary}}></span>
                            <span className="theme-task-text" style={{backgroundColor: themeColors.text}}></span>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    return (
        <Setting title="Theme" iconClass="far fa-palette">
            <div className="setting-theme">
                {APP_THEMES.map(theme => <Theme themeTitle={theme.title} themeColors={theme.colors}/>)}
            </div>
        </Setting>
    )

}
export default SettingTheme;