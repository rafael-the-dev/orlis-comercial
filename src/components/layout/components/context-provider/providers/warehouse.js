import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PaidIcon from '@mui/icons-material/Paid';
import ReorderOutlinedIcon from '@mui/icons-material/ReorderOutlined';

import { ComponentsContextProvider, DebtContextProvider, WarehouseContextProvider } from "src/context";

import Debts from "src/components/pages-components/warehouse/debts";
import NewProduct from "src/components/pages-components/warehouse/register-product";
import ProductsList from "src/components/pages-components/warehouse/products";
import Stock from "src/components/pages-components/warehouse/stock";

const tabsList = [
    {
        id: "NEW_PRODUCTS",
        icon: <AddOutlinedIcon />,
        title: "New product",
    },
    {
        id: "PRODUCTS",
        icon: <ReorderOutlinedIcon />,
        title: "Products",
    },
    {
        id: "STOCK",
        icon: <ReorderOutlinedIcon />,
        title: "Stock",
    },
    {
        id: "DEBTS",
        icon: <PaidIcon />,
        title: "Debts"
    }
];

const containersMap = {
    "DEBTS": <DebtContextProvider><Debts /></DebtContextProvider>,
    "NEW_PRODUCTS": <NewProduct />,
    "PRODUCTS": <ProductsList />,
    "STOCK": <Stock />
}

const props = {
    containersMap,
    defaultContainerId: "PRODUCTS",
    tabsList
};

export const getWarehouseContext = children => (
    <ComponentsContextProvider { ...props }>
        <WarehouseContextProvider>
            { children }
        </WarehouseContextProvider>
    </ComponentsContextProvider>
)