const { transformEvent } = require('./convertDates.js');

describe('transformEvent function', () => {
  it('should return the original event if timezone or originalTimestamp is missing', () => {
    const event = {
      context: { locale: 'en-US', timezone: 'Europe/Rome' },
    };
    expect(transformEvent(event)).toEqual(event);
  });

  it('should transform the originalTimestamp to the local time and date Europe/Rome', () => {
    const event = {
      context: { locale: 'en-US', timezone: 'Europe/Rome' },
      originalTimestamp: '2020-05-25T20:37:10.917Z',
    };
    const transformedEvent = transformEvent(event);
    expect(transformedEvent.localTimestamp).toEqual('May 25, 20 at 10:37:10 PM');
  });

  it('should transform the originalTimestamp to the local time and date America/Buenos_Aires', () => {
    const event = {
      context: { locale: 'en-US', timezone: 'America/Buenos_Aires' },
      originalTimestamp: '2020-05-25T20:37:10.917Z',
    };
    const transformedEvent = transformEvent(event);
    expect(transformedEvent.localTimestamp).toEqual('May 25, 20 at 5:37:10 PM');
  });

  it('should transform the originalTimestamp to the local time and date America/Buenos_Aires with locale it', () => {
    const event = {
      context: { locale: 'it-IT', timezone: 'America/Buenos_Aires' },
      originalTimestamp: '2020-05-25T20:37:10.917Z',
    };
    const transformedEvent = transformEvent(event);
    expect(transformedEvent.localTimestamp).toEqual('25 maggio 20 alle ore 17:37:10');
  });

});
