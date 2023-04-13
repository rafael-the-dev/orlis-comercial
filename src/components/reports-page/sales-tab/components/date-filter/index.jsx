import * as React from "react";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Button from "@mui/material/Button";
import classNames from "classnames";
import moment from "moment"

import SearchIcon from '@mui/icons-material/Search';

import classes from "./styles.module.css";

import { FilterContext } from "../filters/context"

import Input from "src/components/default-input"

const DateFilters = () => {
    const { date, setDate } = React.useContext(FilterContext);

    const [ loading, setLoading ] = React.useState(false);

    const changeHandler = React.useCallback((prop) => (newValue) => {
        setDate(currentDate => ({
            ...currentDate,
            [prop]: newValue
        }))
    }, [ setDate ]);

    return (
        <div className="flex flex-wrap items-center">
            <DesktopDatePicker
                className={classNames(classes.datePicker, "input sm:mr-4 sm:mb-0")}
                label="Date"
                value={date.start}
                minDate={moment('2017-01-01')}
                onChange={changeHandler("start")}
                renderInput={(params) => <Input {...params} />}
            />
            { Boolean(date.start) && <DesktopDatePicker
                className={classNames(classes.datePicker, "input sm:mr-4 sm:mb-0")}
                label="End date"
                value={date.end}
                minDate={moment('2017-01-01')}
                onChange={changeHandler("end")}
                renderInput={(params) => <Input {...params} />}
            /> }
        </div>
    );
};

export default DateFilters;