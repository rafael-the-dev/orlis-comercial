import * as React from "react";
import classNames from "classnames";
import { Button, IconButton } from "@mui/material"

import classes from "./styles.module.css";
import { SalesContext } from "src/context";

import CloseIcon from '@mui/icons-material/Close';

const Tab = ({ id, index }) => {
    const { getCurrentPage, getPages, getTables, removePage, setCurrentPage } = React.useContext(SalesContext);
    
    const isLessThan2 = getPages().length < 2;
    const isSelected = id === getCurrentPage();
    const selectedTable = getTables().find(item => item.id === id);
   

    const clickHandler = () => setCurrentPage(id);
    const removeHandler = () => removePage(id);

    return (
        <li 
            className={classNames(classes.root, "flex items-center justify-between", 
            { "bg-white font-bold": isSelected }, { [classes.tableTab]:  Boolean(selectedTable) },
            { [classes.rootSelected]: isSelected && !isLessThan2 })}>
            <Button 
                className={classNames("p-0", isSelected ? "text-blue-500 hover:bg-transparent" : "text-black" )}
                onClick={clickHandler}>
                { Boolean(selectedTable) ? selectedTable.table.name : `Tab ${ index }`}
            </Button>
            <IconButton 
                className={classNames("p-0", {  "hidden": (isLessThan2 || !isSelected) } )}
                onClick={removeHandler}>
                <CloseIcon className="text-sm" />
            </IconButton>
        </li>
    );
};

export default Tab;