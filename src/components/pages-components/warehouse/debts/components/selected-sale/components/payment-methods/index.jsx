import * as React from "react";

import { ComponentsContext } from "src/context";

import Table from "src/components/default-table";

const PaymentMethods = () => {
    const { dialog } = React.useContext(ComponentsContext);
    const debt = dialog;

    const headers = React.useRef([
        { label: "Date", value: "date" },
        { label: "Amount", value: "amount" },
        { label: "Received", value: "received" },
        { label: "Changes", value: "changes" },
    ]);

    /*const paymentMehtodsList = React.useMemo(() => (
        debt.payments.map(item => {
            const result = process.env.PAYMENT_METHODS.find(pm => pm.value === item.id);

            return {
                amount: item.amount,
                description: result.label
            }
        })
    ), [ debt ])*/

    const paymentMethodsTableMemo = React.useMemo(() => (
        <div className="">
            <Table 
                classes={{ tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white", root: "h-full", table: "h-full" }}
                data={debt.payments}
                headers={headers}
            />
        </div>
    ), [ debt ]);

    return paymentMethodsTableMemo;
};

export default PaymentMethods;