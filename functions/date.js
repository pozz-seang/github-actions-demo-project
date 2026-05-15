
const normalizeDate = date => {
    const [d, m, y] = date.split(/[-/]/).map(Number);
    const year = y < 100 ? 2000 + y : y;
    return `${String(d).padStart(2, '0')}-${String(m).padStart(2, '0')}-${year}`;
};

// check if the date is in the format dd-mm-yyyy and is a valid date ex: 31-02-2021 is invalid and 29-02-2021 is valid as 2021 is a leap year
const isValidDateFormat = (date) =>  {
    const [d, m, y] = date.split('-').map(Number);
    const year = y < 100 ? 2000 + y : y; // Handle 2-digit year as 20xx
    return /^\d{1,2}-\d{1,2}-\d{2,4}$/.test(date) &&
           m > 0 && m < 13 && d > 0 && d <= new Date(year, m - 1, 0).getDate();
}

// convert date to a readable format ex: 2021-09-01T00:00:00.000Z to Wed, 1 Sep 2021 12:00:00 am
const convertToReadableDate = (date) => new Date(date).toLocaleString("en-GB", { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true, }).replace(",", "").replace(",", " at ");

// get today's date in the format dd-mm-yyyy
const getDate = (offset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + offset); // Adjust the date by the offset (e.g., -1 for yesterday)
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
};

module.exports = {
    normalizeDate,
    isValidDateFormat,
    convertToReadableDate,
    getDate
}