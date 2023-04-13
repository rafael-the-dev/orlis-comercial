import * as React from "react";

import { AddStockContext } from "src/context"

import Table from "src/components/table";
import TableRow from "./components/table-row"

const NewStockList = () => {
    const { getProductsList } = React.useContext(AddStockContext);

    const headers = React.useRef([
        { label: "Codigo de barra", value: "barCode" },
        { label: "Nome", value: "name" },
        { label: "Preco de Compra", value: "purchasePrice" },
        { label: "IVA", value: "purchaseVAT" },
        { label: "Total Compra", value: "totalPurchasePrice", helper: el => el.getTotalPurchasePrice() },
        { label: "Quantidade (Unt)", key: "stock", value: "quantity" },
        { label: "Stock Actual", key: "stock", value: "currentStock" },
        { label: "Novo Stock ", key: "stock", value: "total" },
        { label: "Remover", value: "remove" },
    ]);

    const  getBodyRows = React.useCallback(({ page , rowsPerPage }) => {
        const list = getProductsList();

        const result = rowsPerPage > 0 ? list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : list;

        return result.map(product => (
            <TableRow 
                headers={headers}
                key={product.id}
                product={product}
            />
        ))
    }, [ getProductsList ]);
    
    if(getProductsList().length === 0) return <></>;

    return (
        <div className="mt-8">
            <Table 
                data={getProductsList()}
                headers={headers}
                getBodyRows={getBodyRows}
            />
        </div>
    );
};

export default NewStockList;