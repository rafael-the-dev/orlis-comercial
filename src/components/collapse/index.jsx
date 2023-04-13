import * as React from "react";
import Collapse from "@mui/material/Collapse";

const CollapseContainer = ({ children, onClose, onOpen, onToggle, ...rest }) => {
    const [ open, setOpen ] = React.useState(false);

    const childrenMemo = React.useMemo(() => children, [ children ]);

    React.useEffect(() => {
        if(Boolean(onClose)) onClose.current = () => setOpen(false);
        if(Boolean(onOpen)) onOpen.current = () => setOpen(true);
        if(Boolean(onToggle)) onToggle.current = () => setOpen(b => !b);
    }, [ onClose, onOpen, onToggle ]);

    return (
        <Collapse unmountOnExit in={open} { ...rest }>
            { childrenMemo }
        </Collapse>
    )
};

export default CollapseContainer;