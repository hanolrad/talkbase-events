import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";

import { FormHelperText, TextField, Typography, MenuItem, InputLabel, Select } from "@mui/material";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import LoadingButton from '@mui/lab/LoadingButton';

import postEvent from "../requests/post-event";
import { tzs } from "../constants"

interface EventFormData {
  timezone: string
  time: Date
  date: Date
}

const EventForm = ({ setResults }: { setResults: Dispatch<SetStateAction<Record<string,any>>> }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { handleSubmit, control, reset, formState: { errors, isSubmitSuccessful } } = useForm<EventFormData>();
  

  const sendEventData = async () => {
    setLoading(true)
    try {
      await postEvent();
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  const onSubmit: SubmitHandler<EventFormData> = async data => {
    const { timezone, time, date } = data
    const completeDateObj = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes())
  
    const utcDatetime = zonedTimeToUtc(completeDateObj, timezone)
    const targetDatetime = utcToZonedTime(utcDatetime, timezone)
    const localDatetime = utcToZonedTime(utcDatetime, Intl.DateTimeFormat().resolvedOptions().timeZone)
 
    // console.log("UTC time:", utcDatetime.toUTCString())
    // console.log("Target time:", targetDatetime.toString())
    // console.log("Local time:", localDatetime.toString())

    await sendEventData()
    setResults({ targetDatetime, localDatetime, utcDatetime })
  }

  useEffect(() => {
    reset()
  }, [isSubmitSuccessful])

  return (
  <>
    <Typography variant="h5">Let's create a new event</Typography>
    <Typography variant="h6" color="primary">When does it start?</Typography>

    <form className="data-col" onSubmit={handleSubmit(onSubmit)}>
      <InputLabel className="data-label" id="date-select">Date</InputLabel>
      <Controller
          name="date"
          control={control}
          defaultValue={new Date(2023, 0, 1, 8, 0)}
          rules={{ required: true }}
          render={({ field: { onChange, value, ref } }) => 
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                className="field-input"
                value={value}
                onChange={onChange}
                inputRef={ref}
                renderInput={(props) => <TextField {...props} />}
              />
            {!!errors.date && <FormHelperText error={!!errors.date}>Please choose a valid date</FormHelperText>}
            </LocalizationProvider>}
      />
      <InputLabel className="data-label" id="time-select">Time</InputLabel>
      <Controller
          name="time"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value, ref } }) => 
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                className="field-input"
                value={value}
                onChange={onChange}
                inputRef={ref}
                renderInput={(props) => <TextField {...props} />}
              />
              {!!errors.time && <FormHelperText error={!!errors.timezone}>Please choose a valid time</FormHelperText>}
            </LocalizationProvider>}
      />
      <InputLabel className="data-label" id="timezone-select">Timezone</InputLabel>
      <Controller
        name="timezone"
        control={control}
        defaultValue={""}
        rules={{ required: true }}
        render={({ field }) => <Select
            className="tz-select"
            labelId="timezone-select"
            error={!!errors.timezone}
            {...field}>
              {tzs.map(tz => {
                const name = `${tz.name} (${tz.timezone})`; 
                const displayName = name.replaceAll("_", " ") 
                return <MenuItem key={tz.name} value={tz.name}>{displayName}</MenuItem> 
              })}
          </Select>}
      />

      <div className="form-end">
        {!!errors.timezone && <FormHelperText error={!!errors.timezone}>Please choose a timezone of the event</FormHelperText>}
      </div>
      <LoadingButton className="form-btn" loading={loading} variant="contained" type="submit">Continue</LoadingButton>
    </form>
  </>)
}

export default EventForm