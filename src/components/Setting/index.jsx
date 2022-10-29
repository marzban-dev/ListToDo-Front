import React from 'react';
import "./setting.scss";

const Setting = ({title,iconClass, children}) => {

    return <section className="setting">
        <div className="setting-title"><span className={iconClass}></span><h3>{title}</h3></div>
        <div className="setting-data-box">
            {children}
        </div>
    </section>;
}

export default Setting;