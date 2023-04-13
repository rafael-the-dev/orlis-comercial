import * as React from "react"
import classNames from "classnames";

import classes from "./styles.module.css"

import { FilterContext } from "../../context"

import { CategoriesCombobox } from "src/components/products-page"
import Input from "src/components/default-input";
import Table from "./components/table";

const ProductSearchField = () => {
    const { categoriesList, productsList } = React.useContext(FilterContext);

    const [ category, setCategory ] = React.useState(-1);
    const [ value, setValue ] = React.useState("");

    const changeHandler = React.useCallback(e => setValue(e.target.value), []);

    const products = React.useMemo(() => {
        let list = productsList;
        
        if(category && category !== -1) {
            list = list.filter(item => item.groupId === category);
        }

        if(value.trim()) {
            list = list.filter(item => {
                const isName = item.name.toLowerCase().includes(value.toLowerCase());
                const isBarCode = item.barCode.includes(value);

                return isName || isBarCode;
            })
        }

        return list;
    }, [ category, productsList, value ]);

    const categoriesMemo = React.useMemo(() => {
        return ( 
            <CategoriesCombobox 
                className={classNames(classes.categories)} 
                categories={categoriesList}
                value={category} 
                setValue={setCategory} 
            />
        )

    }, [ category, categoriesList, setCategory ]);

    
    const searchMemo = React.useMemo(() => (
        <Input 
            className={classNames(classes.searchField)}
            label="Pesquisar"
            onChange={changeHandler}
            required
            value={value}
            variant="outlined"
        />
    ), [ changeHandler, value ]);

    return (
        <div>
            <div className="flex flex-wrap justify-between">
                { searchMemo }
                { categoriesMemo }
            </div>
            <Table data={products} />
        </div>
    );
};

export default ProductSearchField;