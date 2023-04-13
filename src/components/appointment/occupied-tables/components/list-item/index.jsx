import * as React from "react";
import { Avatar, Button } from "@mui/material";
import classNames from "classnames";

import classes from "./styles.module.css";

import { SalesContext } from "src/context";

const ListItem = ({ children, id, index, tableId }) => {
    const { createPageWithTable, getCurrentPage, getPages, setCurrentPage } = React.useContext(SalesContext);

    const isSelected = id === getCurrentPage();

    const clickHandler = () => {
        if(isSelected) return;

        if(getPages().find(item => item.id === id)) {
            setCurrentPage(id)
            return;
        }

        createPageWithTable(id);
    }
    
    return (
        <li className={classNames(classes.listItem, "border-b border-solid last:border-0")}>
            <Button
                className={classNames("justify-between px-2 py-2 rounded-none text-white w-full",
                { "bg-blue-500 hover:bg-blue-700": isSelected })}
                onClick={clickHandler}>
                { children }
                <Avatar className={classNames(classes.avatar, "bg-stone-300")}>{ index }</Avatar>
            </Button>
        </li>
    );
};

export default ListItem;