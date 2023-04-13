import * as React from "react";
import { Button } from "@mui/material"
import classNames from "classnames";
import currency from "currency.js";
import { v4 as uuidV4 } from "uuid";
import moment from "moment"

import SaveIcon from '@mui/icons-material/Save';

import classes from "./styles.module.css"

import { ComponentsContext, DebtContext } from "src/context";
import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries"
//import { getPriceVAT, getTotalPrice } from "src/helpers/price"

import Dialog from "src/components/dialog";
import DialogHeader from "src/components/dialog/components/dialog-header";
import MessageDialog from "src/components/message-dialog"
import PrimaryButton from "src/components/primary-button";
import PaymentButton from "./components/payment-dialog"
import ProductsPanel from "./components/products";
import PaymentsPanel from "./components/payment-methods"
import Tab from "./components/tab-button"

const SelectedSaleContaienr = () => {
    const { dialog, setDialog } = React.useContext(ComponentsContext);
    const { addDebt, debt } = React.useContext(DebtContext);

    const [ loading, setLoading ] = React.useState(false);
    const [ tab, setTab ] = React.useState("PRODUCTS");

    const hasResponseError = React.useRef(null);
    const onOpen = React.useRef(null);
    const setDialogMessage = React.useRef(null);

    const tabsList = React.useRef([
        { id: "PRODUCTS", label: "Products" },
        { id: "PAYMENT_METHODS", label: "Payment Methods" },
        { id: "OTHERS", label: "Others" }
    ])

    const productsPanelMemo = React.useMemo(() => <ProductsPanel />, []);

    const getDate = React.useCallback(() => {
        if(dialog) return moment(dialog.date).format("DD/MM/YYYY HH:mm:ss");

        return "";
    }, [ dialog ]);

    const closeHelper = React.useCallback(() => {
        if(hasResponseError.current) return;
    }, [])

    const messageDialog = React.useMemo(() => (
        <MessageDialog 
            closeHelper={closeHelper}
            setDialogMessage={setDialogMessage}
        />
    ), [ closeHelper ])

    const closeHandler = React.useCallback(() => setDialog(null), [ setDialog ]);
    const tabClickHandler = React.useCallback(tabId => () => setTab(tabId), []);

    const submitHandler = async () => {
        if(loading) return;

        setLoading(true);
        hasResponseError.current = true;
        
        const options = {
            ...getAuthorizationHeader(),
            body: JSON.stringify({ products: salesChanges.products }),
            method: "PUT"
        }

        try {
            const { status } = await fetch(`/api/sales/${sale.id}`, options);

            if(status >= 300 || status < 200) throw new Error();

            hasResponseError.current = false;
            hasSaleChangedRef.current = true;

            await fetchGlobalSales();

            setSale(null);

            setDialogMessage.current?.(
                {
                    description: "Sale was successfully updated.",
                    type: "success",
                    title: "Success"
                }
            );

            if(queryStringParamsRef.current) {
                refreshSale();
            }
        }
        catch(e) {
            console.error(e)
            setDialogMessage.current?.(
                {
                    description: e.message,
                    type: "error",
                    title: "Error"
                }
            );
        }
        finally {
            setLoading(false)
        }
    };

    React.useEffect(() => {
        dialog && onOpen.current?.();
    }, [ dialog ]);

    return (
        <>
            <Dialog
                classes={{ paper: classNames(classes.dialogPaper, `m-0`)}}
                customClose={closeHandler}
                onOpen={onOpen}>
                <DialogHeader 
                    classes={{ button: "text-white", root: "bg-neutral-700 pl-4 text-gray-100" }}
                    onClose={closeHandler}>
                    { getDate() }
                </DialogHeader>
                <div className={classNames(classes.dialogBody, 'flex flex-col items-stretch')}>
                    <div>
                        {
                            tabsList.current.map((item, index) => (
                                <Tab 
                                    id={item.id}
                                    key={index} 
                                    onClick={tabClickHandler}
                                    selectedTab={tab}
                                >
                                    { item.label }
                                </Tab>
                            ))
                        }
                    </div>
                    <div className={classNames("flex flex-col grow items-stretch justify-between py-6",
                        classes.itemsWrapper)}>
                        <div className={classNames(classes.itemsContainer, "px-5 md:px-4")}>
                            {
                                {
                                    "PAYMENT_METHODS": <PaymentsPanel />,
                                    "PRODUCTS": productsPanelMemo
                                }[tab]
                            }
                        </div>
                        <div className="flex justify-end px-5 md:px-4">
                            <PrimaryButton
                                classes={{ button: "mr-3" }}
                                endIcon={<SaveIcon />}
                                onClick={submitHandler}
                                variant="outlined">
                                { loading ? "Loading..." : "Update" }
                            </PrimaryButton>
                            <PaymentButton />
                        </div> 
                    </div>
                </div>
                { messageDialog }
            </Dialog>
        </>
    );
};

export default SelectedSaleContaienr;