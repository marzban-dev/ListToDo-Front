const CalculateRemainingTime = (createdDate, completionDate) => {
    const currentDate = Date.now();

    let _creationDate;
    if (createdDate instanceof Date) _creationDate = createdDate.getTime();
    else _creationDate = new Date(createdDate).getTime();

    let _completionDate;
    if (completionDate instanceof Date) _completionDate = completionDate.getTime();
    else _completionDate = new Date(completionDate).getTime();

    const totalTaskTime = _completionDate - _creationDate;
    const remainingTime = _completionDate - currentDate;

    if (remainingTime <= Math.floor(totalTaskTime / 5)) {

        let date = new Date(Math.abs(remainingTime));
        const days = date.getUTCDate() - 1;
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();

        let humanReadableTime = "";
        if (days !== 0) humanReadableTime += `${days} days `
        if (hours !== 0) humanReadableTime += `${hours} hours `
        if (minutes !== 0) humanReadableTime += `${minutes} minutes`

        if (remainingTime < 0) humanReadableTime += " remaining.";
        else humanReadableTime += " ago.";

        return humanReadableTime;
    }
}

export default CalculateRemainingTime;