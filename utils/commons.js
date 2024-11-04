export const blurhash ='|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export const getRoomId = (uid1,uid2)=>{
    const sortedIds = [uid1,uid2].sort()
    const roomId = sortedIds.join('-')
    return roomId
}

export const formatDate = date=>{ 
    var day = date.getDate(); 
    var year = date.getFullYear();
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = monthNames [date.getMonth()]; 
    var formattedDate = day +' '+ month+' '+year; 
    return formattedDate;
}
export const getTimewithinToday = (date,today) =>{
    if(date.getDate()==today.getDate()) return true
      else return false
  }
export const formatDateTime = date => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Add leading zeros if needed
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    
    return `${hours}:${minutes} ${ampm}`;
}