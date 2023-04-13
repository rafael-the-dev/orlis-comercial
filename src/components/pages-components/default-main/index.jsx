import * as React from "react";

import classes from "./styles.module.css"

import { ComponentsContext } from "src/context"

import Main from "src/components/main";
import Panel from "./components/panel";
import SubContainer from "src/components/scroll-container";

const Container = ({ children, title }) => {
    const { containersMap, getPanel } = React.useContext(ComponentsContext);

    return (
        <Main>
            <Panel title={title} />
            <SubContainer className={classes.content}>
                { containersMap[getPanel()] }
                { children }
            </SubContainer>
        </Main>
    )
};

export default Container;