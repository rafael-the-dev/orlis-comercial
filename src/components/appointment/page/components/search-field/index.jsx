import * as React from "react";
import { ClickAwayListener, Paper } from "@mui/material";
import classNames from "classnames";

import classes from "./styles.module.css";

import { SaleContext } from "src/context";
import CartItem from "src/models/client/CartItem"

import Input from "src/components/default-input";
import Table from "./components/table"

const Container = ({ products }) => {
    const { getCart } = React.useContext(SaleContext);

    const [ barCode, setBarCode ] = React.useState("");
    
    const headers = React.useRef([
        { key: "barCode", label: "Codigo de barra" },
        { key: "name", label: "Nome" },
    ]);

    const lastProductRef = React.useRef({});
    const inputRef = React.useRef(null);

    const filteredList = React.useMemo(() => {
        return products.filter(product => product.barCode.includes(barCode));
    }, [ barCode, products ])

    const barCodeChangeHandler = React.useCallback(e => {
        setBarCode(e.target.value);
    }, []);

    const handleClickAway = React.useCallback(() => setBarCode(""), []);

    const inputMemo = React.useMemo(() => (
        <Input 
            className="w-full"
            id="bar-code-input"
            inputRef={inputRef}
            label="Insert bar code"
            onChange={barCodeChangeHandler}
            value={barCode}
        />
    ), [ barCode, barCodeChangeHandler ]);

    React.useEffect(() => {
        if(barCode.trim()) {
            if(lastProductRef.current.barCode === barCode) {
                getCart().incrementQuantity(lastProductRef.current.id)
                setBarCode("");
                return;
            }

            const product = products.find(item => item.barCode === barCode);
            
            if(Boolean(product) && !getCart().hasProduct(product.id)) {
                lastProductRef.current = product;
                getCart().addItem( new CartItem(product, 1));
                setBarCode("");
            }
        }
    }, [ barCode, getCart, products ]);

    React.useEffect(() => {
        if(getCart().list.length === 0) {
            lastProductRef.current = {};
        }
    }, [ getCart ])

    React.useEffect(() => {
        inputRef.current.focus();
    }, [])

    return (
        <div className="input relative w12">
            { inputMemo }
            { Boolean(barCode) && (
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Paper 
                        className={classNames(classes.tableContainer, "absolute bottom-0 left-0 overflow-y-auto w-full")}>
                        <Table 
                            data={filteredList}
                            headers={headers}
                            onClose={handleClickAway}
                        />
                    </Paper>
                </ClickAwayListener>
            )}
        </div>
    );
};

export default Container;