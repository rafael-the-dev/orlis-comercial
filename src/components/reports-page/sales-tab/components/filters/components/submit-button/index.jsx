import * as React from "react";
import Button from "@mui/material/Button";
import classNames from "classnames";
import moment from "moment"

import SearchIcon from '@mui/icons-material/Search';

import { fetchHelper, getAuthorizationHeader } from "src/helpers/queries";
import { SalesTabContext } from "src/context";
import { FilterContext } from "../../context";

import PrimaryButton from "src/components/primary-button"

const ButtonContainer = ({ onClose }) => {
    const { canISubmit, queryStringParams } = React.useContext(FilterContext);
    const { getSales } = React.useContext(SalesTabContext);

    const [ loading, setLoading ] = React.useState(false);
    
    const fetchHandler = () => {
        if(loading || !canISubmit) return;

        setLoading(true);

        const options = getAuthorizationHeader();

        fetchHelper({ options, url: `/api/analytics/sales?${queryStringParams}` })
            .then(response => {
                setLoading(false);
                onClose();
                getSales().update(response.data);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            })
    };

    return (
        <Button
            className={classNames("bg-blue-500 py-2 text-white hover:bg-blue-700")}
            disabled={!canISubmit}
            onClick={fetchHandler}
            startIcon={<SearchIcon />}
            variant="contained">
            { loading ? "Loading..." : "Search" }
        </Button>

    );
};

export default ButtonContainer;