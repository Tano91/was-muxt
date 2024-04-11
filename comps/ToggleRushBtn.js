import Checkbox from '@mui/material/Checkbox';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { blueGrey } from '@mui/material/colors';


const label = { inputProps: { 'aria-label': 'Issues' } };

export default function ToggleRushBtn(prop) {
  return (
    <Checkbox {...label} 
    disabled
    defaultChecked={prop.rushVal}
    icon={<AccessTimeRoundedIcon sx={{ color: blueGrey[100] }}></AccessTimeRoundedIcon>} 
    checkedIcon={<AccessTimeRoundedIcon color='error'></AccessTimeRoundedIcon>} />

  );
}