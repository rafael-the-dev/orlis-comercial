import moment from "moment";

export const formatDates = (list) => {

    const formatDate = dateParam => moment(dateParam).format("DD/MM/YYYY");

    if(list.length === 0) return formatDate(Date.now());

    if(list.length > 1) {
        const firstDate = formatDate(list[0].date);
        const lastDate = formatDate(list[list.length - 1].date);

        if(firstDate === lastDate) {
            if(firstDate === formatDate(Date.now())) return `Today  -  ${firstDate}`;

            return firstDate;
        }

        return `${firstDate} - ${lastDate}`;
    } else {
        const date = formatDate(new Date(list[0]?.date));

        if(date === formatDate(Date.now())) return `Today  -  ${date}`;

        return date;
    }
};

export const resetTime = (dateTime) => {
    dateTime.hours(0);
    dateTime.minutes(0);
    dateTime.seconds(0);
    dateTime.milliseconds(0);
};

export const resetDate = ({ endDate, startDate }) => {
    const firstDate = startDate ?? Date.now();
    const from = moment(firstDate)
    const to = moment(endDate ? ( startDate ? endDate : Date.now() ) : firstDate)

    resetTime(from);

    resetTime(to);
    to.add(1, 'days');
    
    return {
        "date": { $gte: from.toISOString(), $lt: to.toISOString() }
    };
};