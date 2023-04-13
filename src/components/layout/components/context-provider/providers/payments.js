import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import PaidIcon from '@mui/icons-material/Paid';
import ReorderOutlinedIcon from '@mui/icons-material/ReorderOutlined';

import { ComponentsContextProvider, ExpensesContextProvider } from "src/context";

import Expenses from "src/components/pages-components/payments/expenses"
import Stock from "src/components/pages-components/payments/stock";

const tabsList = [
    {
        id: "STOCK_INVOICES",
        icon: <ReorderOutlinedIcon />,
        title: "Stock",
    },
    {
        id: "EXPENSES",
        icon: <PaidIcon />,
        title: "Expenses"
    }
];

const containersMap = {
    "STOCK_INVOICES": <Stock />,
    "EXPENSES": <ExpensesContextProvider><Expenses /></ExpensesContextProvider>
}

const props = {
    containersMap,
    defaultContainerId: "STOCK_INVOICES",
    tabsList
};

export const getPaymentsContext = children => (
    <ComponentsContextProvider { ...props }>
        {/*<WarehouseContextProvider>*/}
            { children }
        {/*</WarehouseContextProvider> */}
    </ComponentsContextProvider>
)