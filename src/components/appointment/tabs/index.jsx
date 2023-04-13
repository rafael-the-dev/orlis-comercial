import * as React from "react"
import IconButton from "@mui/material/IconButton";

import AddIcon from '@mui/icons-material/Add';

import { SalesContext } from "src/context";

import Tab from "./components/tab";

const SalesPageTabs = () => {
    const { addPage, getPages } = React.useContext(SalesContext);

    return (
        <ul className="flex">
            {
                getPages().map((tab, index) => (
                    <Tab 
                        id={tab.id}
                        index={index + 1}
                        key={tab.id}
                    />
                ))
            }
            <li>
                <IconButton
                    className="py-1 rounded-none"
                    disabled={getPages().length >= 5}
                    onClick={addPage}>
                    <AddIcon />
                </IconButton>
            </li>
        </ul>
    );
};

export default SalesPageTabs;