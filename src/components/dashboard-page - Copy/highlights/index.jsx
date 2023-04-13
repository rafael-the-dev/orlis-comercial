import classNames from "classnames";

import AssessmentIcon from "public/images/icons/activity-assessment.svg"
import GroupIcon from '@mui/icons-material/Group';
import Person2Icon from '@mui/icons-material/Person2';

import classes from "./styles.module.css"

import Highlight from "./components/highlight";

const HighlightsContainer = () => {

    return (
        <div className={classNames(classes.container, `bg-stone-100 flex flex-wrap items-stretch justify-between 
            mt-12 py-6 px-4 rounded-xl`)}>
            <Highlight href="/assessments" icon={<AssessmentIcon />} />
            <Highlight />
            <Highlight icon={<GroupIcon />} title="Classes" />
            <Highlight icon={<Person2Icon />} title="Profile" />
        </div>
    );
};

export default HighlightsContainer;
