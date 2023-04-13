import * as React from "react";
import classNames from "classnames";

import classes from "./styles.module.css";

import { SalesContext } from "src/context";
import { getCategories, getProducts } from "src/helpers/queries";
import Product from "src/models/client/Product";

import Main from "src/components/main"; //#f9fafbb5
import { OccupiedTablesList, Tabs } from "src/components/appointment";

export const getStaticProps = async () => {
    let categories = [];

    try {
        categories = await getCategories({})
    } catch(e) {
        console.error(e)
    }

    return {
        props: {
            categories
        },
        revalidate: 60
    }
};

const Container = ({ categories }) => {
    const { getPages, setCategories } = React.useContext(SalesContext);

    React.useEffect(() => {
        setCategories(currentCategories => {
            
            if(currentCategories.length > 0) return currentCategories;

            return categories;
        })
    }, [ categories, setCategories ])

    return (
        <Main className={classNames(classes.main, "bg-gray-50 flex align-stretch justify-between p-0")}>
            <OccupiedTablesList />
            <div className="flex flex-col grow items-stretch">
                <Tabs />
                <div className="grow">
                    {
                        getPages().map(item => item.element)
                    }
                </div>
            </div>
        </Main>
    )
};

export default Container;