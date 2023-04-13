import * as React from "react";

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries"

import CancelLink from "src/components/cancel-link";
import Content from "src/components/scroll-container";
import Main from "src/components/main";
import Panel from "src/components/panel";
import PrimaryButton from "src/components/primary-button";
import Table from "src/components/default-table";

import { RegisterProvider } from "src/components/stock-providers-page"

const Container = () => {
    const [ providersList, setProvidersList ] = React.useState([]);

    const headers = React.useRef([
        { label: "Name", value: "name" },
        { label: "NUIT", value: "nuit" },
        { label: "Address", value: "address" },
    ]);

    const onOpenDialog = React.useRef(null);
    const setSupplierIdRef = React.useRef(null);

    const filteredList = () => providersList;

    const openHandler = React.useCallback(() => onOpenDialog.current?.(), []);

    const rowClickHandler = React.useCallback(row => () => {
        setSupplierIdRef.current?.(row.id);
        openHandler()
    }, [ openHandler ])

    const cancelLinkMemo = React.useMemo(() => <CancelLink classes={{ link: "mr-4" }} href="/warehouse?tab=stock" />, [])

    const openDialogButtonMemo = React.useMemo(() => (
        <PrimaryButton onClick={openHandler}>
            Register
        </PrimaryButton>
    ), [ openHandler ]);

    const panel = React.useMemo(() => (
        <Panel 
            component="h1"
            title="Stock suppliers"
        />
    ), []);
    
    const fetchData = React.useCallback(async () => {
        try {
            const data = await fetchHelper({ options: getAuthorizationHeader(), url: "/api/stock-providers"});
            setProvidersList(data);
        } catch(e) {

        }
    }, []);

    const registerSupplierMemo = React.useMemo(() => (
        <RegisterProvider 
            onOpen={onOpenDialog}
            onSuccess={fetchData} 
            setSupplierIdRef={setSupplierIdRef}
        />
    ), [ fetchData ])

    React.useEffect(() => {
        fetchData()
    }, [ fetchData ]);

    return (
        <Main>
            { panel }
            <Content>
                <Table 
                    data={filteredList()}
                    headers={headers}
                    onClickRow={rowClickHandler}
                />
                <div className="flex items-stretch justify-end">
                    { cancelLinkMemo }
                    { openDialogButtonMemo }
                </div>
            </Content>
            { registerSupplierMemo }
        </Main>
    );
};

export default Container;