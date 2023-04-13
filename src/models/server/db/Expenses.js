const currency = require("currency.js");

const { getIsoDate } = require("src/helpers");
const { resetDate } = require("src/helpers/date");

class Expenses {

    static async getAll({ endDate, filter, startDate }, { mongoDbConfig: { collections }}) {
        const dateFilter = resetDate({ endDate, startDate });
        const matchStage = { $match: filter ?? { ...dateFilter } };

        let expenses = await collections.EXPENSES
            .aggregate([
                matchStage,
                {
                    $lookup: {
                        as: "user",
                        from: 'users',
                        foreignField: "id",
                        localField: "user"
                    }
                },
                { $unwind: "$user" }
            ])
            .toArray();

        expenses = expenses.map(item => 
            {
                const { _id, user, ...rest } = item;
                const { logs, password, ...userRest } = user;

                return {
                    ...rest,
                    user: userRest
                };
            }).sort((a, b) => {
                const aDate = new Date(a.date);
                const bDate = new Date(b.date);

                return bDate - aDate;
            });

        const total = expenses.reduce((preValue, currentExpense) => {
            return currency(currentExpense.total).add(preValue).value;
        }, 0);

        return { 
            analytics: {
                total
            },
            list: expenses 
        };
    }

    static async insert({ category, products }, { mongoDbConfig: { collections }, user }) {
        const total = products.reduce((prevValue, { description, price }) => {
            return currency(price).add(prevValue).value
        }, 0);

        const expense = {
            category,
            date: getIsoDate({}),
            products,
            total,
            user: user.id
        };

        await collections.EXPENSES.insertOne(expense);
    }
}

module.exports = Expenses;