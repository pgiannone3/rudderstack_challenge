# ru-challenge
It is a repository for the RU challenge: creating new transformations

### CONVERTING TO LOCAL DATE TIME ###

The ability to accurately convert timestamps to the user's local time zone can greatly improve the usability and accessibility of many applications.
This transformation can be used to convert an ISO 8601 timestamp to a user's local date and time based on their time zone.

**Purpose**

Imagine you're running a global e-commerce business with customers in different parts of the world. 
With the help of this transformation, you can convert the timestamp of all user actions, such as when they added a product to the cart, made a purchase, or abandoned the cart, **to their local date and time, based on their specific time zones**. This way, you can analyze user data more accurately and create personalized marketing campaigns, promotions, and website features that are tailored to their unique preferences and habits.

For example, let's say you have a customer in Tokyo who always seems to abandon their shopping cart at the same time every day. You're not sure why this is happening, but by converting the timestamp of the abandoned cart to their local date and time, you can more easily see if there were any problems at that specific time, such as a lack of payment options or shipping restrictions. This saves time and effort by avoiding the need to manually convert the timestamp from Zulu time to the customer's local time.

**Approach**

The function first extracts the event's timezone, original timestamp, and locale: 

```
    const timeZone = event.context?.timezone;
    const originalTimestamp = event.originalTimestamp;
    const locale = event.context?.locale || "en-US";
```

Then, it converts the original timestamp to a string in the user's local date and time format, based on their time zone and locale. The resulting local date and time string is then added to the event object as a new property, `localTimestamp`.

Besides, it offers great flexibility in representing the local date and time format:

* The format of the produced date will depend on the locale value passed: for example, if "it-IT" is passed instead of "en-US", the format of the produced date will be different, as the Italian language has different names for months and days of the week than English. Therefore, if the function is called with `event.context.locale` set to `it-IT`, for example, the month name "January" will be translated to "Gennaio", while the day of the week name "Tuesday" will be translated to "Martedì"

* The options constant can be modified to meet specific needs, allowing for a more personalized and accurate representation of the date and time for each user based on their specific time zone. 
For example, considering the following input data:

```
originalTimestamp: 2020-05-25T20:37:10.917Z
timezone: US/Pacific
locale: en-US

```
| Options Value |Local Date format|
| --- | --- |
| ```const options = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }``` | Monday, May 25, 2020, 01:37:10 PM |
| ```const options = { year: "2-digit", month: "2-digit", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }``` | 05/25/20, 1:37:10 PM |
| ```const options = { hour12: false, year: "2-digit", month: "2-digit", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "long" }``` | 05/25/20, 13:37:10 Pacific Daylight Time |
| ```const options = { hour12: true, dateStyle: "full", timeStyle: "full"}``` | Monday, May 25, 2020 at 1:37:10 PM Pacific Daylight Time |
| ```const options = { hour12: true, year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short" }``` | May 25, 2020, 1:37:10 PM PDT |










### ADD INTERNATIONAL PREFIX

- Suppose you are an e-commerce business that operates in multiple countries and receives orders from customers all over the world. To ensure smooth communication with your customers, you need to store their phone numbers with the correct international prefix. However, manually formatting each phone number can be time-consuming and error-prone, especially if you have a large customer base. By using the Rudderstack transformation I've developed, you can automate the process of adding the international prefix to each phone number, ensuring that your customer data is consistent and accurate.

- International phone numbers can present a challenge for businesses that operate across borders. With different countries using different numbering systems, it can be difficult to ensure consistency and accuracy when handling contact data. That's why I've developed a Rudderstack transformation that adds an 'internationalCode' field to phone number data, along with a 'formattedPhone' field that includes the full international prefix. By using this transformation, businesses can ensure that their phone number data is correctly formatted.

- Please note that in order for the transformation to work correctly, it requires the presence of the 'country' field in English and the 'phone' field in the event object. In the provided code, these fields are accessed using the following lines:

    const country = event.context.traits.country;
    const phone = event.context.traits.phone;

Therefore, it's important to ensure that these fields are present and correctly formatted in the incoming data for the transformation to function as intended.


    export async function transformEvent(event) {
        const country = event.context?.traits?.country;
        const phone = event.context?.traits?.phone;
    
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
    

