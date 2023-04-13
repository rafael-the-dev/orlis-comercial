import * as React from "react";
import { IconButton, MenuItem } from "@mui/material"
import { v4 as uuidV4 } from "uuid";
import classNames from "classnames"

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

import classes from "./styles.module.css";

import { DebtContext } from "src/context"

import Input from "src/components/default-input";
import currency from "currency.js";

const PaymentMethodContainer = ({ amount, id, paymentMethodId, received }) => {

    const { paymentMethods, setPaymentMethods } = React.useContext(DebtContext);

    // received value must not be less than amount
    const isReceivedAmountValid = currency(received).value >= currency(amount).value;

    const methods = process.env.PAYMENT_METHODS;
    
    const filter = (item) => {
        if(item.value === paymentMethodId) return true;

        // take selected payment methods ids
        const methodsIds = paymentMethods.map(pm => pm.paymentMethodId);

        //return true if item was not selected in any payment method
        return !methodsIds.includes(item.value)
    };

    const changeHelper = ({ onSuccess }) => {
        setPaymentMethods(currentPaymentMethods => {
            const list = [ ...currentPaymentMethods ];

            //pm ==> payment method
            const pm = list.find(item => item.id === id);

            if(!pm) return currentPaymentMethods; // return old payments if pm is not found

            // execute onSuccess method if pm is found
            onSuccess({ pm });

            return list;

        })
    };

    // prop param stands for receive or change property of the payment
    const changeHandler = prop => (e) => { //pm ==> payment method
        changeHelper(
            {
                onSuccess: ({ pm }) => {
                    const newAmout = e.target.value.trim();

                    pm[prop] = newAmout;
                }
            }
        );
    };

    const changeMethodHandler = (e) => {
        changeHelper(
            {
                onSuccess: ({ pm }) => {
                    const newMethod = e.target.value;

                    pm.paymentMethodId = newMethod;
                }
            }
        );
    };

    const removeHandler = () => {
        setPaymentMethods(currentPaymentMethods => {
            return [ ...currentPaymentMethods.filter(item => item.id !== id) ];
        })
    };

    return (
        <li>
            <div className="flex items-center justify-between w-full">
                <Input
                    className={classNames(classes.select)}
                    label="Metodo de pagamento"
                    onChange={changeMethodHandler}
                    select
                    value={paymentMethodId}
                    variant="outlined"
                    >
                    {
                        methods
                            .filter(filter)
                            .map(item => (
                            <MenuItem key={item.value} value={item.value}>
                                { item.label }
                            </MenuItem>
                        ))
                    }
                </Input>
                <Input 
                    className={classes.input}
                    label="Insere o valor"
                    onChange={changeHandler("amount")}
                    value={amount}
                    variant="outlined"
                />
                <Input 
                    className={classes.input}
                    error={!isReceivedAmountValid}
                    label="Valor recebido"
                    onChange={changeHandler("received")}
                    value={received}
                    variant="outlined"
                />
                <div className="flex">
                    <IconButton 
                        className="hover:text-red-600" 
                        onClick={removeHandler}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            </div>
        </li>
    );
};

export default PaymentMethodContainer;