import classNames from "classnames";

//import classes from "./styles.module.css"

import Highlight from "./components/highlight";

const HighlightsContainer = () => {

    return (
        <div className={classNames(`bg-amber-600 flex flex-wrap items-stretch justify-between 
            py-6 px-4 rounded-xl`)}>
            <Highlight href="/assessments" />
            <Highlight />
            <Highlight />
            <Highlight />
        </div>
    );
};

export default HighlightsContainer;