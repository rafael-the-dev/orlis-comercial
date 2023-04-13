import * as React from "react";
import { Collapse, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup } from "@mui/material";

import BarmanFilter from "./components/barman-filter";
import DatePicker from "../date-filter";
import ProductFilter from "./components/product-search-field";
import SubmitButton from "./components/submit-button";
import TableFilter from './components/table-filter';
import UserFilter from './components/user-filter'

const FiltersContainer = ({ onToggle }) => {
    const [ open, setOpen ] = React.useState(false);
    const [ value, setValue ] = React.useState("DATE");

    const controls = React.useRef([
        { label: 'Date', value: "DATE" },
        { label: 'Product', value: "PRODUCT" },
        { label: 'Table', value: "TABLE" },
        { label: 'User', value: "USERS" },
        { label: 'Barman', value: "BARMAN" }
    ]);

    const changeHandler = React.useCallback(e => setValue(e.target.value), []);

    const barmenFilterMemo = React.useMemo(() => <BarmanFilter />, []);
    const datePickerMemo = React.useMemo(() => <DatePicker />, []);
    const productFilterMemo = React.useMemo(() => <ProductFilter />, []);
    const submitButton = React.useMemo(() => <SubmitButton onClose={() => setOpen(false)} />, []);
    const tableFilterMemo = React.useMemo(() => <TableFilter />, []);
    const userFilterMemo = React.useMemo(() => <UserFilter />, [])

    const childrenList = React.useRef({
        "BARMAN": barmenFilterMemo,
        "DATE": datePickerMemo,
        "PRODUCT": productFilterMemo,
        'TABLE': tableFilterMemo,
        'USERS': userFilterMemo
    })

    const filtersMemo = React.useMemo(() => (
        <Paper 
            className="p-4"
            elevation={0}>
            <FormControl>
                <FormLabel id="filters-title">Filters</FormLabel>
                <RadioGroup
                    aria-labelledby="filters-title"
                    name="radio-buttons-group"
                    row
                >
                    {
                        controls.current.map(item => (
                            <FormControlLabel 
                                { ...item } 
                                control={<Radio checked={value === item.value} onChange={changeHandler} />} 
                                key={item.value}
                            />
                        ))
                    }
                </RadioGroup>
            </FormControl>
            <div className="pt-3">
                { childrenList.current[value] }
            </div>
            <div className="flex mt-8">
                { submitButton }
            </div>
        </Paper>
    ), [ changeHandler, submitButton, value ])

    React.useEffect(() => {
        onToggle.current = () => setOpen(b => !b);
    }, [ onToggle ]);

    return (
        <Collapse className="mb-8" in={open} unmountOnExit>
            { filtersMemo }
        </Collapse>
    );
};

export default FiltersContainer;