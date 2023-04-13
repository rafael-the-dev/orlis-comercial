import * as React from "react";
import { v4 as uuidV4 } from "uuid";
import { Button, Checkbox, TableCell } from "@mui/material"

import { SaleContext, SalesContext } from "src/context"

import { CategoriesCombobox } from "src/components/products-page"
import Input from "src/components/default-input";
import PrimaryButton from "src/components/primary-button";
import Table from "src/components/table";
import TableRow from "./components/TableRow";

const Container = ({ onClose }) => {
    const { getCategories, getProducts } = React.useContext(SalesContext);
    const { getCart } = React.useContext(SaleContext);
    
    const [ category, setCategory ] = React.useState(null);
    const [ selectedProducts, setSelectedProducts ] = React.useState([]);
    const [ value, setValue ] = React.useState("");

    const headers = React.useRef([
        { key: "Selecionado", label: "Selecionado" },
        { key: "name", label: "Nome" },
        { key: "sellPrice", label: "Preco" }
    ]);

    const data = React.useMemo(() => {
        let list = getProducts();
        
        if(category && category !== -1) {
            list = list.filter(item => item.categoryId === category);
        }

        if(value.trim() !== "") {
            return list.filter(item => {
                const hasName = item.name.toLowerCase().includes(value.toLowerCase());
                const hasBarCode = item.barCode.includes(value);

                return hasName || hasBarCode;
            });
        }

        return list;
    }, [ category, getProducts, value ])

    const getBodyRows = React.useCallback(({ page , rowsPerPage }) => {
        const list = rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data;

        return (
            <>
                {
                    list.map(row => (
                        <TableRow 
                            headers={headers}
                            key={uuidV4()}
                            row={row}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                        />
                    ))
                }
            </>
        );
    }, [ data, selectedProducts ]);

    const changeHandler = React.useCallback(e => setValue(e.target.value), []);

    const inputMemo = React.useMemo(() => (
        <Input 
            className="input w12"
            label="Pesquisar por nome ou codigo de barra"
            onChange={changeHandler}
            value={value}
        />
    ), [ value, changeHandler ]);

    const categoriesSelectMemo = React.useMemo(() => (
        <CategoriesCombobox 
            className="input w12"
            categories={getCategories()}
            value={category}
            setValue={setCategory}
        />
    ), [ category, getCategories ])

    const clickHandler = React.useCallback(() => {
        setSelectedProducts(list => {
            getCart().addItem(...list);
            return [];
        });
        onClose();
    }, [ getCart, onClose ])

    return (
        <div className="px-4 py-6 md:px-6">
            <form className="flex flex-wrap justify-between">
                { inputMemo }
                { categoriesSelectMemo }
            </form>
            <div>
                <Table 
                    data={getProducts()}
                    getBodyRows={getBodyRows}
                    headers={headers}
                />
            </div>
            {
                selectedProducts.length > 0 && (
                    <div className="flex justify-end mt-8">
                        <PrimaryButton
                            onClick={clickHandler}
                            variant="contained">
                            Adicionar { selectedProducts.length } produto{ selectedProducts.length > 1 && "s"}
                        </PrimaryButton>
                    </div>
                )
            }
        </div>
    );
};

export default Container;