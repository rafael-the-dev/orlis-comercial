import * as React from "react";
import classNames from "classnames";
import * as cookies from "cookie";

import { SalesReportContext } from "src/context";
import { fetchHelper } from "src/helpers/queries"

import classes from "./styles.module.css"

import Main from "src/components/main";
import { TabButton } from "src/components/reports-page";

export const getServerSideProps = async ({ req: { headers } }) => {
    const { token } = cookies.parse(headers.cookie);
    const options = {
        headers: {
            "Authorization": token
        }
    };

    let sales = { list: [], stats: {} };

    try {
        sales = await fetchHelper({ url: `${process.env.SERVER}/api/sales`, options });
    } catch(e) {
        console.error(e)
    }
   
    return {
        props: {
            sales
        }
    }
} 

const Container = ({ sales }) => {
    const { setGlobalSales, tabs } = React.useContext(SalesReportContext);

    React.useEffect(() => {
        setGlobalSales(sales.data);
    }, [ sales, setGlobalSales ]);

    return (
        <Main className={classNames(classes.main, `bg-zinc-50 grow overflow-y-auto`)}>
            <div className="flex px-5 sm:pb-4 xl:px-8">
                {
                    tabs.map((item, index) => <TabButton { ...item } index={index + 1} key={item.id} />)
                }
            </div>
            <div className={classNames(classes.tabsContentWrapper, "overflow-hidden")}>
                {
                    tabs.map(item => item.element)
                }
            </div>
        </Main>
    );
};

export default Container;