import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/router"
import classNames from "classnames"
import { Dialog } from "@mui/material"


const Container = ({ ariaDescribedby, ariaLabelledby, children, classes, customClose, onClose, onOpen }) => {
    const router = useRouter();
    const { pathname } = router;

    const currentPath = useRef(null);
    const [ open, setOpen ] = useState(false);

    const childrenMemo = useMemo(() => children, [ children ])
    const handleClose = useCallback(() => setOpen(false), []);

    useEffect(() => {
        onOpen.current = () => setOpen(true);
    }, [ onOpen ]);

    useEffect(() => {
        if(onClose) onClose.current = handleClose;
    }, [ onClose, handleClose ]);

    useEffect(() => {
        if(pathname !== currentPath.current) {
            setOpen(false);
            return;
        }
        currentPath.current = pathname;
    }, [ pathname ]);

    return (
        <Dialog
            classes={classes}
            open={open}
            onClose={customClose ? customClose : handleClose}
            aria-describedby={ariaDescribedby}
            aria-labelledby={ariaLabelledby}
        >
            { childrenMemo }
        </Dialog>
    );
};

export default Container;