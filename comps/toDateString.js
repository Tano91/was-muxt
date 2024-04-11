export default function formatDateTime(dateString) {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    let hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[month - 1];
    
    const formattedDate = day + ' ' + monthName + ' ' + year;
  
    let period = 'am';
    if (hours >= 12) {
      period = 'pm';
      if (hours > 12) {
        hours -= 12;
      }
    }
  
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
  
    const formattedTime = hours + ':' + minutes + ' ' + period;
    const formattedDateTime = formattedDate + ', ' + formattedTime;
    
    return formattedDateTime;
  }
  
