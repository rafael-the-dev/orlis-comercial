import * as React from "react";
import classNames from "classnames"
import { Button } from "@mui/material";

import { ComponentsContext } from "src/context"

const ListItem = ({ id, icon, title }) => {
    const { getPanel, setNewPanel } = React.useContext(ComponentsContext);

    const isSelected = id === getPanel();

    const clickHandler = React.useCallback(() => setNewPanel(id), [ id, setNewPanel ])

    return (
        <li className="mr-3 w-max last:mr-0">
            <Button
                className={classNames("border border-solid border-white hover:border-white hover:bg-white",
                    isSelected ? "bg-white text-black" : "text-white hover:bg-white hover:text-black" 
                )}
                onClick={clickHandler}
                startIcon={icon}
                variant={isSelected ? "contained" : "outlined"}>
                { title }
            </Button>
        </li>
    );
};

export default ListItem;