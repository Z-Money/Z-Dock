export function setDateTime() {
    // Get current date and create variables
    let d = new Date();
    let time = "";
    let dateText = d.toLocaleString("en-US", { dateStyle: "medium" });
    const estHours = d.getHours();
    const estMinutes = d.getMinutes();

    // Set up formatter for timeString
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York", // EST
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    // Format time to check period time ranges against
    const timeString = formatter.format(new Date());
    const [hours, minutes] = timeString.split(":").map(Number);


    // Define periods time ranges
    const period1 = { start: { hours: 7, minutes: 30 }, end: { hours: 8, minutes: 20 } };
    const period2 = { start: { hours: 8, minutes: 25 }, end: { hours: 9, minutes: 15 } };
    const period3 = { start: { hours: 9, minutes: 20 }, end: { hours: 10, minutes: 10 } };
    const period4 = { start: { hours: 10, minutes: 15 }, end: { hours: 11, minutes: 40 } };
    const lunch = { start: { hours: 10, minutes: 40 }, end: { hours: 11, minutes: 10 } }
    const period5 = { start: { hours: 11, minutes: 45 }, end: { hours: 12, minutes: 35 } };
    const period6 = { start: { hours: 12, minutes: 40 }, end: { hours: 13, minutes: 30 } };
    const period7 = { start: { hours: 13, minutes: 35 }, end: { hours: 14, minutes: 25 } };
    const outOfSchoolPM = { start: { hours: 14, minutes: 26 }, end: { hours: 23, minutes: 59 } };
    const outOfSchoolAM = { start: { hours: 0, minutes: 0 }, end: { hours: 7, minutes: 29 } };

    // Method to check if current time is within a period range
    const isWithinPeriod = (currentTime, startTime, endTime) => {
        const [currentHours, currentMinutes] = currentTime;
        const startHours = startTime.hours,
            startMinutes = startTime.minutes,
            endHours = endTime.hours,
            endMinutes = endTime.minutes;

        return (
            (currentHours > startHours ||
                (currentHours === startHours && currentMinutes >= startMinutes)) &&
            (currentHours < endHours ||
                (currentHours === endHours && currentMinutes <= endMinutes))
        );
    };

    // Check if current time is within a class period or outside school hours, else between classes
    if (isWithinPeriod([estHours, estMinutes], period1.start, period1.end)) {
        time = "Period 1";
    } else if (isWithinPeriod([estHours, estMinutes], period2.start, period2.end)) {
        time = "Period 2";
    } else if (isWithinPeriod([estHours, estMinutes], period3.start, period3.end)) {
        time = "Period 3";
    } else if (isWithinPeriod([estHours, estMinutes], lunch.start, lunch.end)) {
        time = "Lunch";
    } else if (isWithinPeriod([estHours, estMinutes], period4.start, period4.end)) {
        time = "Period 4";
    } else if (isWithinPeriod([estHours, estMinutes], period5.start, period5.end)) {
        time = "Period 5";
    } else if (isWithinPeriod([estHours, estMinutes], period6.start, period6.end)) {
        time = "Period 6";
    } else if (isWithinPeriod([estHours, estMinutes], period7.start, period7.end)) {
        time = "Period 7";
    } else if (isWithinPeriod([estHours, estMinutes], outOfSchoolPM.start, outOfSchoolPM.end)) {
        time = "Out of School";
    } else if (isWithinPeriod([estHours, estMinutes], outOfSchoolAM.start, outOfSchoolAM.end)) {
        time = "Out of School";
    } else {
        time = "Between Classes";
    }
    
    return [time, dateText];
}