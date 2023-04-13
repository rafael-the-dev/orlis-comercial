import * as React from "react";
import { Button, TextField } from "@mui/material";
import classNames from "classnames";
import ReactDOMServer from "react-dom/server";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';

import classes from "./styles.module.css";
import { CheckoutContextProvider, SalesContext, SaleContext } from "src/context";

import AddTableDialog from "./components/add-table"
import BarmenList from "./components/add-table/components/barmen-list"
import CancelLink from "src/components/cancel-link";
import Checkout from "src/components/sale-page/checkout-dialog"
import Link from "src/components/link";
import PrimaryButton from "src/components/primary-button";
import Receipt from "src/components/sale-page/receipt"

import { AddProductButton, SearchField, CartTable }  from "src/components/sale-page"

const PageContainer = ({ id }) => {
    const { addTable, getCurrentPage } = React.useContext(SalesContext);
    const { getCart, getTable, hasBookedTable, hasQuantityError } = React.useContext(SaleContext);

    const productsHeaders = React.useRef([
        { label: "Nome", value: "name" },
        { label: "Qty", value: "quantity" },
        { label: "Price", value: "sellPrice" },
        { label: "Total", value: "total" }
    ])

    const onOpenDialog = React.useRef(null);

    const hasItems = React.useMemo(() => getCart().list.length >= 1, [ getCart ]);
    const hasTable = React.useMemo(() => {
        return getTable().waiter ? Object.keys(getTable().waiter).length > 0 : false;
    }, [ getTable ])

    const addProductButtonMemo = React.useMemo(() => <AddProductButton />, []);
    const addTableDialogMemo = React.useMemo(() => <AddTableDialog />, [])
    const cartTableMemo = React.useMemo(() => <CartTable />, []);

    const homeLinkMemo = React.useMemo(() => (
        <CancelLink 
            classes={{ button: "h-full" }}
            href="/"
            variant="outlined">
            Back
        </CancelLink>
    ), []);

    const resetHandler = React.useCallback(() => getCart().reset(), [ getCart ]);

    const checkoutDialogMemo = React.useMemo(() => (
        <CheckoutContextProvider>
            <Checkout onOpen={onOpenDialog} />
        </CheckoutContextProvider>
    ), [])
    
    const resetCartButtonMemo = React.useMemo(() => (
        <CancelLink
            classes={{ button: "mx-4" }}
            onClick={resetHandler}
            startIcon={<DeleteIcon />}
            variant="contained">
            Reset
        </CancelLink>
    ), [ resetHandler ]);

    const printHandler = React.useCallback(() => {
        const productsList = getCart().list.map(item => item.toLiteral());

        const stats = { 
            subTotal: getCart().getSubTotal(), 
            totalVAT: getCart().getTotalVAT(),  
            total: getCart().getTotal(),
        };

        const iframeElement = document.querySelector("#print-iframe");
        iframeElement.srcdoc = ReactDOMServer.renderToString(<Receipt products={productsList} productsHeaders={productsHeaders} stats={stats} />);
        
        iframeElement.onload = () => {
            iframeElement.focus();
            iframeElement.contentWindow.print();
        };
    }, [ getCart ]);

    const printButton = React.useMemo(() => (
        <Button
            className={classNames("border-blue-500 ml-3 text-blue-500")}
            onClick={printHandler}
            startIcon={<PrintIcon />}
            variant="outlined">
            Print
        </Button>
    ), [ printHandler ])
        
    const saveHandler = React.useCallback(() => {
        // add current select table to tables list
        addTable({ 
            cart: [ ...getTable().cart.list ],
            name: getTable().name,
            tableId: getTable().id,
            waiter: { ...getTable().waiter }
        });
        //clear current tab's table id and waiter
        getTable().id = null;
        getTable().waiter = {};

        resetHandler(); // reset cart items
    }, [ addTable, getTable, resetHandler ])

    const saveTableMemo = React.useMemo(() => (
        <PrimaryButton
            onClick={saveHandler}
            startIcon={<SaveIcon />}>
            Save
        </PrimaryButton>
    ), [ saveHandler ])

    const searchFieldMemo = React.useMemo(() => <SearchField />, []);

    const keydownHandler = React.useCallback((e) => {
        //
        if(e.key.toLowerCase() === "enter") e.preventDefault();
    }, []);

    const submitHandler = React.useCallback((e) => {
        e.preventDefault();

        if(!hasItems || hasQuantityError) return;

        onOpenDialog.current?.();
    }, [ hasItems, hasQuantityError ]);

    return (
        <div className={classNames("flex-col grow h-full items-stretch justify-between", 
            getCurrentPage() === id ? "flex" : "hidden")}>
            <div className="flex px-8">
                <div
                    className={classNames(classes.cartContainer, "grow rounded-lg px-3 py-4")}
                    elevation={0}>
                    <div className="flex justify-between mb-8 xl:items-start xl:mb-0">
                        { searchFieldMemo }
                        <div className="flex items-stretch">
                            { addTableDialogMemo }
                            { addProductButtonMemo }
                        </div>
                    </div>
                    <div>
                        { cartTableMemo }
                    </div>
                </div>
            </div>
            <div>
                <div className="py-2 px-8">
                    <div className="flex">
                        { homeLinkMemo }
                        { hasItems && printButton }
                        { hasItems && resetCartButtonMemo }
                        { hasItems && !hasBookedTable() && hasTable && saveTableMemo }
                    </div>
                </div>
                <div className="flex items-stretch justify-between">
                    <div className="grow bg-stone-200"></div>
                    <Button 
                        className={classNames(classes.paymentButton, `bg-blue-700 font-bold text-white text-xl 
                        rounded-none hover:bg-blue-900 disabled:bg-blue-700`)}
                        disabled={!hasItems || hasQuantityError}
                        onClick={submitHandler}>
                        Pay { getCart().getTotal() }MT
                    </Button>
                </div>
            </div>
            { checkoutDialogMemo }
        </div>
    );
};

export default PageContainer;