import * as React from "react";
import { IconButton, TableCell, TableRow } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';

import { AddStockContext } from "src/context";

import Input from "./components/Input"

const TableRowContainer = ({ headers, product }) => {
    const { removeProduct } = React.useContext(AddStockContext);

    const removeHandler = React.useCallback(() => removeProduct(product.id), [ product, removeProduct ])

    const getLabel = (header) => {
        const { helper, key, value } = header;

        if([ "purchasePrice", "quantity", "purchaseVAT" ].includes(value)) {
            return (
                <Input 
                    headerKey={key}
                    headerValue={value}
                    productId={product.id}
                />
            )
        } 
        else if(value === "remove") {
            return (
                <IconButton 
                    className="p-1 hover:text-red-600"
                    onClick={removeHandler}>
                    <DeleteIcon />
                </IconButton>
            )
        }

        return helper ? helper(product) : (key ? product[key][value] : product[value]);
    };

    return (
        <TableRow>
            {
                headers.current.map(header => 
                    (
                        <TableCell align="center" key={header.value}>
                            { getLabel(header) }
                        </TableCell>
                    )
                )
            }
        </TableRow>
    );
};

export default TableRowContainer;