import * as React from "react";
import classNames from "classnames";
import { Hidden, IconButton } from "@mui/material";
import { useRouter } from "next/router"

import classes from "./styles.module.css";

import MenuIcon from '@mui/icons-material/Menu';

import Container from "./components/container";
import Drawer from "src/components/drawer";


const Menu = () => {
    const onClickRef = React.useRef(null);
    const onCloseRef = React.useRef(null);

    const clickHandler = () => onClickRef.current?.();

    const { pathname } = useRouter();
    if([ "/login" ].includes(pathname)) return <></>;

    return (
        <>
            <Hidden lgDown>
                <Container />
            </Hidden>
            <Hidden lgUp>
                <IconButton 
                    className="p-0 hover:bg-transparent"
                    onClick={clickHandler}>
                    <MenuIcon />
                </IconButton>
                <Drawer
                    anchor="left"
                    classes={{ 
                        paper: classNames(classes.dialogPaper, "h-full m-0 max-h-full rounded-none"),
                        scrollPaper: "justify-start"
                    }}
                    id="menu"
                    onOpen={onClickRef}
                    onClose={onCloseRef}>
                    <Container />
                </Drawer>
            </Hidden>
        </>
    );
};

export default Menu;