import * as React from "react";
import { Button } from "@mui/material"
import classNames from "classnames";

import classes from "./styles.module.css";

import { SalesContext } from "src/context"

import Collapse from "src/components/collapse";
import ListItem from "./components/list-item";

const TablesContainer = () => {
    const { getTables } = React.useContext(SalesContext);

    const onClose = React.useRef(null);
    const onOpen = React.useRef(null);

    const getTablesList = React.useCallback(() => (
        getTables().map((item, index) => (
            <ListItem { ...item } index={index + 1} key={item.id}>
                { item.table?.name ?? `Table ${ index + 1 }`}
            </ListItem>
        ))
    ), [ getTables ]);

    React.useEffect(() => {
        if(getTables().length > 0) onOpen.current?.(); 
        else onClose.current?.();
    }, [ getTables ])
            
    return (
        <Collapse 
            classes={{ root: "h-full", wrapper: "h-full", wrapperInner: "h-full" }}
            orientation="horizontal"
            onClose={onClose}
            onOpen={onOpen}>
            <div className={classNames(classes.root, "bg-neutral-800 h-full")}>
                {
                    <ul>
                        {
                            getTablesList()
                        }
                        <li className="mt-2 px-3">
                            <Button
                                className="bg-white py-2 text-neutral-800 w-full hover:bg-gray-200">
                                Add new table
                            </Button>
                        </li>
                    </ul> 
                }
            </div>
        </Collapse>
    );
};

export default TablesContainer;