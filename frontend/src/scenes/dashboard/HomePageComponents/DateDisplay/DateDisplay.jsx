import React from 'react';
import styles from './DateDisplay.module.scss';

const DateDisplay = () => {
  const currentDate = new Date();

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const currentDayOfWeek = daysOfWeek[currentDate.getDay()];

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const currentDateFormatted = currentDate.toLocaleDateString(
    undefined,
    options
  );

  return (
    <div className={styles.date}>
      Today is {currentDayOfWeek}, {currentDateFormatted}
    </div>
  );
};

export default DateDisplay;
