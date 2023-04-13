import * as React from "react"

import { ComponentsContext } from "src/context"

import ListItem from "./components/list-item"
import Panel from "src/components/panel";
import Title from "src/components/title";

const PanelContainer = () => {
    const { tabsList } = React.useContext(ComponentsContext);

    return (
        <Panel>
            <Title>Warehouse</Title>
            <ul className="flex flex-wrap mt-3">
                {
                    tabsList.map(item => <ListItem { ...item } key={item.key} />)
                }
            </ul>
        </Panel>
    );
};

export default PanelContainer;