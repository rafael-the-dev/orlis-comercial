import * as React from "react";
import currency from "currency.js";
import IconButton from "@mui/material/IconButton";
import classNames from "classnames";

import classes from "./styles.module.css";

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { AddStockContext } from "src/context";

const Input = ({ headerKey, headerValue, productId }) => {
    const { changeValue, decrementValue, getProductsList, incrementValue } = React.useContext(AddStockContext);

    const product = React.useMemo(() => {
        const result = getProductsList().find(item => item.id === productId);
        
        return result ?? { stock: {} };
    }, [ getProductsList, productId ]);

    const hasQuantityError = currency(product.stock.quantity).value <= 0;

    const handler = React.useCallback(func => (e) => {
        func({ headerKey, headerValue, newValue: e.target.value, productId })
    }, [ headerKey, headerValue, productId ]);
    
    const errorClasses = { "text-red-600": hasQuantityError && headerValue === "quantity" };
   
    return (
        <div className="flex items-center justify-center">
            <IconButton 
                className={classNames("p-0", errorClasses)}
                onClick={handler(decrementValue)}>
                <RemoveIcon className='text-xs' />
            </IconButton>
            <input 
                className={classNames(classes.input, errorClasses, "border-0 outline-none font-semibold py-1 text-center")}
                onChange={handler(changeValue)}
                value={ headerKey ? product[headerKey][headerValue] : product[headerValue] }
            />
            <IconButton 
                className={classNames("p-0", errorClasses)}
                onClick={handler(incrementValue)}>
                <AddIcon className='text-xs' />
            </IconButton>
        </div>
    );
};

export default Input;