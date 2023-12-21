import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Search(props){

    const router = useRouter()
    const users = props.users
    const statuses = props.statuses


    const [matchString, setMatchString] = useState('')

    const filteredOrders = props.orders.filter(item => 
      item.guest.groomFirstName.toLowerCase() === matchString.toLowerCase() || 
      item.guest.groomLastName.toLowerCase() === matchString.toLowerCase() || 
      item.guest.brideFirstName.toLowerCase() === matchString.toLowerCase() || 
      item.guest.brideLastName.toLowerCase() === matchString.toLowerCase() ||
      item.assignedTo.toLowerCase() === matchString.toLowerCase() ||
      item.id.toLowerCase() === matchString.toLowerCase() ||
      item.location.region.toLowerCase() === matchString.toLowerCase() || 
      item.status.toLowerCase() === matchString.toLowerCase() 
   );

   
   const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Check if users and statuses are arrays
      if (Array.isArray(users) && Array.isArray(statuses)) {
        router.push({
          pathname: '/results',
          query: { 
            matchString, 
            users: encodeURIComponent(JSON.stringify(users)),
            statuses: encodeURIComponent(JSON.stringify(statuses)),
            filteredOrders: encodeURIComponent(JSON.stringify(filteredOrders)),
          },
        });
      }
    }
   };
   
   
       


  return (
    <TextField
        sx={{ ml: 2 }}
        variant="standard"
        color="primary"
        id="searchbar"
        size='small'
            InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
              }}
        onChange={(e)=>setMatchString(e.target.value)}
        onKeyPress={handleKeyPress}
        />
  )
}
