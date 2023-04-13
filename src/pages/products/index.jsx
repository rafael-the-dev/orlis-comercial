import { useCallback, useEffect, useRef, useMemo, useState } from "react"
import { Button, TableCell, Typography } from "@mui/material";
import classNames from "classnames";
import { v4 as uuidV4 } from "uuid";

import classes from "./styles.module.css";

import { CategoriesCombobox } from "src/components/products-page"
import Input from "src/components/default-input";
import Link from "src/components/link";
import NewCategoryDialog from "src/components/products-page/new-category-dialog";
import PrimaryButton from "src/components/primary-button";
import Panel from "src/components/panel";
import Table from "src/components/table";
import TableBodyRow from "src/components/products-page/table-row" 

//server side render products and products
export { getProductsAndCategories as getStaticProps } from "src/helpers/server-side";

const Container = ({ categories, productsList }) => {
    const [ categoriesList, setCategoriesList ] = useState([]);
    const [ category, setCategory ] = useState(-1);
    const [ value, setValue ] = useState("");
    
    const headers = useRef([
        { key: "name", label: "Name" },
        { key: "barCode", label: "Barcode" },
        { key: "purchasePrice", label: "Purchase price" },
        { key: "purchaseVAT", label: "Purchase VAT" },
        { key: "sellPrice", label: "Sell price" },
        { key: "sellVAT", label: "Sell VAT" },
        { key: "profit", label: "Profit" }
    ]);

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

    const registerProductLinkMemo = useMemo(() => (
        <PrimaryButton 
            href="register-product"
            variant="outlined">
            Add new product
        </PrimaryButton>
    ), [])

    const title = useMemo(() => <Panel title="Products" />, []);

    const changeHandler = useCallback(e => setValue(e.target.value), []);

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

    const getBodyRows = useCallback(({ page, rowsPerPage }) => {
        const list = rowsPerPage > 0 ? products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : products;

        return (
            <>
                {
                    list.map(row => (
                        <TableBodyRow { ...row } key={row.id}>
                            {
                                headers.current.map(header => (
                                    <TableCell 
                                        align="center"
                                        key={header.value}>
                                        { row[header.key] }
                                    </TableCell>
                                ))
                            }
                        </TableBodyRow>
                    ))
                }
            </>
    )}, [ products ]);

    useEffect(() => {
        setCategoriesList(categories)
    }, [ categories ])

    return (
        <main>
            <div className={classNames(classes.container, "flex flex-col h-full items-stretch justify-between pb-8")}>
                <div>
                    { title }
                    <div className="flex flex-wrap justify-between px-5 py-6">
                        { searchMemo }
                        { categoriesMemo }
                    </div>
                    <div className="px-5">
                        <Table 
                            data={products} 
                            getBodyRows={getBodyRows}
                            headers={headers} 
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-end mt-6 px-5 sm:flex-row">
                    { categoryDialog }
                    { registerProductLinkMemo }
                </div>
            </div>
        </main>
    );
};

export default Container;