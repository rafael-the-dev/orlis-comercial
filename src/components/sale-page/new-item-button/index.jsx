import * as React from "react";
import Button from "@mui/material/Button";

import Dialog from "../dialog";

const Container = () => {
    const onOpen = React.useRef(null);
    
    const clickHandler = () => onOpen.current?.();
    
    return (
        <div>
            <Button
                className="bg-neutral-800 py-3 px-3 text-white hover:bg-neutral-600 hover:border-neutral-600 "
                onClick={clickHandler}
                variant="outlined">
                Add new product
            </Button>
            <Dialog
                onOpen={onOpen}
            />
        </div>
    );
};

export default Container;