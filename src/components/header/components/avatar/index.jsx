import * as React from "react";
import { Avatar, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import classNames from "classnames";

import classes from "./styles.module.css";

import PersonIcon from '@mui/icons-material/Person';

import { LoginContext } from "src/context";

import ListItem from "src/components/list-item-button";
import Logout from "./components/logout-button"
import Popover from "src/components/popover";


const Container = () => {
    const { loggedUser } = React.useContext(LoginContext);
    const onOpen = React.useRef(null);

    const clickHandler = e => onOpen.current?.(e);

    const router = useRouter();
    const profileClickHandler = () => router.push(`/profile/${loggedUser.Username}`)

    const logoutHandler = () => {
        logoutHelper();
    };
    
    return (
        <>
            <IconButton
                className="p-0"
                onClick={clickHandler}>
                <Avatar 
                    alt=""
                    className={classNames(classes.avatar)}
                    src="https://xsgames.co/randomusers/avatar.php?g=male"
                />
            </IconButton>
            <Popover
                id="user"
                onClickRef={onOpen}>
                <ul className={classes.list}>
                    <ListItem 
                        classes={{ button: "capitalize" }}
                        onClick={profileClickHandler}>
                        <PersonIcon />
                        Perfil
                    </ListItem>
                    <Logout />
                </ul>
            </Popover>
        </>
    );
};

export default Container;