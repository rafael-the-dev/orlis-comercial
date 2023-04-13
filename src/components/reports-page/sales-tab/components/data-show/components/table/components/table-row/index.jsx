import * as React from "react";
import classNames from "classnames"

import { TableCell, TableRow } from "@mui/material";
import moment from "moment";

import { SalesTabContext } from "src/context"

const TableRowContainer = ({ headers, isClickable, row }) => {
    const { setSale } = React.useContext(SalesTabContext);

    const saleRef = React.useRef(null);

    const getCellLabel = ({ key, value }) => {
        if(Boolean(key)) {
            if(value === "methodId") {
                return process.env.PAYMENT_METHODS.find(item => item.value === row[key][value]).label;
            }
            
            return row[key][value];
        }

        if(value === "date") {
            return moment(row[value]).format("DD-MM-YYYY HH:mm:ss");
        } 
        else if(value === "user") {
            return `${row[value]["firstName"]} ${row[value]["lastName"]}`;
        } 

        return row[value];
    };

    const clickHandler = () => {
        if(!Boolean(isClickable)) return;
        setSale(saleRef.current);
    };

    React.useEffect(() => {
        if(row) {
            saleRef.current = {
                ...row,
                products: row.products.map(product => ({
                    ...product,
                    initialValue: product.quantity
                }))
            }
        }
    }, [ row ])

    return (
        <TableRow
            className={classNames("cursor-pointer")}
            onClick={clickHandler}>
            {
                headers.current.map(header => (
                    <TableCell
                        align="center"
                        key={header.value}>
                        { getCellLabel(header) }
                    </TableCell>
                ))
            }
        </TableRow>
    )
};

export default TableRowContainer;