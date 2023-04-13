import * as React from "react";

import { ExpensesContext, RegisterExpenseContextProvider } from "src/context"

import AddExpenseButton from "./components/new-expense";
import Table from "src/components/default-table";

const ExpensesContainer = () => {
    const { expenses } = React.useContext(ExpensesContext);

    const headers = React.useRef([
        { label: "Date", value: "date" },
        { label: "Category", value: "category" },
        { label: "Paid by", key: "user", value: "firstName" },
        { label: "Total", value: "total" }
    ])

    const linksMemo = React.useMemo(() => (
        <div className="flex justify-end mt-8">
            <RegisterExpenseContextProvider>
                <AddExpenseButton />
            </RegisterExpenseContextProvider>
        </div>
    ), [])

    return (
        <div className="flex flex-col h-full items-stretch justify-between">
            <div>
                <Table  
                    classes={{ tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white" }}
                    data={expenses.list}
                    headers={headers}
                />
            </div>
            { linksMemo }
        </div>
    );
};

export default ExpensesContainer;