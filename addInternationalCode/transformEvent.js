async function transformEvent(event) {
    const country = event.context.traits.address.country;
    const phone = event.context.traits.phone;

    if (country && phone) {
        const response = await fetch(`https://restcountries.com/v2/name/${country}?fullText=true&fields=callingCodes`);
        const internationalCode = response?.[0]?.callingCodes?.[0] || "";
        event.context.traits.internationalCode = internationalCode;
        event.context.traits.formattedPhone = addInternationalCode(phone, internationalCode);
    }

    return event;
}

function addInternationalCode(phoneNumber, internationalCode) {
  const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;
  if (formattedPhone.startsWith(`+${internationalCode}`)) {
    return formattedPhone;
  } else {
    return `+${internationalCode}${formattedPhone.slice(1)}`;
  }
}

module.exports = { transformEvent, addInternationalCode };
