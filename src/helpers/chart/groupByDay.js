import currency from "currency.js";
import lodash from "lodash";
import moment from "moment";

const sortByMonth = (list) => {
    return lodash.sortBy(list, item => {
        const months = {
            "January": 1,
            "February": 2,
            "October": 10,
            "November": 11 
        };

        months[Object.keys(item)[0]];
    });
};

const sortByWeek = (list) => {
    const weekDays = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
    };

    return lodash.sortBy(list, item => weekDays[item]);
};

const groupListByDay = ({ data, isWeekly, yAxis }) => {
    const groupedByMonth = lodash.groupBy(data, item => moment(item.date).format("MMMM"));
        
    const result = lodash.map(Object.entries(groupedByMonth), monthTuple => {
        const [ month, listByMonth ] = monthTuple;

        const groupedListByDay = { ...lodash.groupBy(listByMonth, item => moment(item.date).format(isWeekly ? "dddd" : "DD")) };
        lodash.forEach(
            groupedListByDay, 
            (dayList, day) => {
                groupedListByDay[day] = lodash.reduce(dayList, (previousValue, currentItem) => {
                    return {
                        subTotal: currency(previousValue.subTotal).add(currentItem.amount).value, 
                        total: currency(previousValue.total).add(currentItem.total).value, 
                        totalVAT: currency(previousValue.totalVAT).add(currentItem.totalVAT).value
                    };
                }, 
            { subTotal: 0, total: 0, totalVAT: 0 })
        });
        
        return { [month]: groupedListByDay };
    });
    
    return sortByMonth(result);
};

const getSerieData = (categories, list, yAxis, isWeekly ) => {
    const data = [];

    categories.forEach(key => {
        const stringifiedKey = isWeekly ? key : `${ key < 10 ? 0 : ""}${key}`;
        
        if(Object.keys(list).includes(stringifiedKey)) {
            data.push(list[stringifiedKey][yAxis]);
        } else {
            data.push(0);
        }
    });
    
    return data;
};

const getCategories = (groups, isWeekly) => {
    const categories = [ ...new Set(groups.map(group => {
        return Object.keys(Object.values(group)[0])
    }).flatMap(item => item))];

    return isWeekly ? sortByWeek(categories) : categories.map(item => parseInt(item)).sort();
};

const getByChartSeries = ({ categories, groups, isWeekly, yAxis }) => {
    return groups.map(group => {
        const [ name, list ] = Object.entries(group)[0];

        const data = categories.map(key => {
            const stringifiedKey = isWeekly ? key : `${ key < 10 ? 0 : ""}${key}`;
            
            if(Object.keys(list).includes(stringifiedKey)) {
                return list[stringifiedKey][yAxis];
            } 
                
            return 0;
        });
        
        return {
            data,
            name
        }
    })
};

const getChartOptionsGroupedByDay = ({ data, isBarChart, isWeekly, yAxis }) => {
    const groups = groupListByDay({ data, isWeekly, yAxis });

    const categories = getCategories(groups, isWeekly);
    
    const xaxis = {
        categories
    };

    if(isBarChart ) {
        return {
            series: getByChartSeries({ categories, groups, isWeekly, yAxis }),
            xaxis
        }
    }

    return {
        series: groups.map(group => {
            const [ name, list ] = Object.entries(group)[0];

            return {
                data: getSerieData(categories, list, yAxis, isWeekly),
                name
            }
        }),
        xaxis
    };
};

export {
    getChartOptionsGroupedByDay,
    groupListByDay 
}