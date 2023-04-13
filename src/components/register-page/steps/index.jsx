import * as React from "react";

import Step from "./components/step";

const Steps = () => {
    const stepsList = React.useRef([
        { label: "Personal details", value: "personal-details" },
        { label: "Address", value: "address" },
        { label: "Identification", value: "identification-document" },
        { label: "Education", value: "education" },
        { label: "Personal details", value: "" }
    ]);

    const stepsMemo = React.useMemo(() => (
        <div className='flex w-fit sm:w-full xl:flex-col'>
            {
                stepsList.current.map((item, index) => (
                    <Step 
                        id={item.value}
                        index={index + 1}
                        label={item.label}
                        key={index} 
                    />
                ))
            }
        </div>
    ), [])

    return (
        <div className="overflow-x-scroll bg-stone-100 h-fit sm:mt-6 sm:overflow-x-hidden sm:rounded-r-xl 
            xl:bg-white xl:mt-0 xl:p-4 xl:rounded-l-xl">
            { stepsMemo }
        </div>
    );
};

export default Steps;