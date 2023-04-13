import * as React from "react";
import { Hidden, Typography } from "@mui/material"
import classNames from "classnames";

import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';

import { CheckoutContext, SaleContext, SalesContext } from "src/context";
import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries"

import PaymentMethod from "../payment-method";

import CancelButton from "src/components/cancel-link";
import DebtPanel from "./components/debt"
import PrimaryButton from "src/components/primary-button";
import Tab from "./components/button";

const CheckoutContainer = ({ onClose, setPanel, salesSerie }) => {
    const { getPaymentMethods } = React.useContext(CheckoutContext);
    const { getTable, savedTableRef } = React.useContext(SaleContext)
    const { fetchProducts, getCurrentPage, removeTable, setSelectedTable } = React.useContext(SalesContext);

    const [ tab, setTab ] = React.useState("PAYMENT_METHOD"); 
    const [ loading, setLoading ] = React.useState(false);

    // the fields are for debt client name and debt description
    const descriptionRef = React.useRef("");
    const clientIdRef = React.useRef(null);

    const onOpenErrorDialog = React.useRef(null);

    const addIconMemo = React.useMemo(() => (
        <Hidden smDown>
            <AddIcon />
        </Hidden>
    ), []);

    const backButtonMemo = React.useMemo(() => (
        <CancelButton
            classes={{ button: "mr-3" }}
            onClick={onClose}>
            Back
        </CancelButton>
    ), [ onClose ]);

    const debtMemo = React.useMemo(() => <DebtPanel />, []);

    const tabClickHandler = React.useCallback(tabValue => () => setTab(tabValue), [])

    const clickHandler = React.useCallback(() => getPaymentMethods().add() , [ getPaymentMethods ]);
        
    const methodsLength = getPaymentMethods().methods?.length;
    const restAmount = getPaymentMethods().amountRemaining();
    const clientChange = getPaymentMethods().getClientChange();
    
    const hasRestAmount = restAmount > 0;
    const hasPaymentMethods = methodsLength > 0;
        
    const submitHandler = async () => {
        setLoading(true);

        const tableId = getTable().id;

        const debt = { client: clientIdRef.current, description: descriptionRef.current };

        const options = {
            ...getAuthorizationHeader(),
            body: JSON.stringify({ 
                ...getPaymentMethods().toLiteral(), 
                debt,
                tableId, 
                barman: getTable().waiter,
            }),
            method: "POST"
        };

        try {
            const result = await fetchHelper({ options, url: `/api/${ tab === "DEBT" ? "debts" : 'sales'}` });
            setLoading(false);
            
            salesSerie.current = result.salesserie;
            setPanel("SUCCESSFULPAYMENT");// open successfull payment panel

            //clear current tab's table table id and waiter
            getTable().id = null;
            getTable().waiter = {};
            savedTableRef.current = null;

            // remove current table from selected tables list 
            setSelectedTable(selectedTablesList => [ ...selectedTablesList.filter(item => item !== tableId) ]);
            removeTable(getCurrentPage()); //remove current table from tables list, current table ID is equal to current tab ID
            
            fetchProducts(); // refresh product after successfull sale
        } catch(e) {
            console.error(e);
            onOpenErrorDialog.current?.();
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full items-stretch">
            <div className="flex">
                <Tab value="PAYMENT_METHOD" tab={tab} onClick={tabClickHandler} >Payment Method</Tab>
                <Tab value="DEBT" tab={tab} onClick={tabClickHandler} >Debt</Tab>
            </div>
            <div className={classNames("flex flex-col grow items-stretch justify-between py-8 px-5")}>
                { tab === "DEBT" ? 
                    (
                        <DebtPanel 
                            descriptionRef={descriptionRef}
                            loading={loading}
                            idRef={clientIdRef}
                            onSubmit={submitHandler}
                        /> 
                    ) : (
                    <>
                        <div className="">
                            {
                                hasPaymentMethods ? 
                                    (
                                        <ul className="">
                                            {
                                                getPaymentMethods().methods?.map(item => (
                                                    <PaymentMethod { ...item } key={item.id} />
                                                ))
                                            }
                                        </ul>
                                    ) : (
                                        <Typography
                                            className="font-bold mb-4 text-center text-lg md:text-2xl">
                                            Without payment method 
                                        </Typography>
                                    )
                            }
                            <div>
                                { hasRestAmount && <Typography 
                                    component="div"
                                    className={classNames("font-semibold uppercase",
                                    hasPaymentMethods ? "text-right" : "text-center" )}>
                                    { hasRestAmount ? (hasPaymentMethods ? "falta" : "Total") : "" }
                                    <span className="ml-2 text-red-500 md:text-2xl">{ restAmount }MT</span>
                                </Typography> }
                                { clientChange > 0 && <Typography
                                    component="div"
                                    className={classNames("font-semibold text-right uppercase")}>
                                    Trocos
                                    <span className="ml-2 text-yellow-500 md:text-2xl">{ clientChange }MT</span>
                                </Typography>}
                            </div>
                            { hasRestAmount && (
                                <div className="flex justify-center mt-4">
                                    <PrimaryButton
                                        onClick={clickHandler}
                                        startIcon={addIconMemo}>
                                        Add new payment method
                                    </PrimaryButton>
                                </div> 
                                )
                            }
                    </div>
                    { restAmount === 0 && <div className="flex justify-end">
                        { backButtonMemo }
                        <PrimaryButton
                            onClick={submitHandler}
                            startIcon={<DoneIcon />}>
                            { loading ? "Loading..." : "Concluir" }
                        </PrimaryButton>
                    </div> }
                    </>
                )}
            </div>
        </div>
    );
};

export default CheckoutContainer;