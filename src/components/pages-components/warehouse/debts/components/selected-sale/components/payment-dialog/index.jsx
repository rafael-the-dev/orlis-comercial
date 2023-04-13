import * as React from "react";
import classNames from "classnames";

import classes from "./styles.module.css";

import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';

import { ComponentsContext, DebtContext } from "src/context";
import { getAuthorizationHeader } from "src/helpers/queries"

import Dialog from "src/components/dialog";
import DialogHeader from "src/components/dialog/components/dialog-header";
import MessageDialog from "src/components/message-dialog";
import PrimaryButton from "src/components/primary-button";
import PaymentMethod from "./components/payment-method";

const PaymentDialog = () => {
    const { dialog, setDialog } = React.useContext(ComponentsContext)
    const { addPaymentMethod, canISubmit, fetchDebtsData, hasPaymentMethodLeft, paymentMethods, setPaymentMethods } = React.useContext(DebtContext);
    const debt = dialog;

    const [ loading, setLoading ] = React.useState(false);

    const loadingRef = React.useRef(false);
    const onClose = React.useRef(null)
    const onOpen = React.useRef(null);
    const setDialogMessageRef = React.useRef(null);

    const openHandler = React.useCallback(() => onOpen.current?.(), []);

    const closeHandler = React.useCallback(({ forceClose }) => {
        if(!forceClose && loadingRef.current) return;

        onClose.current?.();
    }, []);

    const messageDialogMemo = React.useMemo(() => (
        <MessageDialog 
            setDialogMessage={setDialogMessageRef}
        />
    ), [])

    const payButton = React.useMemo(() => (
        <PrimaryButton 
            onClick={openHandler}>
            Pay
        </PrimaryButton>
    ), [ openHandler ]);

    const updateDebt = async () => {
        try {
            const { list } = await fetchDebtsData();

            setDialog(currentDebt => {
                const result = list.find(item => item.id === currentDebt.id);
                
                return Boolean(result) ? { ...result } : currentDebt;
            })
        }
        catch(err) {
            console.error(err)
        }
    };

    const submitHandler = async () => {
        if(loading) return;
        setLoading(true);

        let dialogMessage = null;

        try {
            const options = {
                ...getAuthorizationHeader(),
                body: JSON.stringify({
                    payments: paymentMethods
                }),
                method: "PUT"
            };

            const { status } = await fetch(`/api/debts/${debt.id}`, options);

            if(status >= 300 || status < 200) throw new Error("");

            await updateDebt();
            
            closeHandler({ forceClose: true });
            setPaymentMethods([]);

            dialogMessage = {
                description: "Payment was successfully made.",
                type: "success",
                title: "Success"
            };

        }
        catch(e) {
            console.error(e);

            dialogMessage = {
                description: e.message,
                type: "error",
                title: "Error"
            };
        }
        finally {
            setLoading(false);
            Boolean(dialogMessage) && setDialogMessageRef.current?.(dialogMessage);
        }
    };

    React.useEffect(() => {
        loadingRef.current = loading;
    }, [ loading ])

    return (
        <>
            { payButton }
            <Dialog
                classes={{ paper: classNames("m-0", classes.paper)}}
                onClose={onClose}
                onOpen={onOpen}>
                <DialogHeader 
                    classes={{ button: "text-white", root: "bg-neutral-700 pl-4 text-gray-100" }}
                    onClose={closeHandler}>
                    Payment methods
                </DialogHeader>
                <div className="px-4 py-6">
                    <div>
                        <ul>
                            {
                                paymentMethods.map(pm => (
                                    <PaymentMethod 
                                        { ...pm }
                                        key={pm.id}
                                    />
                                ))
                            }
                        </ul>
                        {
                            hasPaymentMethodLeft && (
                                <div className="flex justify-center mt-4">
                                    <PrimaryButton
                                        classes={{ button: "mx-auto"}}
                                        endIcon={<AddIcon />}
                                        onClick={addPaymentMethod}>
                                        Add new payment method
                                    </PrimaryButton>
                                </div>
                            )
                        }
                    </div>
                    {
                        canISubmit && (
                            <div className="flex justify-end mt-8">
                                <PrimaryButton
                                    endIcon={<SendIcon />}
                                    onClick={submitHandler}>
                                    { loading ? "Loading..." : "Submit" }
                                </PrimaryButton>
                            </div>
                        )
                    }
                </div>
            </Dialog>
            { messageDialogMemo }
        </>
    )
};

export default PaymentDialog;