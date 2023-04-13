import * as React from "react";
import { Alert, AlertTitle } from "@mui/material";
import classNames from "classnames";

import classes from "./styles.module.css";

import Dialog from "../dialog";

const MessageDialog = ({ closeHelper, description, onOpen, setDialogMessage, title, type }) => {
    const [ message, setMessage ] = React.useState({});
    const onClose = React.useRef(null);
    const dialogOnOpen = React.useRef(null);

    const closeHandler = React.useCallback(() => {
        onClose.current?.();
        setMessage({})
        closeHelper && closeHelper();
    }, [ closeHelper ]);

    React.useEffect(() => {
        if(setDialogMessage)
            setDialogMessage.current = newMessage => setMessage(newMessage);
    }, [ setDialogMessage ]);

    React.useEffect(() => {
        if(Object.keys(message).length > 0) {
            dialogOnOpen.current?.();
        }
    }, [ message ])

    return (
        <Dialog
            onClose={onClose}
            onOpen={onOpen ?? dialogOnOpen}>
            <Alert 
                className={classNames(classes.alert)} 
                onClose={closeHandler}
                severity={message.type ?? type} >
                <AlertTitle>{ message.title ?? title }</AlertTitle>
                { message.description ?? ( description ?? "" ) }
            </Alert>
        </Dialog>
    );
};

export default MessageDialog;