import * as React from "react";

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries";
import { ComponentsContext } from "src/context"

import PrimaryButton from "src/components/primary-button"
import RegisterClient from "./components/register-client";
import Table from "src/components/default-table";

const ExpensesContainer = () => {
    const { dialog, setDialog } = React.useContext(ComponentsContext);

    const [ clients, setClients ] = React.useState({ list: [] })

    const headers = React.useRef([
        { label: "Name", value: [ "firstName", "lastName" ] },
        { label: "Document", value: "document" },
        { label: "Document Number", value: "documentNumber" }
    ])

    const registerClientButtonMemo = React.useMemo(() => (
        <PrimaryButton
            onClick={() => setDialog(true)}>
            Add new expense
        </PrimaryButton>
    ), [ setDialog ])

    const linksMemo = React.useMemo(() => (
        <div className="flex justify-end mt-8">
            { registerClientButtonMemo }
        </div>
    ), [ registerClientButtonMemo ]);

    const rowClickHandler = React.useCallback(row => () => {
        setDialog(row)
    }, [ setDialog ])

    const fetchClientsData = React.useCallback(async () => {
        try {
            const { data } = await fetchHelper({ options: getAuthorizationHeader(), url: "/api/clients"});
            setClients(data);
        } catch(e) {
            console.error(e)
        }
    }, []);

    React.useEffect(() => {
        fetchClientsData();
    }, [ fetchClientsData ])

    return (
        <div className="flex flex-col h-full items-stretch justify-between">
            <div>
                <Table  
                data={clients.list}
                headers={headers}
                onClickRow={rowClickHandler}
            />
            </div>
            { linksMemo }
            { dialog && <RegisterClient refreshClientsData={fetchClientsData} /> }
        </div>
    );
};

export default ExpensesContainer;