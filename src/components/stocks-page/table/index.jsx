import * as React from "react";

import Table from "src/components/table";
import TableRow from "./components/table-row";

const TableContainer = ({ invoicesList }) => {
    const headers = React.useRef([
        { label: "Data", value: "date" },
        { label: "Referencia da fatura", value: "reference" },
        { label: "Nome do fornecedor", key: "supplier", value: "name" },
        { label: "Endereco", key: "supplier", value: "address" },
        { label: "IVA", value: "totalVAT" },
        { label: "Subtotal", value: "subTotal" },
        { label: "Total", value: "total" }
    ]);
    
    const getBodyRows = ({ page, rowsPerPage }) => {
        const list = rowsPerPage > 0 ? invoicesList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : invoicesList;

        return list.map(item => (
            <TableRow 
                headers={headers}
                invoice={item}
                key={item.providerInvoiceId}
            />
        ))
    };

    return (
        <div>
            <Table 
                classes={{ tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white" }}
                data={invoicesList}
                headers={headers}
                getBodyRows={getBodyRows}
            />
        </div>
    );
};

export default TableContainer;