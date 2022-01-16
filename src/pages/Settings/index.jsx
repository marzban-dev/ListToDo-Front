import React from 'react';
import PageContainer from "components/UI/PageContainer";
import SettingTheme from "./SettingTheme/SettingTheme";
import Profile from "../../components/Profile";
import "./settings.scss";

const Settings = () => {
    return (
        <React.Fragment>
            <PageContainer scrollY>
                <Profile/>
                <div className="settings">
                    <SettingTheme/>
                </div>
            </PageContainer>
        </React.Fragment>
    );
}

export default Settings;