import * as React from "react";
import { Button, IconButton } from "@mui/material";
import classNames from "classnames";

import classes from "./styles.module.css";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';

import { SalesReportContext } from "src/context"

const TabButton = ({ id, index, }) => {
    const { addTab, addCurrentVisibleTab, currentTab, getTabs, removeTab } = React.useContext(SalesReportContext);
    
    const isSelected = currentTab === id;

    const clickHandler = () => {
        return id === -1 ? addTab() : addCurrentVisibleTab(id);
    };

    const getClassNames = () => {
        if(isSelected) {
            let result = "bg-white rounded-none";

            if(getTabs().length > 2) return classNames(classes.active, result, "pr-1");

            return result;
        } 

        return "bg-zinc-100";
    };

    const removeHandler = () => removeTab(id, index - 1);

    if(id === -1 && getTabs().length >= 6) return <></>;

    return (
        <li className={classNames("flex items-center justify-between", getClassNames())}>
            <Button
                className={classNames("capitalize", isSelected ? "text-blue-500" : "text-black" )}
                onClick={clickHandler}>
                { id === -1 ? <AddIcon /> : `Tab ${index}` }
            </Button>
            { isSelected && getTabs().length > 2 && (
                <IconButton
                    className="p-0"
                    onClick={removeHandler}>
                    <CloseIcon className="text-base" />
                </IconButton>
            )}
        </li>
    );
};

export default TabButton;