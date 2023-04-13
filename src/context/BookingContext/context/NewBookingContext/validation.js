const isNewDateGreaterThanCurrentDate = newDate => new Date(newDate) >= Date.now();

export const isStartDateValid = newDate => isNewDateGreaterThanCurrentDate(newDate);

export const isStartHourValid = newHour => isNewDateGreaterThanCurrentDate(newHour);

// end date must be greater than or equals to start and current date
export const isEndDateValid = ({ endDate, startDate }) => {
    return new Date(endDate) >= new Date(startDate);
};

// end hour must be greater than start and current hour
export const isEndHourValid = ({ endHour, startHour }) => {
    return new Date(endHour) > Date.now(startHour);
};