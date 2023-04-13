import * as React from "react";
import Button from "@mui/material/Button";

import Dialog from "../dialog";

const Container = ({ categories, products }) => {
    const onOpen = React.useRef(null);

    const clickHandler = () => onOpen.current?.();
    
    return (
        <div>
            <Button
                className="bg-blue-500 py-3 px-3 text-white hover:bg-transparent hover:border-blue-500 hover:text-blue-500 "
                onClick={clickHandler}
                variant="outlined">
                Add new product
            </Button>
            <Dialog
                categories={categories}
                products={products}
                onOpen={onOpen}
            />
        </div>
    );
};

export default Container;