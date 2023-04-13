import * as React from "react";
import { IconButton, TableCell, TableRow } from "@mui/material"
import { v4 as uuidV4 } from "uuid";

import DeleteIcon from '@mui/icons-material/Delete';

import { SaleContext } from "src/context"

import Input from "./components/input"

const TableRowContainer = ({ cartItem, headers }) => {
    const { getCart } = React.useContext(SaleContext);

    const removeHandler = () => {
        getCart().remove(cartItem.product.id)
    };

    const getData = (header) => {
       
        switch(header) {
            case "currentStock": return cartItem.product.stock[header]
            case "quantity": { return <Input cartItem={cartItem} quantity={cartItem[header]} /> ; }
            case "subTotal": { return cartItem.getTotal(); }
            case "vatSubTotal": { return cartItem.getTotalVAT();}
            case "delete": { return <div><IconButton className="hover:text-red-600" onClick={removeHandler}><DeleteIcon /></IconButton></div>}
            default: {
                return cartItem.product[header];
            }
        }
    };
    return (
        <TableRow>
            {
                headers.current.map((header) => (
                    <TableCell 
                        align="center"
                        key={header.value}>
                        { getData(header.key) }
                    </TableCell>
                ))
            }
        </TableRow>
    );
};

export default TableRowContainer;