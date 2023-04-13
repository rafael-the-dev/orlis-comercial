import * as React from "react";
import { FormControl, FormControlLabel, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import classNames from "classnames";
import { v4 as uuidV4 } from "uuid";
import moment from "moment";

import classes from "./styles.module.css"

import { formatDates } from "src/helpers/date";
import { SalesTabContext } from "src/context"

import Chart from "../../../chart"
import Resizeable from "src/components/resizeable";
import Table from "./components/table"

const Container = () => {
    const { getSales } = React.useContext(SalesTabContext);

    const [ value, setValue ] = React.useState("TABLE")

    const controls = React.useRef([
        { label: 'Table', value: "TABLE" },
        { label: 'Chart', value: "CHART" }
    ]);

    const changeHandler = React.useCallback(e => setValue(e.target.value), []);

    const getSalesDate = React.useCallback(() => {
        return getSales().list.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
    }, [ getSales ]);

    const chartMemo = React.useMemo(() => <Chart />, [])
    const tableMemo = React.useMemo(() => <Table />, [])

    const titleMemo = React.useMemo(() => (
        <Typography
            component="h2"
            className="font-bold text-xl">
            Sales { value === "TABLE" ? "list" : "chart" } { formatDates(getSalesDate()) }
        </Typography>
    ), [ getSalesDate, value ]);
    
    const hasRange = React.useCallback(() => {
        const list = getSalesDate();

        const format = date => moment(date).format("DD/MM/YYYY");

        if(list.length > 1) {
            return format(list[0].date) !== format(list[list.length - 1].date);
        }

        return false;
    }, [ getSalesDate ])

    const resizeHandler = React.useCallback((el) => {
        if(Boolean(el.current)) el.current.style.width = "100%";
    }, []);

    React.useEffect(() => {
        if(!hasRange()) {
            setValue("TABLE")
        }
    }, [ hasRange ])

    return (
        <Resizeable classes={{ root: "bg-white" }} onResize={resizeHandler} helper={resizeHandler}>
            <Paper 
                className="flex flex-col h-full overflow-y-auto w-full"
                elevation={0}>
                <div className="flex flex-col justify-between p-4 sm:flex-row sm:items-center">
                    { titleMemo }
                    <FormControl>
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
                                        disabled={ item.value === "CHART" && !hasRange() }
                                        key={item.value}
                                    />
                                ))
                            }
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className={classNames(classes.tableContainer, "w-full")}>
                    { value === "TABLE" ? tableMemo : chartMemo }
                </div>
            </Paper>
        </Resizeable>
    );
};

export default Container;