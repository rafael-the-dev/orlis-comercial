
const getIsoDate = (param) => {
    let date = param;

    if(typeof param === "object") {
        date = param.date;
    }

    const currentDate = new Date(date ?? Date.now());

    const isoDate = currentDate.toISOString();

    return isoDate;
};

const parseId = id => Boolean(id) ? (`${id}`.includes("-") ? id : parseInt(id)) : "";

module.exports = {
    getIsoDate,
    parseId
}