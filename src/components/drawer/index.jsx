import { useCallback, useEffect, useMemo, useState} from "react"
import { Drawer } from "@mui/material"

const Container = ({ anchor, children, classes, id, onOpen, onClose }) => {
    const [ open, setOpen ] = useState(false);

    const childrenMemo = useMemo(() => children, [ children ]);

    const openHandler = useCallback(() => setOpen(true), []);
    const closeHandler = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if(onClose) onClose.current = closeHandler;
    }, [ onClose, closeHandler ])

    useEffect(() => {
        if(onOpen) onOpen.current = openHandler;
    }, [ onOpen, openHandler ]);

    return (
        <Drawer
            anchor={ anchor ?? "right" }
            id={id}
            open={open}
            onClose={closeHandler}
            classes={classes}>
            { childrenMemo }
        </Drawer>
    );
};

export default Container;