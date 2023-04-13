import * as React from "react";
import Button from "@mui/material/Button";
import currency from "currency.js";
import ReactDOMServer from "react-dom/server";

import classes from "./styles.module.css"

import { CheckoutContext } from "src/context";
import { fetchHelper } from "src/helpers/queries"

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrintIcon from '@mui/icons-material/Print';

import CancelButton from "src/components/cancel-link";
import PrimaryButton from "src/components/primary-button";
import Receipt from "src/components/sale-page/receipt"

const SuccessfulPaymentPanel = ({ onClose, salesSerie, setPanel }) => {
    const { getPaymentMethods } = React.useContext(CheckoutContext);

    const [ receipt, setReceipt ] = React.useState(null);

    const closeHandler = () => {
        getPaymentMethods().cart.reset();
        getPaymentMethods().reset();
        setPanel("PAYMENTMETHODS")
        onClose();
    };

    const printHandler = () => {
        const iframeRef = document.querySelector("#print-iframe");
        closeHandler();

        iframeRef.focus();
        iframeRef.contentWindow.print();
    };

    const fetchData = React.useCallback(async () => {
        const options = {
            baseURL: process.env.SERVER,
            headers: {
                Authorization: JSON.parse(localStorage.getItem(process.env.LOCAL_STORAGE)).user.token,
            },
        };

        try {
            /*const { data } = await fetchHelper({ options, url: `/api/sales/${salesSerie.current}` });

            if(!data) return;

            const receiptTemp = { ...data };
            receiptTemp.products = receiptTemp.products.map(product => ({ 
                ...product, 
                ...product.item, 
                totalAmount: currency(product.item.totalSellPrice).multiply(product.quantity).value
            }));*/

            //setReceipt(receiptTemp);
            //document.querySelector("#print-iframe").srcdoc = ReactDOMServer.renderToString(<Receipt { ...receiptTemp } />);
        } catch(e) {
            console.error(e)
        }
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [ fetchData ]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex grow items-center justify-center">
                <CheckCircleIcon className={classes.icon} />
            </div>
            <div className="flex justify-end p-4">
                <PrimaryButton 
                    classes={{ button: "mr-3" }}
                    disabled={!Boolean(receipt)}
                    onClick={printHandler}
                    variant="outlined"
                    startIcon={<PrintIcon />}>
                    Print
                </PrimaryButton>
                <CancelButton
                    onClick={closeHandler}
                    hideLink
                    variant="contained">
                    Close
                </CancelButton>
            </div>
        </div>
    );
};

export default SuccessfulPaymentPanel;

/**>
                { Boolean(receipt) && createPortal(<Receipt { ...receipt } />, iframeRef.current?.contentWindow?.document?.body) }
            </iframe */