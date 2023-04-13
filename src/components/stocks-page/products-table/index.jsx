import * as React from "react";

import Table from "src/components/table";
import TableRow from "src/components/table/components/table-row";

const ProductsTable = ({ products }) => {
    const headers = React.useRef([
        { label: "Codigo de barra", value: "barCode" },
        { label: "Nome", value: "name" },
        { label: "Quantity", value: "quantity" },
        { label: "Preco", value: "price" },
        { label: "IVA", value: "vat" },
        { label: "Total", value: "total" },
    ]);

    const getBodyRows = ({ page, rowsPerPage }) => {
        const list = rowsPerPage > 0 ? products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : products;


        return list.map(row => (
            <TableRow 
                headers={headers}
                key={row.id}
                row={row}
            />
        ))
    };

    return (
        <div>
            <Table 
                data={products}
                headers={headers}
                getBodyRows={getBodyRows}
            />
        </div>
    );
};

export default ProductsTable;