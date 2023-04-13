import * as React from "react";
import { Collapse, IconButton, Typography } from "@mui/material";
import classNames from "classnames";

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { getTotalPrice } from "src/helpers/price";
import { useVAT } from "../hooks/useVAT";

import Checkbox from "src/components/checkbox";
import Input from "src/components/default-input";

const PurchasePrice = ({ hasDataChanged, id, purchasePrice, purchasePriceRef, purchaseVat, setPurchasePrice, setPurchaseVat, purchaseVatRef }) => {
    const [ isVATIncluded, setIsVATIncluded ] = React.useState(true);
    const [ open, setOpen ] = React.useState(true);
    
    useVAT({ hasDataChanged, isVATIncluded, setIsVATIncluded, setVAT: setPurchaseVat, vat: purchaseVat.value })

    const toggleHandler = React.useCallback(() => setOpen(b => !b), [])

    const legendMemo = React.useMemo(() => (
        <Typography
            component='legend'
            className="font-bold text-lg md:text-xl">
            Purchase price
        </Typography>
    ), [])
    
    const purchasePriceChangeHandler = React.useCallback(e => {
        const { value } = e.target;
        const errors = [];

        purchasePriceRef.current = value;

        setPurchasePrice({
            errors,
            value
        })
    }, [ purchasePriceRef, setPurchasePrice ])

    const purchasePriceMemo = React.useMemo(() => (
        <Input 
            className="input w13"
            label="Preco de compra"
            onChange={purchasePriceChangeHandler}
            required
            value={purchasePrice.value}
            variant="outlined"
        />
    ), [ purchasePrice, purchasePriceChangeHandler ]);


    const purchaseVatChangeHandler = React.useCallback(e => {
        const errors = [];
        const { value } = e.target;

        purchaseVatRef.current = value;

        setPurchaseVat({
            errors,
            value
        })
    }, [ purchaseVatRef, setPurchaseVat ])

    const purchaseVatMemo = React.useMemo(() => (
        <Input 
            className="input w13"
            inputProps={{ readOnly: isVATIncluded }}
            label="Iva de compra"
            onChange={purchaseVatChangeHandler}
            required
            value={purchaseVat.value}
            variant="outlined"
        />
    ), [ isVATIncluded, purchaseVatChangeHandler, purchaseVat ]);

    const totalPurchasePrice = React.useMemo(() => {        
        return getTotalPrice({ price: purchasePrice.value, taxRate: purchaseVat.value })
    }, [ purchasePrice, purchaseVat ])

    const totalPurchasePriceMemo = React.useMemo(() => (
        <Input 
            className="input w13"
            inputProps={{ readOnly: true }}
            label="Total purchase price"
            required
            value={totalPurchasePrice}
            variant="outlined"
        />
    ), [ totalPurchasePrice ]);

    const checkboxChangeHandler = React.useCallback(() => setIsVATIncluded(b => !b), []);

    const checkboxMemo = React.useMemo(() => (
        <Checkbox 
            checked={isVATIncluded}
            label="VAT Included"
            onChange={checkboxChangeHandler}
        />
    ), [ checkboxChangeHandler, isVATIncluded ]);

    React.useEffect(() => {
        const newValue = { 
            errors: [],
            value: 0
        };

        if(isVATIncluded) setPurchaseVat({ ...newValue, value: 17 });
        else setPurchaseVat(newValue);
    }, [ isVATIncluded, setPurchaseVat ])

    return (
        <fieldset className={classNames("border border-solid border-stone-200 pl-3 py-2 w-full", { "pb-0": open})}>
            <div className="flex items-center justify-between">
                { legendMemo }
                <IconButton onClick={toggleHandler}>
                    { open ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
                </IconButton>
            </div>
            <Collapse className="mt-4" unmountOnExit in={open}>
                <div className="flex flex-wrap justify-between pr-3">
                    { purchasePriceMemo }
                    { purchaseVatMemo }
                    { totalPurchasePriceMemo }
                </div>
                { checkboxMemo }
            </Collapse>
        </fieldset>
    );
};

export default PurchasePrice;