import * as React from "react";
import { Alert, AlertTitle, Collapse } from "@mui/material";
import classNames from "classnames";

const Container = ({ className, description, onClose, onOpen, severity, title }) => {
    const [ open, setOpen ] = React.useState(false);

    const childrenMemo = React.useMemo(() => (
        <Alert className={classNames(className)} severity={severity} >
            <AlertTitle>{ title }</AlertTitle>
            { description }
        </Alert>
    ), [ className, description, severity, title ])

    React.useEffect(() => {
        onOpen.current = () => setOpen(true);
    }, [ onOpen ]);

    React.useEffect(() => {
        if(onClose) {
            onClose.current = () => setOpen(false);
        }
    }, [ onClose ])

    return (
        <Collapse in={open} unmountOnExit>
            { childrenMemo }
        </Collapse>
    );
};

export default Container;