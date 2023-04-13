import * as React from "react";
import classNames from "classnames"
import { Hidden, IconButton } from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

import classes from "./styles.module.css"

const SearchField = () => {
    const [ open, setOpen ] = React.useState(false);

    const toggle = React.useCallback(() => setOpen(b => !b), []);

    const formXSMemo = React.useMemo(() => (
        <>
            <input 
                className={classNames("border-0 grow outline-none px-2 rounded-l-xl")}
                placeholder="Search"
            />
            <IconButton
                className={classNames(classes.formIcon, "bg-amber-600 rounded-l-none rounded-r-xl text-white hover:bg-amber-800")}>
                <SearchIcon />
            </IconButton>
        </>
    ), [])

    const formSMMemo = React.useMemo(() => (
        <Hidden smDown>
            <form className={classNames(classes.formSm, `flex border border-solid border-slate-200 mr-3 
                pl-2 pr-1 py-1 rounded-xl`)}>
                <input 
                    className={classNames("border-0 grow outline-none")}
                    placeholder="Search"
                />
                <IconButton
                    className={classNames(classes.formIcon, "p-0 hover:bg-transparent")}>
                    <SearchIcon />
                </IconButton>
            </form>
        </Hidden>
    ), [])

    return (
        <>
            <Hidden smUp>
                <IconButton
                    onClick={toggle}>
                    { open ? <CloseIcon /> : <SearchIcon /> }
                </IconButton>
                <form
                    className={classNames(classes.form, { [classes.formOpen]: open },
                    `absolute bg-red-600 flex py-2 px-3 rounded-xl`)}>
                    { formXSMemo }
                </form>
            </Hidden>
            { formSMMemo }
        </>
    );
};

export default SearchField;