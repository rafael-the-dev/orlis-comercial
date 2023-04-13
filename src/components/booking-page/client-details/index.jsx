import * as React from "react";
import { MenuItem, Typography } from "@mui/material";

import { BookingContext } from "src/context";

import TextField from "src/components/default-input";

const ClientDetails = () => {
    const {
        document, documentNumber,
        firstName,
        lastName,
        setDocument, setDocumentNumber, setFirstName, setLastName
    } = React.useContext(BookingContext);

    const documentsList = React.useRef([
        { label: "BI", value: "bi" },
        { label: "Passaporte", value: "passaporte" },
        { label: "Carta de conducao", value: "carta de conducao" },
    ]);

    const changeHandler = React.useCallback(func => e => {
        const { value } = e.target;
        func({ error: !Boolean(value.trim()), value });
    }, []);

    const documentMemo = React.useMemo(() => (
        <TextField 
            className="input w12"
            error={documentNumber.error}
            helperText={documentNumber.error ? "Campo obrigatorio" : "" }
            label="Numero de documento"
            onChange={changeHandler(setDocumentNumber)}
            required
            value={documentNumber.value}
        />
    ), [ changeHandler, documentNumber, setDocumentNumber ]);

    const documentTypeMemo = React.useMemo(() => (
        <TextField 
            className="input mb-0 w12"
            label="Typo de documento"
            onChange={changeHandler(setDocument)}
            required
            select
            value={document}>
            {
                documentsList.current.map(({ label, value }) => (
                    <MenuItem
                        key={value}
                        value={value}>
                        { label }
                    </MenuItem>
                ))
            }
        </TextField>
    ), [ changeHandler, document, documentsList, setDocument ])

    const firstNameMemo = React.useMemo(() => (
        <TextField 
            className="input w12"
            error={firstName.error}
            helperText={firstName.error ? "Campo obrigatorio" : "" }
            label="Primeiro nome"
            onChange={changeHandler(setFirstName)}
            required
            value={firstName.value}
        />
    ), [ changeHandler, firstName, setFirstName ]);

    const lastNameMemo = React.useMemo(() => (
        <TextField 
            className="input w12"
            error={lastName.error}
            helperText={lastName.error ? "Campo obrigatorio" : "" }
            label="Apelido"
            onChange={changeHandler(setLastName)}
            required
            value={lastName.value}
        />
    ), [ changeHandler, lastName, setLastName ])

    const titleMemo = React.useMemo(() => (
        <Typography
            className="font-semibold mb-4"
            component="h2">
            Dados do cliente
        </Typography>
    ), [])

    return (
        <fieldset className="border border-solid border-stone-200 flex flex-wrap justify-between 
            mt-4 md:mt-0 py-3 px-2 md:p-4 w12">
            { titleMemo }
            <div className="flex flex-wrap justify-between">
                { firstNameMemo }
                { lastNameMemo }
                { documentMemo }
                { documentTypeMemo }
            </div>
        </fieldset>
    );
};

export default ClientDetails;