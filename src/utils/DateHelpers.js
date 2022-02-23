import {Duration} from "luxon";

export const CalculateRemainingTime = (createdDate, completionDate) => {
    const currentDate = Date.now();

    let _creationDate;
    if (createdDate instanceof Date) _creationDate = createdDate.getTime(); else _creationDate = new Date(createdDate).getTime();

    let _completionDate;
    if (completionDate instanceof Date) _completionDate = completionDate.getTime(); else _completionDate = new Date(completionDate).getTime();

    return {
        remaining: _completionDate - currentDate,
        passed: (_completionDate - _creationDate) - (_completionDate - currentDate),
        total: _completionDate - _creationDate
    };
}

export const ConvertToHumanReadableDate = (dateTime) => {
    const duration = Duration.fromMillis(dateTime).shiftTo('months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds').toObject()

    let readableDate = "";
    if (duration.months !== 0) readableDate += `${Math.abs(duration.months)}month/`;
    if (duration.days !== 0) readableDate += `${Math.abs(duration.days)}day & `;
    if (duration.hours !== 0) readableDate += `${Math.abs(duration.hours)} : `;
    if (duration.minutes !== 0) readableDate += `${Math.abs(duration.minutes)} : `;
    readableDate += `${Math.abs(duration.seconds)}`;

    return {readableDate, isLeft: !(duration.seconds < 0)};
}