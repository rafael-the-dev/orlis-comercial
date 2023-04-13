import * as React from "react"

import { BookingContext } from "src/context"

import ListItem from "./components/list-item"
import Panel from "src/components/panel";
import Title from "src/components/title";

const PanelContainer = () => {
    const { panelsList } = React.useContext(BookingContext);

    return (
        <Panel>
            <Title>Booking</Title>
            <ul className="flex flex-wrap mt-3">
                {
                    panelsList.current.map(item => <ListItem { ...item } key={item.key} />)
                }
            </ul>
        </Panel>
    );
};

export default PanelContainer;