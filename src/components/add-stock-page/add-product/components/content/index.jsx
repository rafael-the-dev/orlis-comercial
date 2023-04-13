import * as React from "react";
import currency from "currency.js";

import { AddStockContext } from "src/context";

import BarcodeScanner from "./components/barcode-scanner";
import PrimaryButton from "src/components/primary-button"
import Table from "./components/table";
import TextField from "src/components/default-input";

const ContentContainer = ({ productsList }) => {
    const { addProduct, getProductsList } = React.useContext(AddStockContext);

    const [ product, setProduct ] = React.useState(null);

    const productRef = React.useRef(null);
    const quantityInputRef = React.useRef(null);

    const barCodeScannerMemo = React.useMemo(() => <BarcodeScanner productsList={productsList} setProduct={setProduct} />, [ productsList ])
    const tableMemo = React.useMemo(() => product ? <Table product={product} /> : <></>, [ product ]);

    const clickHandler = React.useCallback(() => {
        if(!Boolean(productRef.current)) return;

        addProduct(productRef.current);
        quantityInputRef.current.value = "";
        setProduct(null);
    }, [ addProduct ]);

    const quantityChangeHandler = React.useCallback(e => {
        productRef.current.stock.quantity = e.target.value;
        productRef.current.stock.total = currency(productRef.current.stock.quantity).add(productRef.current.stock.currentStock).value;
    }, [])

    React.useEffect(() => {
        productRef.current = product ? Object.assign(product, {}) : product;
    }, [ product ]);

    return (
        <div>
            <div className="flex flex-wrap justify-between">
                { barCodeScannerMemo }
                <TextField 
                    className="input w12"
                    inputRef={quantityInputRef}
                    label="Quantidade"
                    onChange={quantityChangeHandler}
                    inputProps={{ readOnly: !Boolean(product)}}
                />
            </div>
            { tableMemo }
            <div className="flex justify-end">
                <PrimaryButton
                    disabled={!Boolean(product) || getProductsList().find(item => item.id === product?.id)}
                    onClick={clickHandler}>
                    Adicionar
                </PrimaryButton>
            </div>
        </div>
    );
};

export default ContentContainer;