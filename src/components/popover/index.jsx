import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Popover } from "@mui/material"
import { useRouter } from "next/router"

const PopoverContainer = ({ children, customClose, id, onClickRef, onCloseRef, paperClassName }) => {
    const router = useRouter();
    const { pathname } = router;

    const [ anchorEl, setAnchorEl] = useState(null);
    const currentPath = useRef(null);
    
    const openPopover = Boolean(anchorEl);
    const popoverID = openPopover ? `${id}-popover` : undefined;
    
    const childrenMemo = useMemo(() => <>{ children }</>, [ children ])

    const handleClose = useCallback(event => {
        event && event.stopPropagation();
        setAnchorEl(null);
    }, []);

    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    useEffect(() => {
        onClickRef.current = handleClick;
    }, [ handleClick, onClickRef ]);

    useEffect(() => {
        if(onCloseRef)
            onCloseRef.current = handleClose;
    }, [ handleClose, onCloseRef ]);

    useEffect(() => {
        if(pathname !== currentPath.current) {
            setAnchorEl(null);
            return;
        }
        currentPath.current = pathname;
    }, [ pathname ]);

    return (
        <Popover
            id={popoverID}
            open={openPopover}
            anchorEl={anchorEl}
            onClose={customClose ? customClose : handleClose}
            classes={{ paper: paperClassName }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            { childrenMemo }
        </Popover>
    );
};

export default PopoverContainer;