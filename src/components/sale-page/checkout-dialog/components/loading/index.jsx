import * as React from "react";
import { CircularProgress } from "@mui/material"

import Dialog from "src/components/dialog";
import MessageDialog from "src/components/message-dialog"

const LoadingDialog = ({ onOpen }) => {
    const onClose = React.useRef(null);

    const closeHandler = () => {
        onClose.current?.();
    };

    React.useEffect(() => {

    }, [])

    return (
        <>
            <Dialog
                onClose={onClose}
                onOpen={onOpen}>
                <CircularProgress />
            </Dialog>
            <MessageDialog 
                description="Venda realizada com successo"
                on
                type="success"
                title="Message"
            />
        </>
    );
};

export default LoadingDialog;