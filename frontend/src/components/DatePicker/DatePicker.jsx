import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { enUS } from 'date-fns/locale';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Button from '@mui/material/Button';
import format from 'date-fns/format';
import './DatePickerStyles.css';
import PropTypes from 'prop-types';

function DatePickerWithButtons({ value, onChange, onClose }) {
  const [selectedDate, setSelectedDate] = useState(value);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    onChange(selectedDate);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div>
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        value={selectedDate}
        onChange={handleDateChange}
      />
      <div className="datepicker-btn">
        <Button className="cancel" onClick={handleCancel}>
          Cancel
        </Button>
        <Button className="apply" onClick={handleConfirm}>
          Apply
        </Button>
      </div>
    </div>
  );
}
const DatePicker = ({ onClose }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };
  const handleDateChange1 = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const handleShortcut = (startOffset, endOffset, buttonId) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + startOffset);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + endOffset);
    setDateRange([startDate, endDate]);
    setSelectedButton(buttonId);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={enUS}>
      <div className="date-picker-container">
        <div className="button-container">
          <button
            className={selectedButton === 'today' ? 'selected' : ''}
            onClick={() => handleShortcut(0, 0, 'today')}
          >
            Today
          </button>
          <button
            className={selectedButton === 'today' ? 'selected' : ''}
            onClick={() => handleShortcut(-1, -1)}
          >
            Yesterday
          </button>
          <button
            className={selectedButton === 'today' ? 'selected' : ''}
            onClick={() => handleShortcut(-6, 0)}
          >
            This Week
          </button>
          <button
            className={selectedButton === 'today' ? 'selected' : ''}
            onClick={() => handleShortcut(-13, -7)}
          >
            Last Week
          </button>
          <button
            className={selectedButton === 'today' ? 'selected' : ''}
            onClick={() => handleShortcut(-29, 0)}
          >
            This Month
          </button>
          <button
            className={selectedButton === 'today' ? 'selected' : ''}
            onClick={() => handleShortcut(-59, -30)}
          >
            Last Month
          </button>
          <button
            className={selectedButton === 'today' ? 'selected' : ''}
            onClick={() => handleShortcut(-364, 0)}
          >
            This Year
          </button>
          <button
            className={selectedButton === 'today' ? 'selected' : ''}
            onClick={() => handleShortcut(-729, -365)}
          >
            Last Year
          </button>
          <button
            className={selectedButton === 'today' ? 'selected' : ''}
            onClick={() => handleShortcut(-36500, 0)}
          >
            All Time
          </button>
        </div>
        <div className="calendar-container">
          <DateRangeCalendar
            startText="Start Date"
            endText="End Date"
            value={dateRange}
            onChange={handleDateChange1}
            renderInput={() => null}
            onClose={onClose}
            toolbarFormat="MMM d"
            calendars={2}
          />
        </div>
        <Button className="date-button" onClick={toggleDatePicker}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M17.5 8.33342H2.5M13.3333 1.66675V5.00008M6.66667 1.66675V5.00008M6.5 18.3334H13.5C14.9001 18.3334 15.6002 18.3334 16.135 18.0609C16.6054 17.8212 16.9878 17.4388 17.2275 16.9684C17.5 16.4336 17.5 15.7335 17.5 14.3334V7.33342C17.5 5.93328 17.5 5.23322 17.2275 4.69844C16.9878 4.22803 16.6054 3.84558 16.135 3.6059C15.6002 3.33341 14.9001 3.33341 13.5 3.33341H6.5C5.09987 3.33341 4.3998 3.33341 3.86502 3.6059C3.39462 3.84558 3.01217 4.22803 2.77248 4.69844C2.5 5.23322 2.5 5.93328 2.5 7.33341V14.3334C2.5 15.7335 2.5 16.4336 2.77248 16.9684C3.01217 17.4388 3.39462 17.8212 3.86502 18.0609C4.3998 18.3334 5.09987 18.3334 6.5 18.3334Z"
              stroke="#344054"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {format(selectedDate, 'MM/dd/yyyy')}
        </Button>
        {showDatePicker && (
          <DatePickerWithButtons
            value={selectedDate}
            onChange={handleDateChange}
            onClose={() => setShowDatePicker(false)}
          />
        )}
      </div>
    </LocalizationProvider>
  );
};

DatePicker.propTypes = {
  onClose: PropTypes.func,
};

DatePickerWithButtons.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
};

export default DatePicker;
