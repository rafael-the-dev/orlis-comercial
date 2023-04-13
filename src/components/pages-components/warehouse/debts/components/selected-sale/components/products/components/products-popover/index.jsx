import * as React from "react";
import currency from "currency.js"

//import { DebtContext } from "src/context";
import { getPriceVAT, getTotalPrice } from "src/helpers/price"

import DefaultTable from "src/components/default-table";
import Popover from "src/components/popover"

const ProductsContainer = ({ onClose, onCloseRef, onOpenRef, sale }) => {
    //const { debt } = React.useContext(DebtContext);

    const headers = React.useRef([ 
        { label: "Name", value: "name" },
        { label: "Quantity", value: "quantity" },
        { label: "Price", value: "totalSellPrice" },
        { label: "Amount", value: "amount" },
        { label: "Total VAT", value: "totalVAT" },
        { label: "Total", value: "total" }
    ]);

    const productsList = React.useMemo(() => (
        !sale ? [] : sale.products.map(({ item, ...rest }) => {
            const amount = currency(rest.quantity).multiply(item.totalSellPrice).value;
            
            return {
                ...item,
                ...rest,
                amount,
                totalVAT: getPriceVAT({ price: item.totalSellPrice, taxRate: item.sellVAT }).value, 
                total: getTotalPrice({ price: amount, taxRate: item.sellVAT })
            };
        })
    ), [ sale ]);
    
    const tableMemo = React.useMemo(() => (
        <div className="w-full">
            <DefaultTable 
                classes={{ tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white", root: "h-full", table: "h-full" }}
                data={productsList}
                headers={headers}
            />
        </div>
    ), [ productsList ]);

    return (
        <Popover
            customClose={onClose}
            onCloseRef={onCloseRef}
            onClickRef={onOpenRef}>
            { tableMemo }
        </Popover>
    );
};

export default ProductsContainer;