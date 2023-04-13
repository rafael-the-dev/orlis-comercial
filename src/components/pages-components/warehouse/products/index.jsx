import { useCallback, useContext, useEffect, useRef, useMemo, useState } from "react"
import { Button, TableCell, Typography } from "@mui/material";
import classNames from "classnames";
import { v4 as uuidV4 } from "uuid";
import { useRouter } from  "next/router"

import classes from "./styles.module.css";

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries";
import { ComponentsContext, WarehouseContext } from "src/context"

import { CategoriesCombobox } from "src/components/products-page"
import DefaultTable from "src/components/default-table"
import Input from "src/components/default-input";
import Link from "src/components/link";
import NewCategoryDialog from "src/components/products-page/new-category-dialog";
import PrimaryButton from "src/components/primary-button";
import Panel from "src/components/panel";
import Table from "src/components/table";
import TableBodyRow from "src/components/products-page/table-row" 


const Container = () => {
    const { setNewPanel } = useContext(ComponentsContext);
    const { categoriesListRef, fetchCategories, productsListRef, setProductId } = useContext(WarehouseContext);

    const productsInitialState = useCallback(() => {
        return productsListRef.current ?? [];
    }, [ productsListRef ]);

    const categoriesInitialState = useCallback(() => {
        return categoriesListRef.current ?? [];
    }, [ categoriesListRef ]);

    const [ categoriesList, setCategoriesList ] = useState(categoriesInitialState);
    const [ category, setCategory ] = useState(-1);
    const [ productsList, setProductsList ] = useState(productsInitialState);
    const [ value, setValue ] = useState("");
    
    const headers = useRef([
        { value: "name", label: "Name" },
        { value: "barCode", label: "Barcode" },
        { value: "purchasePrice", label: "Purchase price" },
        { value: "purchaseVAT", label: "Purchase VAT" },
        { value: "sellPrice", label: "Sell price" },
        { value: "sellVAT", label: "Sell VAT" },
        { value: "profit", label: "Profit" }
    ]);

    const router = useRouter();

    const products = useMemo(() => {
        let list = productsList;
        
        if(category && category !== -1) {
            list = list.filter(item => item.groupId === category);
        }

        if(value.trim()) {
            list = list.filter(item => {
                const isName = item.name.toLowerCase().includes(value.toLowerCase());
                const isBarCode = item.barCode.includes(value);

                return isName || isBarCode;
            })
        }

        return list;
    }, [ category, productsList, value ]);

    const categoryDialog = useMemo(() => <NewCategoryDialog setCategories={setCategoriesList} />, []);

    const goToRegisterPanel = useCallback(() => setNewPanel("NEW_PRODUCTS"), [ setNewPanel ]);

    const registerProductLinkMemo = useMemo(() => (
        <PrimaryButton 
            classes={{ button: "mb-3 sm:mb-0" }}
            onClick={goToRegisterPanel}>
            Add new product
        </PrimaryButton>
    ), [ goToRegisterPanel ])

    const changeHandler = useCallback(e => setValue(e.target.value), []);

    const rowClickHandler = useCallback(row => () => {
        //router.push(`/register-product?id=${row.id}&role=edit`)
        setProductId(row.id);
        goToRegisterPanel()
    }, [ goToRegisterPanel, setProductId ]);

    const searchMemo = useMemo(() => (
        <Input 
            className={classNames(classes.searchField)}
            label="Pesquisar"
            onChange={changeHandler}
            required
            value={value}
            variant="outlined"
        />
    ), [ changeHandler, value ]);

    const categoriesMemo = useMemo(() => {
        return ( 
            <CategoriesCombobox 
                className={classNames(classes.categories)} 
                categories={categoriesList}
                value={category} 
                setValue={setCategory} 
            />
        )
            
    }, [ category, categoriesList, setCategory ]);

    useEffect(() => {
        if(categoriesListRef.current) {
            return;
        }

        fetchCategories({ onSuccess: list => setCategoriesList(list) });
    }, [ categoriesListRef, fetchCategories ])

    useEffect(() => {
        if(productsListRef.current) {
            return;
        }

        const fetchProducts = async () => {
            try {
                const data = await fetchHelper({ options: getAuthorizationHeader(), url: "/api/products"});
                productsListRef.current = data;
                setProductsList(data);
            } catch(e) {
                console.error(e)
            }
        };

        fetchProducts();
    }, [ productsListRef ])

    return (
        <div className={classNames(classes.container, "flex flex-col h-full items-stretch justify-between")}>
            <div>
                <div className="flex flex-wrap justify-between">
                    { searchMemo }
                    { categoriesMemo }
                </div>
                <div className="">
                    <DefaultTable 
                        classes={{ tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white" }}
                        data={products} 
                        headers={headers} 
                        onClickRow={rowClickHandler}
                    />
                </div>
            </div>
            <div className="flex flex-col mt-12 pb-4 sm:flex-row-reverse">
                { registerProductLinkMemo }
                { categoryDialog }
            </div>
        </div>
    );
};

export default Container;