import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Datepicker.css';
import Label from '../atoms/Label';
import FormField from '../atoms/FormField';
// import useUserTimeZone from '../hooks/useUserTimeZone';

const DateInput = (props) => {
  const [startDate, setStartDate] = useState(new Date());
 
  const {
    onChange,
    labelText,
    id,
    showYearDropdown,
    maxDate,
    minDate
  } = props;

  const handleDateChange = (date) => {
    setStartDate(date);
    onChange(date);
  };

  return (
    <FormField>
      <Label htmlFor={id} labelText={labelText}/>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
        maxDate={maxDate}
        minDate={minDate}
        showYearDropdown={showYearDropdown}
        scrollableYearDropdown={showYearDropdown}
      />
    </FormField>
  );
};

export default DateInput