import * as React from "react";
import {Button} from "@mui/material";
import { useRouter } from "next/router"

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries";

import DefaultTable from "src/components/default-table";
import Link from "src/components/link";
import Main from "src/components/main";
import Panel from "src/components/panel";
import ProductsTable from "src/components/stocks-page/products-table"

const Container = () => {
    const [ invoice, setInvoice ] = React.useState({ provider: {}, products: [], subTotal });

    const providerHeaders = React.useRef([
        { label: "Nome", value: "name" },
        { label: "Endereco", value: "address" },
    ]);

    const statsHeaders = React.useRef([
        { label: "Subtotal", value: "subTotal" },
        { label: "IVA", value: "totalVAT" },
        { label: "Total", value: "total" }
    ]);

    const { products, provider, subTotal, total, totalVAT } = invoice;

    const { query: { id }} = useRouter();

    const backLinkMemo = React.useMemo(() => (
        <Link href="/stocks">
            <Button
                className="border border-solid border-red-600 bg-red-600 text-white hover:bg-transparent hover:border-red-600 hover:text-red-600"
                variant="contained">
                Voltar
            </Button>
        </Link>
    ), []);
    const panelMemo = React.useMemo(() => <Panel />, []);

    const fetchData = React.useCallback(async () => {
        try {
            const data = await fetchHelper({ options: getAuthorizationHeader(), url: `/api/stock-providers-invoices/${id}` });
            setInvoice(data)
        }
        catch(e) {}
    }, [ id ])

    React.useEffect(() => {
        fetchData();
    }, [ fetchData ])

    return (
        <Main>
            { panelMemo }
            <div className="flex flex-col justify-between px-5 xl:px-8 py-6">
                <div>
                    <ProductsTable products={products} />
                    <div className="flex flex-wrap justify-between mt-8">
                        <div className="input w12">
                            <DefaultTable 
                                classes={{ tableFooter: "hidden" }}
                                data={[ provider ]}
                                headers={providerHeaders}
                            />
                        </div>
                        <div className="input w12">
                            <DefaultTable 
                                classes={{ tableFooter: "hidden" }}
                                data={[ { subTotal, total, totalVAT } ]}
                                headers={statsHeaders}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-8">
                    { backLinkMemo }
                </div>
            </div>
        </Main>
    );
};

export default Container;