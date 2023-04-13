import * as React from "react"

import { ComponentsContext } from "src/context"

import ListItem from "./components/list-item"
import Panel from "src/components/panel";
import Title from "src/components/title";

const PanelContainer = ({ title }) => {
    const { tabsList } = React.useContext(ComponentsContext);

    return (
        <Panel>
            <Title>{ title }</Title>
            <div className="overflow-x-auto">
                <ul className="flex mt-3 w-fit">
                    {
                        tabsList.map(item => <ListItem { ...item } key={item.key} />)
                    }
                </ul>
            </div>
        </Panel>
    );
};

export default PanelContainer;