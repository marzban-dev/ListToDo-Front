export const CalculateRemainingTime = (createdDate, completionDate) => {
    const currentDate = Date.now();

    let _creationDate;
    if (createdDate instanceof Date) _creationDate = createdDate.getTime();
    else _creationDate = new Date(createdDate).getTime();

    let _completionDate;
    if (completionDate instanceof Date) _completionDate = completionDate.getTime();
    else _completionDate = new Date(completionDate).getTime();

    return {
        remaining: _completionDate - currentDate,
        total: _completionDate - _creationDate
    };
}

export const ConvertToHumanReadableDate = (dateTime) => {
    let date = new Date(Math.abs(dateTime));
    const months = date.getUTCMonth();
    const days = date.getUTCDate() - 1;
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    let humanReadableTime = "";
    if (months !== 0) humanReadableTime += `${months} months `;
    if (days !== 0) humanReadableTime += `${days} days `;
    if (hours !== 0) humanReadableTime += `${hours} hours `;
    if (minutes !== 0) humanReadableTime += `${minutes} minutes`;

    if (dateTime < 0) humanReadableTime += " remaining.";
    else humanReadableTime += " ago.";

    return humanReadableTime;
}