const timeDurationBetweenDatesInWords = (date1:Date, date2:Date):string => {
  const absoluteDifferenceInMs = Math.floor(Math.abs(date1.getTime() - date2.getTime()));

  const msInSecond = 1000;
  const msInMinute = msInSecond * 60;
  const msInHour = msInMinute * 60;
  const msInDay = msInHour * 24;

  const spentDays = Math.floor(absoluteDifferenceInMs / msInDay);
  const spentHours = Math.floor((absoluteDifferenceInMs - spentDays * msInDay) / msInHour);
  // eslint-disable-next-line max-len
  const spentMinutes = Math.floor((absoluteDifferenceInMs - spentDays * msInDay - spentHours * msInHour) / msInMinute);
  // eslint-disable-next-line max-len
  const spentSeconds = Math.floor((absoluteDifferenceInMs - spentDays * msInDay - spentHours * msInHour - spentMinutes * msInMinute) / msInSecond);
  // eslint-disable-next-line max-len
  const spentMs = absoluteDifferenceInMs - spentDays * msInDay - spentHours * msInHour - spentMinutes * msInMinute - spentSeconds * msInSecond;

  return `${spentDays ? `${spentDays} days ` : ''}${spentHours ? `${spentHours} hours ` : ''}${spentMinutes ? `${spentMinutes} minutes ` : ''}${spentSeconds ? `${spentSeconds} seconds ` : ''}${spentMs ? `${spentMs} ms` : ''}`;
};

export default timeDurationBetweenDatesInWords;
