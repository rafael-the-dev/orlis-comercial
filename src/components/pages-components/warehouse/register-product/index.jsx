import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Button, MenuItem, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Input from "src/components/default-input";
import classNames from "classnames";
import moment from "moment";
import { useRouter } from "next/router";
import currency from "currency.js";

import classes from "./styles.module.css";

import { getTotalPrice } from "src/helpers/price";
import { ComponentsContext, WarehouseContext } from "src/context"

import Validation from "src/models/Validation";

import Content from "src/components/scroll-container";
import Checkbox from "src/components/checkbox";
import CancelButton from "src/components/cancel-link"
import Link from "src/components/link";
import MessageDialog from "src/components/message-dialog";
import Panel from "src/components/panel";
import PrimaryButton from "src/components/primary-button"
import PurchasePrice from "src/components/register-product-page/purchase-price"
import SellPrice from "src/components/register-product-page/sell-price"

/**
 *  w12 === w-1/2
 *  w13 === w-1/3
*/

export const getServerSideProps = async ({ params }) => {
     
    return {
      props: {
      }, // will be passed to the page component as props
    }
}

const Container = () => {
    const { setNewPanel } = useContext(ComponentsContext);
    const { categoriesListRef, fetchCategories, productId, productsListRef } = useContext(WarehouseContext);

    const [ available, setAvailable ] = useState(true);
    const [ barCode, setBarCode ] = useState({ errors: [], value: "" })
    const [ category, setCategory ] = useState(null);
    const [ categories, setCategories ] = useState([]);
    const [ date, setDate ] = useState({ errors: [], value: null });
    const [ name, setName ] = useState({ errors: [], value: "" });
    const [ purchasePrice, setPurchasePrice ] = useState({ errors: [], value: "" });
    const [ purchaseVat, setPurchaseVat ] = useState({ errors: [], value: "" });
    const [ sellPrice, setSellPrice ] = useState({ errors: [], price: "" });
    const [ sellVat, setSellVat ] = useState({ errors: [], value: "" });

    const [ loading, setLoading ] = useState(false);
    const { query: { id, role } } = useRouter();

    const availableRef = useRef(false);
    const barCodeRef = useRef("");
    const categoryRef = useRef("");
    const dateRef = useRef("");
    const hasDataChanged = useRef(false);
    const hasResponseError = useRef(false);
    const nameRef = useRef("");
    const purchasePriceRef = useRef(0);
    const purchaseVatRef = useRef(0);
    const sellPriceRef = useRef(0);
    const sellVatRef = useRef(0);

    const setDialogMessage = useRef(null);

    const submitHandler = useCallback((e) => {
        e.preventDefault();

        setLoading(true);
        hasResponseError.current = true;

        const options = {
            body: JSON.stringify({
                available,
                barCode: barCode.value,
                category,
                date: moment(date).toDate().toISOString().slice(0, 19).replace('T', ' '),
                name: name.value,
                purchasePrice: purchasePrice.value,
                purchaseVat: purchaseVat.value,
                sellPrice: sellPrice.value,
                sellVat: sellVat.value 
            }),
            method: Boolean(productId) ? "PUT" : "POST"
        };

        fetch(`/api/products${ Boolean(productId) ? `/${productId}` : "" }`, options)
            .then(res => {
                const { status } = res;
                if((status >= 300) || (status < 200)) throw new Error("Register error");

                hasResponseError.current = false;

                setDialogMessage.current?.({ 
                    description: `Product was successfully ${ productId ? "updated" : "registered" }.`,
                    type: "success",
                    title: "Success"
                });

                // add null to productsList to be able to refresh its list on products' component mount 
                productsListRef.current = null; 

                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setDialogMessage.current?.({
                    description: `Product not ${ productId ? "updated" : "registered or exists" }, try again.`,
                    type: "error",
                    title: "Error"
                });
                setLoading(false);
            })
    }, [ available, barCode, category, date, productId, productsListRef, name, purchasePrice, purchaseVat, sellPrice, sellVat ]);

    const legendMemo = useMemo(() => <Panel title="Cadastro de produto" />, []);

    const nameChangeHandler = useCallback(e => {
        const value = e.target.value;
        const errors = [];

        Validation.checkLength({ min: 2, onError: (error) => errors.push(error), value: value.trim() });

        nameRef.current = value;
        setName({
            errors,
            value
        })
    }, [])

    const nameMemo = useMemo(() => (
        <Input 
            className={classNames(classes.input, classes.w12)}
            label="Nome"
            onChange={nameChangeHandler}
            required
            value={name.value}
            variant="outlined"
        />
    ), [ name, nameChangeHandler ]);

    const categoryChangeHandler = useCallback(e => {
        const { value } = e.target;
        categoryRef.current = value;
        setCategory(value);
    }, [])

    const categoriesMemo = useMemo(() => {
        return (
            <Input
                className={classNames(classes.input, classes.w12)}
                label="Categoria"
                onChange={categoryChangeHandler}
                value={category}
                select>
                {
                    categories.map((item) => (
                        <MenuItem
                            key={item.id}
                            value={item.id}>
                            { item.description }
                        </MenuItem>
                    ))
                }
            </Input>
        );
    }, [ category, categories, categoryChangeHandler ]);

    const barCodeChangeHandler = useCallback((e) => {
        const value = e.target.value.trim();

        barCodeRef.current = value;

        setBarCode({
            errors: [],
            value
        })
    }, []);

    const barCodeMemo = useMemo(() => (
        <Input 
            className={classNames(classes.input, classes.w12)}
            label="Codigo de barra"
            onChange={barCodeChangeHandler}
            required
            value={barCode.value}
            variant="outlined"
        />
    ), [ barCode, barCodeChangeHandler ]);

    const dateChangeHandler = useCallback((value) => {
        dateRef.current = value;
        setDate(value)
    }, []);

    const datePickerMemo = useMemo(() => (
        <DatePicker
            label="Expiry date"
            required
            value={date}
            onChange={dateChangeHandler}
            renderInput={(params) => <Input {...params} className={classNames(classes.input, classes.w12)} />}
        />
    ), [ date, dateChangeHandler ]);
    
    const purchasePriceMemo = useMemo(() => (
        <PurchasePrice
            hasDataChanged={hasDataChanged}
            id={productId}
            purchasePrice={purchasePrice}
            purchasePriceRef={purchasePriceRef}
            setPurchasePrice={setPurchasePrice}
            purchaseVat={purchaseVat}
            purchaseVatRef={purchaseVatRef}
            setPurchaseVat={setPurchaseVat}
        />
    ), [ productId, purchasePrice, purchaseVat ]);

    const messageDialogCloseHelper = useCallback(() => {
        if(hasResponseError.current) return;
        
        if(productId) {
            setNewPanel("PRODUCTS");
            return;
        }

        setBarCode({ errors: [], value: "" })
        setCategory("");
        setName({ errors: [], value: "" });
        setPurchasePrice({ errors: [], value: 0 });
        setSellPrice({ errors: [], value: 0 });
    }, [ productId, setNewPanel ]);

    const messageDialogMemo = useMemo(() => (
        <MessageDialog 
            closeHelper={messageDialogCloseHelper} 
            setDialogMessage={setDialogMessage}
        />
    ), [ messageDialogCloseHelper ])

    const sellPriceMemo = useMemo(() => (
        <SellPrice
        hasDataChanged={hasDataChanged}
            id={productId}
            sellPrice={sellPrice}
            setSellPrice={setSellPrice}
            sellVat={sellVat}
            sellVatRef={sellVatRef}
            setSellVat={setSellVat}
            />
    ), [ productId, sellPrice, sellVat ]);

    const availabilityChangeHandler = useCallback(e => {
        const { checked } = e.target;

        availableRef.current = checked;
        setAvailable(checked);
    }, [])

    const availabilityMemo = useMemo(() => (
        <Checkbox 
            checked={available}  
            label="Disponivel" 
            onChange={availabilityChangeHandler}
        />
    ), [ available, availabilityChangeHandler ]);

    const cancelButton = useMemo(() => (
        <CancelButton 
            classes={{ link: "mr-3" }}
            href="/products"
            type="button">
            Cancelar
        </CancelButton>
    ), [])

    useEffect(() => {
        if(categoriesListRef.current) {
            setCategories(categoriesListRef.current);
            return;
        }

        fetchCategories({ onSuccess: list => setCategories(list) });
    }, [ categoriesListRef, fetchCategories ])

    useEffect(() => {
        
        if(productId) {
            fetch(`/api/products/${productId}`)
                .then(res => res.json())
                .then(product => {
                    hasDataChanged.current = true;

                    setAvailable(Boolean(product.Estado));
                    setBarCode({ errors: [], value: product.barCode })
                    setCategory(product.groupId);
                    setDate({ errors: [], value: product.date });
                    setName({ errors: [], value: product.name });
                    setPurchasePrice({ errors: [], value: product.purchasePrice });
                    setPurchaseVat({ errors: [], value: product.purchaseVAT });
                    setSellVat({ errors: [], value: product.sellVAT });
                    setSellPrice({ errors: [], value: product.sellPrice });
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                })
        }
    }, [ productId, role ])

    return (//
        <form 
            onSubmit={submitHandler}>
            <fieldset className="grow">
                <div className="pb-6">
                    <div className="flex flex-wrap justify-between w-full">
                        { nameMemo }
                        { categoriesMemo }
                    </div>
                    <div className="flex flex-wrap justify-between w-full">
                        { barCodeMemo }
                        { datePickerMemo }
                    </div>
                    <div className="flex flex-wrap justify-between w-full">
                        { purchasePriceMemo }
                        { sellPriceMemo }
                    </div>
                    <div>
                        { availabilityMemo }
                    </div>
                </div>
            </fieldset>
            <div className="flex justify-end">
                { cancelButton }
                { !Boolean(productId) && <PrimaryButton
                        type="submit">
                        { loading ? "Loading..." : "Submeter" }
                    </PrimaryButton>
                }
                { Boolean(productId) && (
                    <PrimaryButton
                        type="submit">
                        { loading ? "Loading..." : "Atualizar" }
                    </PrimaryButton>)
                }
            </div>
            { messageDialogMemo }
        </form>
    );
};

export default Container;