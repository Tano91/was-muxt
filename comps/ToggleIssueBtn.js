
import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { blueGrey } from '@mui/material/colors';


const label = { inputProps: { 'aria-label': 'Issues' } };

export default function ToggleIssueBtn(prop) {

  return (
    <Checkbox 
    defaultChecked={prop.issueVal}
    disabled
    {...label}
    icon={<WarningAmberRoundedIcon sx={{ color: blueGrey[100] }}></WarningAmberRoundedIcon>} 
    checkedIcon={<WarningAmberRoundedIcon color='warning'></WarningAmberRoundedIcon>} />

  );
}