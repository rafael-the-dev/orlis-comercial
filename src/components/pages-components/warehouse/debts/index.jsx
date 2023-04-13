import * as React from "react";
import classNames from "classnames";
import Typography from "@mui/material/Typography";

import classes from './styles.module.css';
import { ComponentsContext, DebtContext, WarehouseContext } from "src/context"

import ClientSearchField from "./components/search-field";
import ClientsDialog from "src/components/clients-dialog";
import DebtDialog from "./components/selected-sale";
import Table from "src/components/default-table"

const DebtsContainer = () => {
    const { dialog, setDialog } = React.useContext(ComponentsContext);
    const { clientsListRef } = React.useContext(WarehouseContext);
    const { debts } = React.useContext(DebtContext);

    const [ value, setValue ] = React.useState("");

    const onClose = React.useRef(null);
    const onOpen = React.useRef(null);

    const headers = React.useRef([
        { label: "Date", value: "date" },
        { label: "Client", key: "client", value: [ "firstName", "lastName" ] },
        { label: "Sold by", key: "user", value: "firstName" },
        { label: "Total", value: "total" },
        { label: "Remaining Balance", value: "remainingBalance" },
        { label: "Deposit", value: "deposit" }
    ]);

    const rowClickHandler = React.useCallback(client => () => {
        setValue(`${client.firstName} ${client.lastName}`);
        onClose.current?.();
    }, []);

    const clientsDialogMemo = React.useMemo(() => (
        <ClientsDialog 
            onClick={rowClickHandler}
            onClose={onClose} 
            onOpen={onOpen} 
            previousData={clientsListRef}
        />
    ), [ clientsListRef, rowClickHandler ])

    const debtsList = React.useMemo(() => {
        if(!value.trim()) return debts.list; // reutnr default list if value is empty

        const lowerCasedValue = value.toLowerCase();

        // sort list by client's first or last name
        return debts.list.filter(debt => {
            const firstName = debt.client.firstName.toLowerCase();
            const lastName = debt.client.lastName.toLowerCase();

            const isInFirstName = firstName.includes(lowerCasedValue); //check on first name
            const isInLastName = lastName.includes(lowerCasedValue); // check on lastName
            const isInFullName = `${firstName} ${lastName}`.includes(lowerCasedValue);

            return isInFirstName || isInLastName || isInFullName;
        });
    }, [ debts, value ])

    const changeHandler = React.useCallback(({ target: { value }}) => setValue(value), [])
    const clickHandler = React.useCallback(row => () => setDialog(row), [ setDialog ]);
    const openHandler = React.useCallback(() => onOpen.current?.(), [])

    return (
        <div className="flex flex-col h-full items-stretch justify-between">
            <div>
                    <ClientSearchField onChange={changeHandler} onClick={openHandler} value={value} />
                    <Table 
                        classes={{ tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white" }}
                        data={debtsList}
                        headers={headers}
                        onClickRow={clickHandler}
                    />
            </div>
            <div className="flex justify-end mt-6">
                <div className={classNames(classes.analyticsContainer, "bg-neutral-600 p-4")}>
                    <Typography
                        component="h3"
                        className="flex flex-col text-right text-white">
                        <span>Total</span>
                        <span className="font-bold mt-2 text-xl md:text-2xl">{ debts.analytics.total } MT</span>
                    </Typography>
                </div>
            </div>
            { clientsDialogMemo }
            { dialog && <DebtDialog /> }
        </div>
    );
};

export default DebtsContainer;