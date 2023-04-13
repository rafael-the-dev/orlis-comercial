import * as React from "react";
import { TableCell, TableRow } from "@mui/material"
import { v4 as uuidV4 } from "uuid";
import classNames from "classnames";

import { SaleContext } from "src/context";
import CartItem from "src/models/client/CartItem"

const TableRowContainer = ({ headers, onClose, product }) => {
    const { getCart } = React.useContext(SaleContext);

    const isAdded = () => {
        return Boolean(getCart().list.find(cartItem => cartItem.product.id === product.id))
    };

    const clickHandler = () => {
        if(isAdded()) return;

        getCart().addItem( new CartItem(product, 1));
        onClose();
    };

    return (
        <TableRow
            className={classNames("cursor-pointer",
            { "bg-yellow-100 opacity-60": isAdded() })}
            disabled={isAdded()}
            onClick={clickHandler}>
            {
                headers.current.map(header => (
                    <TableCell
                        align="center"
                        key={uuidV4()}>
                        { product[header.key] }
                    </TableCell>
                ))
            }
        </TableRow>
    );
};

export default TableRowContainer;