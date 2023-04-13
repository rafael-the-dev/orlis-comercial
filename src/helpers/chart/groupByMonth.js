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

const group = (data) => {
    const groupedByYear = lodash.groupBy(data, item => moment(item.date).format("YYYY"));
    
    const result = {};

    lodash.forEach(Object.entries(groupedByYear), yearTuple => {
        const [ year, listByYear ] = yearTuple;

        const groupedListByMonth = { ...lodash.groupBy(listByYear, item => moment(item.date).format("MMMM")) };
        
        lodash.forEach(
            groupedListByMonth, 
            (monthList, month) => {
                groupedListByMonth[month] = lodash.reduce(monthList, (previousValue, currentItem) => {
                    return {
                        subTotal: currency(previousValue.subTotal).add(currentItem.amount).value, 
                        total: currency(previousValue.total).add(currentItem.total).value, 
                        totalVAT: currency(previousValue.totalVAT).add(currentItem.totalVAT).value
                    };
                }, 
            { subTotal: 0, total: 0, totalVAT: 0 })
        });
        
        result[year] = groupedListByMonth;
    });

    return result;
};

const getSerieData = (categories, list, yAxis) => {
    const data = [];

    categories.forEach(key => {
        if(Object.keys(list).includes(key)) {
            data.push(list[key][yAxis]);
        } else {
            data.push(0);
        }
    });
    
    return data;
};

const getBarChartSeries = (categories, groups, yAxis) => {
    return Object.entries(groups).map(groupTuple => {
        const [ name, list ] = groupTuple;

        return {
            data: categories.map(category => {
                
                    if(Object.keys(list).includes(category)) {
                        return list[category][yAxis];
                    }

                    return 0;

                }
            ),
            name
        }
    })
};

const getCategories = (groups) => {
    const categories = [ ...new Set(Object.values(groups).flatMap(item => Object.keys(item)))];

    return sortByMonth(categories);
};

const groupByMonth = ({ data, isBarChart, yAxis }) => {
    const groups = group(data);
    
    const categories = getCategories(groups);
    const xaxis = { categories };

    if(isBarChart) {
        return {
            series: getBarChartSeries(categories, groups, yAxis),
            xaxis
        };
    }

    return {
        series: Object.entries(groups).map(tuple => {
            const [ name, list ] = tuple;
            
            return {
                data: getSerieData(categories, list, yAxis),
                name
            }
        }),
        xaxis
    };
};

export {
    groupByMonth
};