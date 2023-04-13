import * as React from "react";
import classNames from "classnames";

import classes from "./styles.module.css";

import Dialog from "src/components/dialog";
import DialogHeader from "src/components/dialog/components/dialog-header";
import PaymentMethodHome from "./components/home";
import SuccessfulPaymentPanel from "./components/successful-payment-panel"

const CheckoutContainer = ({ onOpen }) => {
    const [ panel, setPanel ] = React.useState("PAYMENTMETHODS")

    const onClose = React.useRef(null);
    const salesSerie = React.useRef(0);

    const closeHandler = React.useCallback(() => onClose.current?.(), []);

    const headerMemo = React.useMemo(() => (
        <DialogHeader
            classes={{ paper: classes.paper, root: "bg-neutral-800 pl-4 text-white" }}
            onClose={closeHandler}>
            Checkout
        </DialogHeader>
    ), [ closeHandler ]);
    
    const paymentMethodMethodMemo = React.useMemo(() => <PaymentMethodHome onClose={closeHandler} salesSerie={salesSerie} setPanel={setPanel} />, [ closeHandler ])
    const successfulPaymentPanel = React.useMemo(() => <SuccessfulPaymentPanel onClose={closeHandler} salesSerie={salesSerie}  setPanel={setPanel} />, [ closeHandler ])

    return (
        <Dialog
            classes={{ paper: classNames("m-0", classes.paper) }}
            onClose={onClose}
            onOpen={onOpen}>
            { headerMemo }
            <div className={classes.content}>
                {
                    {
                        "PAYMENTMETHODS": paymentMethodMethodMemo,
                        "SUCCESSFULPAYMENT": successfulPaymentPanel
                    }[panel]
                }
            </div>
        </Dialog>
    );
};

export default CheckoutContainer;