import * as React from "react";
import { Button } from "@mui/material"
import classNames from "classnames";
import currency from "currency.js";
import { v4 as uuidV4 } from "uuid";
import moment from "moment"

import SaveIcon from '@mui/icons-material/Save';

import classes from "./styles.module.css"

import { SalesReportContext, SalesTabContext } from "src/context";
import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries"
import { getPriceVAT, getTotalPrice } from "src/helpers/price"

import DateHighlight from "../date-highlight";
import Dialog from "src/components/dialog";
import DialogHeader from "src/components/dialog/components/dialog-header";
import DefaultTable from "src/components/default-table";
import Highlights from "../../../highlights";
import MessageDialog from "src/components/message-dialog"
import PrimaryButton from "src/components/primary-button";
import Resizeable from "src/components/resizeable"
import Table from "src/components/table";
import TableRow from "../table-row";
import QuantityInput from "./components/input"
import Tab from "./components/tab-button"

const SelectedSaleContaienr = () => {
    const { fetchGlobalSales, hasSaleChangedRef } = React.useContext(SalesReportContext);
    const { 
        getSales, 
        hasChanges, 
        queryStringParamsRef,
        sale, setSale, salesChanges
     } = React.useContext(SalesTabContext);

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

    const headers = React.useRef([ //getBodyRows={getSelectedSaleBodyRows(headers, selectedSale.products)}
        { label: "Name", value: "name" },
        { label: "Quantity", customComponent: ({ item }) => <QuantityInput { ...item } />},
        { label: "Price", value: "totalSellPrice" },
        { label: "Amount", value: "amount" },
        { label: "Total VAT", value: "totalVAT" },
        { label: "Total", value: "total" }
    ]);

    const paymentMethodsHeaders = React.useRef([
        { label: "Payment Method", value: "description" },
        { label: "Amount", value: "amount" },
        { label: "Received", value: "received" },
        { label: "Changes", value: "changes" },
    ]);

    const getDate = React.useCallback(() => {
        if(sale) return moment(sale.date).format("DD/MM/YYYY HH:mm:ss");

        return "";
    }, [ sale ]);

    const closeHelper = React.useCallback(() => {
        if(hasResponseError.current) return;
    }, [])

    const messageDialog = React.useMemo(() => (
        <MessageDialog 
            closeHelper={closeHelper}
            setDialogMessage={setDialogMessage}
        />
    ), [ closeHelper ])

    const productsList = React.useMemo(() => (
        sale.products.map(({ item, ...rest }) => {
            const amount = currency(rest.quantity).multiply(item.totalSellPrice).value;
            
            return {
                ...item,
                ...rest,
                amount,
                totalVAT: getPriceVAT({ price: item.totalSellPrice, taxRate: item.sellVAT }).value, 
                total: getTotalPrice({ price: amount, taxRate: item.sellVAT })
            };
        })
    ), [ sale ])

    const tableMemo = React.useMemo(() => (
        <div className="mb-6 px-5 w-full xl:px-8">
            <DefaultTable 
                classes={{ tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white", root: "h-full", table: "h-full" }}
                data={productsList}
                headers={headers}
            />
        </div>
    ), [ productsList ]);

    const paymentMehtodsList = React.useMemo(() => (
        sale.paymentMethods.map(item => {
            const result = process.env.PAYMENT_METHODS.find(pm => pm.value === item.id);

            return {
                amount: item.amount,
                description: result.label
            }
        })
    ), [ sale ])

    const paymentMethodsTableMemo = React.useMemo(() => (
        <div className="">
            <DefaultTable 
                classes={{ tableFooter: "hidden", tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white", root: "h-full", table: "h-full" }}
                data={paymentMehtodsList}
                headers={paymentMethodsHeaders}
            />
        </div>
    ), [ paymentMehtodsList ]);

    const closeHandler = React.useCallback(() => setSale(null), [ setSale ]);
    const tabClickHandler = React.useCallback(tabId => () => setTab(tabId), []);

    const refreshSale = async () => {
        const options = getAuthorizationHeader();

        const response = await fetchHelper({ options, url: `/api/sales?${queryStringParamsRef.current}` });
        getSales().update(response.data)
    };

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
        sale && onOpen.current?.();
    }, [ sale ]);

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
                                    "PAYMENT_METHODS": paymentMethodsTableMemo,
                                    "PRODUCTS": tableMemo
                                }[tab]
                            }
                        </div>
                        { hasChanges && <div className="flex justify-end px-5 md:px-4">
                            <PrimaryButton
                                endIcon={<SaveIcon />}
                                onClick={submitHandler}>
                                { loading ? "Loading..." : "Update" }
                            </PrimaryButton>
                        </div> }
                    </div>
                </div>
                { messageDialog }
            </Dialog>
        </>
    );
};

export default SelectedSaleContaienr;

/**
 * import * as React from "react";
import { Button } from "@mui/material"
import classNames from "classnames";
import currency from "currency.js";
import { v4 as uuidV4 } from "uuid";
import moment from "moment"

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import classes from "./styles.module.css"

import { SalesTabContext } from "src/context"

import DateHighlight from "../date-highlight";
import DefaultTable from "src/components/default-table";
import Highlights from "../../../highlights";
import PrimaryButton from "src/components/primary-button";
import Resizeable from "src/components/resizeable"
import Table from "src/components/table";
import TableRow from "../table-row"

const SelectedSaleContaienr = () => {
    const { selectedSale, setSelectedSale } = React.useContext(SalesTabContext);

    const headers = React.useRef([ //getBodyRows={getSelectedSaleBodyRows(headers, selectedSale.products)}
        { label: "Name", key: "product", value: "name" },
        { label: "Price", key: "product", value: "price" },
        { label: "Amount", value: "amount" },
        { label: "Total VAT", value: "totalVAT" },
        { label: "Total", value: "total" }
    ]);

    const paymentMethodsHeaders = React.useRef([
        { label: "Payment Method", value: "description" },
        { label: "Amount", value: "amount" },
        { label: "Received", value: "received" },
        { label: "Changes", value: "changes" },
    ])

    const getDate = React.useCallback(() => {
        if(selectedSale.length > 0) return moment(selectedSale[0].date).format("DD/MM/YYYY");

        return "";
    }, [ selectedSale ])

    const dateHighlight = React.useMemo(() => <DateHighlight>{ getDate() }</DateHighlight>, [ getDate ]);

    const saleStats = React.useMemo(() => {
        const stats = {};

        stats.total = currency(selectedSale.products.reduce((previousValue, currentSale) => {
            return currency(currentSale.total).add(previousValue)
        }, 0)).value;

        stats.totalAmount = currency(selectedSale.products.reduce((previousValue, currentSale) => {
            return currency(currentSale.amount).add(previousValue)
        }, 0)).value;

        stats.totalVAT = currency(selectedSale.products.reduce((previousValue, currentSale) => {
            return currency(currentSale.totalVAT).add(previousValue)
        }, 0)).value;

        return stats;
    }, [ selectedSale ])

    const highlightsMemo = React.useMemo(() => (
        <Highlights 
            total={saleStats.total}
            totalAmount={saleStats.totalAmount}
            totalVAT={saleStats.totalVAT}
        />
    ), [ saleStats ]);

    const resizeHelper = React.useCallback((el) => {
        el.current.style.width = "100%";
    }, [])

    const tableMemo = React.useMemo(() => (
        <div className="mb-6 px-5 w-full xl:px-8">
            <Resizeable classes={{ root: "bg-white" }} helper={resizeHelper} key={uuidV4()}>
                <DefaultTable 
                    classes={{ tableHeaderRow: "bg-neutral-700", tableHeadCell: "text-white", root: "h-full", table: "h-full" }}
                    data={selectedSale.products}
                    headers={headers}
                />
            </Resizeable>
        </div>
    ), [ resizeHelper, selectedSale ]);

    const paymentMethodsTableMemo = React.useMemo(() => (
        <div className="mb-6 px-5 w-full xl:px-8">
            <Resizeable classes={{ root: "bg-white" }} helper={resizeHelper} key={uuidV4()}>
                <DefaultTable 
                    classes={{ tableFooter: "hidden", tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white", root: "h-full", table: "h-full" }}
                    data={selectedSale.paymentMethods}
                    headers={paymentMethodsHeaders}
                />
            </Resizeable>
        </div>
    ), [ resizeHelper, selectedSale ]);

    const clickHandler = React.useCallback(() => setSelectedSale([]), [setSelectedSale ])

    return (
        <>
            { dateHighlight }
            <PrimaryButton
                classes={{ button: "mt-4 ml-5 xl:ml-8" }}
                onClick={clickHandler}
                startIcon={<ArrowBackIcon />}>
                Back
            </PrimaryButton>
            <div className="flex flex-wrap justify-between py-8 px-5 xl:px-8">
                { highlightsMemo }
            </div>
            { tableMemo }
            { paymentMethodsTableMemo }
        </>
    );
};

export default SelectedSaleContaienr;
 */