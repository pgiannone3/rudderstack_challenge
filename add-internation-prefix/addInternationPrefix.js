async function transformEvent(event) {
    const country = event.context?.traits?.address?.country;
    const phone = event.context?.traits?.phone;

    if (country && phone) {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true&fields=idd`);

        const root = response?.[0]?.idd?.root || "";
        const suffix = response?.[0]?.idd?.suffixes[0] || "";

        const internationalDialingCode = root + suffix;
        event.context.traits.internationalDialingCode = internationalDialingCode;
        event.context.traits.formattedPhone = addInternationalDialingCode(phone, internationalDialingCode);
    }

    return event;
}

function addInternationalDialingCode(phoneNumber, internationalDialingCode) {
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;
    const formattedInternationalCode = internationalDialingCode.startsWith("+") ? internationalDialingCode : `+${internationalDialingCode}`;

    if (formattedPhone.startsWith(formattedInternationalCode)) {
        return formattedPhone;
    } else {
        return `${formattedInternationalCode}${formattedPhone.slice(1)}`;
    }
}

module.exports = { transformEvent, addInternationalDialingCode };