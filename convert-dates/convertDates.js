function transformEvent(event) {

    const timeZone = event.context?.timezone;
    const originalTimestamp = event.originalTimestamp;
    const locale = event.context?.locale || "en-US";

    if (timeZone && originalTimestamp) {
        const date = new Date(originalTimestamp);
        const localDateTime = date.toLocaleString(locale, {
            ...options,
            timeZone
        });
        event.localTimestamp = localDateTime;
    }

    return event;
}

const options = { year: "2-digit", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }

module.exports = { transformEvent };