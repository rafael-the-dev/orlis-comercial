import * as React from "react";
import { ClickAwayListener, Paper } from "@mui/material";
import classNames from "classnames";

import classes from "./styles.module.css";

//import { SaleContext, SalesContext } from "src/context";

import Input from "src/components/default-input";

const Container = ({ productsList, setProduct }) => {
    //const { getProducts } = React.useContext(SalesContext);
    //const { getCart } = React.useContext(SaleContext);

    const [ barCode, setBarCode ] = React.useState("");
    
    const headers = React.useRef([
        { key: "barCode", label: "Codigo de barra" },
        { key: "name", label: "Nome" },
    ]);

    const lastProductRef = React.useRef({});
    const inputRef = React.useRef(null);

    /*const filteredList = React.useMemo(() => {
        return getProducts().filter(product => product.barCode.includes(barCode));
    }, [ barCode, getProducts ]);*/

    const barCodeChangeHandler = React.useCallback(e => {
        setBarCode(e.target.value);
    }, []);

    const handleClickAway = React.useCallback(() => setBarCode(""), []);

    const inputMemo = React.useMemo(() => (
        <Input 
            className="w-full"
            id="bar-code-input"
            inputRef={inputRef}
            label="Insere o codigo de barra"
            onChange={barCodeChangeHandler}
            value={barCode}
        />
    ), [ barCode, barCodeChangeHandler ]);

    React.useEffect(() => {
        if(barCode.trim()) {
            const product = productsList.find(item => item.barCode === barCode);
            
            if(Boolean(product)) {
                setProduct(product);
                setBarCode("");
            }
        }
    }, [ barCode, productsList, setProduct ]);

    /*React.useEffect(() => {
        if(getCart().list.length === 0) {
            lastProductRef.current = {};
        }
    }, [ getCart ])*/

    React.useEffect(() => {
        inputRef.current.focus();
    }, [])

    return (
        <div className="input relative w12">
            { inputMemo }
        </div>
    );
};

export default Container;

/**
 * { Boolean(barCode) && (
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
 */