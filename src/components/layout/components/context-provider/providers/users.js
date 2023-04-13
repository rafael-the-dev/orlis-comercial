import BadgeIcon from '@mui/icons-material/Badge';
import GroupIcon from '@mui/icons-material/Group';

import { ComponentsContextProvider, ExpensesContextProvider } from "src/context";

import Clients from "src/components/pages-components/users/clients"
import Employees from "src/components/pages-components/users/employees";


const tabsList = [
    {
        id: "CLIENTS",
        icon: <GroupIcon />,
        title: "Clients",
    },
    {
        id: "EMPLOYEES",
        icon: <BadgeIcon />,
        title: "Employees"
    }
];

const containersMap = {
    "CLIENTS": <Clients />,
    "EMPLOYEES": <Employees />
}

const props = {
    containersMap,
    defaultContainerId: "EMPLOYEES",
    tabsList
};

export const getUsersContext = children => (
    <ComponentsContextProvider { ...props }>
        { children }
    </ComponentsContextProvider>
)