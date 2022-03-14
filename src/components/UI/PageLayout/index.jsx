import React from "react";
import {Outlet} from "react-router-dom";
import PageContainer from "components/UI/PageContainer";

const PageLayout = () => {
    return (
        <PageContainer>
            <Outlet/>
        </PageContainer>
    );
}

export default PageLayout;