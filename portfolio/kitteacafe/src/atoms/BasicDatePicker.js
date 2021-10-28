import React, { useState, setValue } from "react";
import DateFnsUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

function BasicDateTimePicker() {
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        label="Visit Date"
        format="DD / MM / yyyy"
        value={selectedDate}
        onChange={handleDateChange}
        disablePast
        autoOk
      />
    </MuiPickersUtilsProvider>
  );
}

export default BasicDateTimePicker;