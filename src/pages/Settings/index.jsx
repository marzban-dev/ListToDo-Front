import React from 'react';
import PageContainer from "components/UI/PageContainer";
import SettingTheme from "./SettingTheme/SettingTheme";
import Profile from "components/Profile";
import "./settings.scss";

const Settings = () => {
    return (
            <PageContainer scrollY>
                <Profile/>
                <div className="settings">
                    <SettingTheme/>
                </div>
            </PageContainer>
    );
}

export default Settings;