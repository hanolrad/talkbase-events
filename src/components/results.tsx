import "react"
import { InputLabel, TextField, Typography } from "@mui/material"

const Results = ({ results }: { results: Record<string,any> }) => {

  return <div className="data-col">
    <Typography variant="h5">Start Date and Time submitted</Typography>
    <InputLabel className="data-label">Target Timezone Datetime</InputLabel>
    <TextField value={results.targetDatetime.toLocaleDateString("en-US", { hour: "2-digit", minute: "2-digit" })} />
    <InputLabel className="data-label">UTC Datetime</InputLabel>
    <TextField value={new Date(results.utcDatetime).toLocaleDateString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} />
    <InputLabel className="data-label">Local Datetime</InputLabel>
    <TextField value={results.localDatetime.toLocaleDateString("en-US", { hour: "2-digit", minute: "2-digit" })} />
  </div>
}

export default Results