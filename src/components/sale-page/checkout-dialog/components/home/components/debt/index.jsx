import * as React from "react";

import SearchIcon from '@mui/icons-material/Search';

import Button from "src/components/primary-button";
import ClientSearchDialog from "src/components/clients-dialog";
import TextField from "src/components/default-input"

const DebtContainer = ({ descriptionRef, idRef, loading, onSubmit }) => {
    const [ description, setDescription ] = React.useState("");
    const [ id, setId ] = React.useState(null);
    const [ name, setName ] = React.useState("");

    const onClose = React.useRef(null);
    const onOpen = React.useRef(null);

    const changeHandler = React.useCallback(fn => ({ target: { value } }) => fn(value), []);

    const searchButtonMemo = React.useMemo(() => (
        <Button
            classes={{ button: "justify-between mb-4 w-full" }}
            endIcon={<SearchIcon />}
            onClick={() => onOpen.current?.()}
            variant="outlined">
            Search
        </Button>
    ), []);

    const clientClickHandler = React.useCallback(client => () => {
        setName(`${client.firstName} ${client.lastName}`)
        setId(client.id);
        onClose.current?.();
    }, []);

    const clientsDialogMemo = React.useMemo(() => (
        <ClientSearchDialog 
            onClick={clientClickHandler}
            onClose={onClose}
            onOpen={onOpen}
        />
    ), [ clientClickHandler ])

    React.useEffect(() => {
        descriptionRef.current = description;
    }, [ descriptionRef, description ]);

    React.useEffect(() => {
        idRef.current = id;
    }, [ id, idRef ]);

    return (
        <>
            <div>
                { searchButtonMemo }
                <TextField 
                    className="mb-4"
                    fullWidth
                    label="Full name"
                    onChange={changeHandler(setName)}
                    value={name}
                />
                <TextField 
                    fullWidth
                    label="Description"
                    minRows={6}
                    multiline
                    onChange={changeHandler(setDescription)}
                    value={description}
                />
            </div>
            <div className="flex justify-end">
                { Boolean(id) && (
                    <Button 
                        onClick={onSubmit}>
                        { loading ? "Loading..." : "Submit"}
                    </Button>
                    )
                }
            </div>
            { clientsDialogMemo }
        </>
    );
};

export default DebtContainer;