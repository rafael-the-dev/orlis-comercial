import * as React from "react";
import { v4 as uuidV4 } from "uuid";
import classNames from "classnames";
import { Checkbox, TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";

import { FilterContext } from "src/components/reports-page/sales-tab/components/filters/context"

import CartItem from "src/models/client/CartItem";

const CustomCheckbox = styled(Checkbox)({
    '&.Mui-checked': {
        color: "#dc2626"
    }
});

const TableRowContainer = ({ headers, row }) => {
    const { selectedProducts, setSelectedProducts } = React.useContext(FilterContext);

    const isSelected = () => Boolean(selectedProducts.find(item => item.id === row.id));

    const added = () => {
        return Boolean(selectedProducts.find(item => item.id === row.id));
    };

    const isAdded = added();

    const handler = () => {
        setSelectedProducts(list => {
            if(Boolean(list.find(item => item.id === row.id))) {
                return [ ...list.filter(item => item.id !== row.id) ]
            }

            return [ ...list, row ];
        })
    };

    return (
        <TableRow 
            className={classNames(isAdded ? "bg-yellow-100 opacity-60" : "cursor-pointer hover:bg-stone-100")}
            onClick={handler}>
            {
                headers.current.map((header, index) => (
                    index === 0 ? (
                        <TableCell 
                            align="center"
                            key={uuidV4()}>
                            <CustomCheckbox 
                                checked={isSelected()} 
                            />
                        </TableCell>
                    ) :
                    <TableCell 
                        align="center"
                        key={uuidV4()}>
                        { row[header.key] }
                    </TableCell>
                ))
            }
        </TableRow>
    );
};

export default TableRowContainer;