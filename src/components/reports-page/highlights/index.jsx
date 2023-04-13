import classNames from "classnames";

import classes from "./styles.module.css"

import Highlight from "../highlight";

const HightlightsContainer = ({ expenses, isHome, total, totalAmount, totalProfit, totalVAT }) => {

    return (
        <div className={classNames(classes.hightlightsContainer, "flex flex-wrap items-stretch justify-between",
        { [classes.hightlightsContainerOthers]: !Boolean(isHome)})}>
            <Highlight color="rgb(146 199 227 / 71%)" description={totalProfit} title="Profit" />
            <Highlight color="#cbd5e1" description={total} title="Total" />
            <Highlight color="#e2e8f0" description={expenses} title="Expenses" />
            <Highlight color="#e5e5e5" description={totalVAT} title="Total VAT" />
        </div>
    );
};

export default HightlightsContainer;