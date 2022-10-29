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
    const duration = Duration.fromMillis(dateTime).shiftTo('days', 'hours', 'minutes', 'seconds', 'milliseconds').toObject()

    let readableDate = "";
    if (duration.days !== 0) readableDate += `${Math.abs(duration.days)} day and `;
    if (duration.hours !== 0) readableDate += `${Math.abs(duration.hours)}h : `;
    if (duration.minutes !== 0) readableDate += `${Math.abs(duration.minutes)}m : `;
    readableDate += `${Math.abs(duration.seconds)}s`;

    return {readableDate, isLeft: !(duration.seconds < 0)};
}