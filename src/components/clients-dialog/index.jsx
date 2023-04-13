import * as React from "react";
import classNames from "classnames";

import SearchIcon from '@mui/icons-material/Search';

import classes from "./styles.module.css";

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries";

import Dialog from "../dialog";
import DialogHeader from "../dialog/components/dialog-header";
import Table from "../default-table";

const ClientsContainer = ({ onClick, onClose, onOpen, previousData }) => {
    const [ clients, setClients ] = React.useState({ list: [] });
    const [ value, setValue ] = React.useState("");

    const onCloseRef = React.useRef(null);

    const headers = React.useRef([
        { label: "Name", value: [ "firstName", "lastName" ] },
        { label: "Document", value: "document" },
        { label: "Document Number", value: "documentNumber" }
    ]);

    const clientsList = React.useMemo(() => {
        if(!value.trim()) return clients.list; // reutnr default list if value is empty

        const lowerCasedValue = value.toLowerCase();

        // sort list by client's first or last name
        return clients.list.filter(client => {
            const firstName = client.firstName.toLowerCase();
            const lastName = client.lastName.toLowerCase();
            const documentNumber = client.documentNumber.toLowerCase();

            const isInFirstName = firstName.includes(lowerCasedValue); //check on first name
            const isInLastName = lastName.includes(lowerCasedValue); // check on lastName
            const isInFullName = `${firstName} ${lastName}`.includes(lowerCasedValue);
            const inInDocumentNumber = documentNumber.includes(lowerCasedValue)

            return [ isInFirstName, isInLastName, isInFullName, inInDocumentNumber ].some(el => el);
        });
    }, [ clients, value ])

    const closeHandler = React.useCallback(() => onCloseRef.current?.(), []);
    const changeHandler = React.useCallback(({ target: { value }}) => setValue(value), [])

    const fetchClientsData = React.useCallback(async () => {
        try {
            const { data } = await fetchHelper({ options: getAuthorizationHeader(), url: "/api/clients"});

            if(previousData) previousData.current = data;

            setClients(data);
        } catch(e) {
            console.error(e)
        }
    }, [ previousData ]);

    React.useEffect(() => {
        if(previousData && previousData.current) {
            setClients(previousData.current);
            return;
        }
        fetchClientsData();
    }, [ fetchClientsData, previousData ]);

    React.useEffect(() => {
        onClose.current = closeHandler;
    }, [ closeHandler, onClose ])

    return (
        <Dialog
            classes={{ paper: classNames(classes.paper, "m-0")}}
            onClose={onCloseRef}
            onOpen={onOpen}>
            <DialogHeader
                classes={{ root: "bg-stone-700 pl-2 text-white" }}
                onClose={closeHandler}>
                Clients
            </DialogHeader>
            <div className={classNames(classes.content, "py-6")}>
                <div className="px-5">
                    <div className="border border-solid border-stone-400 flex items-center mb-6 py-1 px-2">
                        <input 
                            className="border-0 grow outline-none py-2"
                            onChange={changeHandler}
                            placeholder="Search by first name, last name or document number"
                            value={value}
                        />
                        <SearchIcon />
                    </div>
                </div>
                <div className={classNames(classes.tableContainer, "overflow-y-auto px-5")}>
                    <Table  
                        classes={{ tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white" }}
                        data={clientsList}
                        headers={headers}
                        onClickRow={onClick}
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default ClientsContainer;