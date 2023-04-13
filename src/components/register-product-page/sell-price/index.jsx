import * as React from "react";
import { Collapse, IconButton, Typography } from "@mui/material";
import classNames from "classnames";

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { getTotalPrice } from "src/helpers/price";
import { useVAT } from "../hooks/useVAT"

import Checkbox from "src/components/checkbox";
import Input from "src/components/default-input";

const SellPrice = ({ hasDataChanged, id, sellPrice, sellVat, sellVatRef, setSellPrice, setSellVat }) => {
    const [ isVATIncluded, setIsVATIncluded ] = React.useState(true);
    const [ open, setOpen ] = React.useState(true);
    
    useVAT({ hasDataChanged, isVATIncluded, setIsVATIncluded, setVAT: setSellVat, vat: sellVat.value })

    const toggleHandler = React.useCallback(() => setOpen(b => !b), [])

    const totalSellPrice = React.useMemo(() => {
        return getTotalPrice({ price: sellPrice.value, taxRate: sellVat.value })
    }, [ sellVat, sellPrice ]);

    const legendMemo = React.useMemo(() => (
        <Typography
            component='legend'
            className="font-bold text-lg md:text-xl">
            Sell price
        </Typography>
    ), [])

    const sellPriceChangeHandler = React.useCallback(e => {
        const errors = [];
        const { value } = e.target;

        setSellPrice({
            errors, 
            value
        })
    }, [ setSellPrice ])

    const sellPriceMemo = React.useMemo(() => (
        <Input 
            className="input w13"
            label="Preco de venda"
            onChange={sellPriceChangeHandler}
            required
            value={sellPrice.value}
            variant="outlined"
        />
    ), [ sellPrice, sellPriceChangeHandler ]);

    const sellVatChangeHandler = React.useCallback(e => {
        const errors = [];
        const { value } = e.target;

        sellVatRef.current = value;

        setSellVat({
            errors,
            value
        })
    }, [ sellVatRef, setSellVat ])

    const sellVatMemo = React.useMemo(() => (
        <Input 
            className="input w13"
            inputProps={{ readOnly: isVATIncluded }}
            label="Iva de venda"
            onChange={sellVatChangeHandler}
            required
            value={sellVat.value}
            variant="outlined"
        />
    ), [ isVATIncluded, sellVat, sellVatChangeHandler ]);

    const totalSellPriceMemo = React.useMemo(() => (
        <Input 
            className="input w13"
            inputProps={{ readOnly: true }}
            label="Total sell price"
            required
            value={totalSellPrice}
            variant="outlined"
        />
    ), [ totalSellPrice ]);

    const checkboxChangeHandler = React.useCallback(() => setIsVATIncluded(b => !b), []);

    const checkboxMemo = React.useMemo(() => (
        <Checkbox 
            checked={isVATIncluded}
            label="VAT Included"
            onChange={checkboxChangeHandler}
        />
    ), [ checkboxChangeHandler, isVATIncluded ]);

    return (
        <fieldset className={classNames("border border-solid border-stone-200 mt-6 mb-3 pl-3 py-2 w-full", { "pb-0": open})}>
            <div className="flex items-center justify-between">
                { legendMemo }
                <IconButton onClick={toggleHandler}>
                    { open ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
                </IconButton>
            </div>
            <Collapse className="mt-4" unmountOnExit in={open}>
                <div className="flex flex-wrap justify-between pr-3">
                    { sellPriceMemo }
                    { sellVatMemo }
                    { totalSellPriceMemo }
                </div>
                { checkboxMemo }
            </Collapse>
        </fieldset>
    );
};

export default SellPrice;