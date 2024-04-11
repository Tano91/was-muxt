import Head from "next/head";
import { useRouter } from 'next/router'
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import dayjs from 'dayjs';
import { FormControlLabel, Checkbox, Button, Typography, Container, Box, TextField, MenuItem, FormControl } from "@mui/material";
import { db } from "../../../firebase/config";
import {doc, getDoc, updateDoc, serverTimestamp  } from "firebase/firestore"; 
import { toast } from "react-toastify";
import Fade from '@mui/material/Fade';


    //Fetch Order - ID PASSED AS PARAM in URL!

    export const getServerSideProps = async (context) => {
    
        const id = context.params.id;
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
      
        // Convert Firebase Server Timestamp to a serializable format
        const createdAt = data.createdAt && data.createdAt.toDate() ? data.createdAt.toDate().toISOString() : null;
        const updatedAt = data.updatedAt && data.updatedAt.toDate() ? data.updatedAt.toDate().toISOString() : null;
      
        return {
          props: { order: { ...data, id: docRef.id, createdAt, updatedAt } },
        };
    } 

  


const EditOrder = ({order}) => {
    const router = useRouter()

    const [status, setStatus] = useState(order.status)
    const [assigned, setAssigned] = useState(order.assignedTo)
    const [region, setRegion] = useState(order.location.region)
    const [weddingDate, setWeddingDate] = useState(order.location.weddingDate)
    const [videographer, setVideographer] = useState(order.location.videographer)
    const [release, setRelease] = useState(order.location.release)
    const [room, setRoom] = useState(order.location.room)
    const [bookingNumber, setBookingNumber] = useState(order.guest.bookingNumber)
    const [receiptNumber, setReceiptNumber] = useState(order.guest.receiptNumber)
    const [groomFirstName, setGroomFirstName] = useState(order.guest.groomFirstName)
    const [groomLastName, setGroomLastName] = useState(order.guest.groomLastName)
    const [brideFirstName, setBrideFirstName] = useState(order.guest.brideFirstName)
    const [brideLastName, setBrideLastName] = useState(order.guest.brideLastName)
    const [due, setDue] = useState(order.package.due)
    const [packageName, setPackageName] = useState(order.package.packageName)
    const [videoTitle, setVideoTitle] = useState(order.package.videoTitle)
    const [addons, setAddons] = useState(order.package.addons);
    const [music, setMusic] = useState(order.package.music);
    const [rush, setRush] = useState(order.rush);
    const [issues, setIssues] = useState(order.issues);
    // const [timeStamp, setTimeStamp] = useState()

    const [isPending, setIsPending] = useState(false);


    


    // Add-on & Music Handlers:
    const handleAddAddon = () => {
        setAddons([...addons, { name: '', quantity: '' }]);
    };

    const handleRemoveAddon = (index) => {
        setAddons(addons.filter((_, i) => i !== index));
    };

    const handleAddMusic = () => {
        setMusic([...music, '']);
    };

    const handleRemoveMusic = (index) => {
        setMusic(music.filter((_, i) => i !== index));
    };

    const handleAddonNameChange = (event, index) => {
        const newAddons = [...addons];
        newAddons[index].name = event.target.value;
        setAddons(newAddons);
    };

    const handleAddonQuantityChange = (event, index) => {
        const newAddons = [...addons];
        newAddons[index].quantity = event.target.value;
        setAddons(newAddons);
    };

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
    
        return [month, day, year].join('/');
    }


    const [regionError, setRegionError] = useState('')
    const [weddingDateError, setWeddingDateError] = useState('')
    const [videographerError, setVideographerError] = useState('')
    const [releaseError, setReleaseError] = useState('')
    const [roomError, setRoomError] = useState('')
    const [bookingNumberError, setBookingNumberError] = useState('')
    const [receiptNumberError, setReceiptNumberError] = useState('')
    const [groomFirstNameError, setGroomFirstNameError] = useState('')
    const [groomLastNameError, setGroomLastNameError] = useState('')
    const [brideFirstNameError, setBrideFirstNameError] = useState('')
    const [brideLastNameError, setBrideLastNameError] = useState('')
    const [dueError, setDueError] = useState('')
    const [packageNameError, setPackageNameError] = useState('')
    const [videoTitleError, setVideoTitleError] = useState('')
    

    const handleSubmit = async (e) =>{
        e.preventDefault()

        let formDirty = false;

        if(!region){
            setRegionError('Region is Required!')
            formDirty = true
        }else{
            setRegionError('')
        }

        if(!weddingDate){
            setWeddingDateError('Wedding Date is Required!')
            formDirty = true
        }else{
            setWeddingDateError('')
        }

        if(!videographer){
            setVideographerError('Videographer is Required!')
            formDirty = true
        }else{
            setVideographerError('')
        }

        if(!release){
            setReleaseError('Release is Required!')
            formDirty = true
        }else{
            setReleaseError('')
        }

        if(!room){
            setRoomError('Room # is Required!')
            formDirty = true
        }else{
            setRoomError('')
        }

        if(!bookingNumber){
            setBookingNumberError('Booking # is Required!')
            formDirty = true
        }else{
            setBookingNumberError('')
        }

        if(!receiptNumber){
            setReceiptNumberError('Receipt # is Required!')
            formDirty = true
        }else{
            setReceiptNumberError('')
        }

        if(!groomFirstName){
            setGroomFirstNameError(`Groom's First Name is Required!`)
            formDirty = true
        }else{
            setGroomFirstNameError('')
        }

        if(!groomLastName){
            setGroomLastNameError(`Groom's Last Name is Required!`)
            formDirty = true
        }else{
            setGroomLastNameError('')
        }

        if(!brideFirstName){
            setBrideFirstNameError(`Bride's First Name is Required!`)
            formDirty = true
        }else{
            setBrideFirstNameError('')
        }

        if(!brideLastName){
            setBrideLastNameError(`Bride's Last Name is Required!`)
            formDirty = true
        }else{
            setBrideLastNameError('')
        }

        if(!due){
            setDueError(`Due Date is Required!`)
            formDirty = true
        }else{
            setDueError('')
        }

        if(!packageName){
            setPackageNameError(`Package Name is Required!`)
            formDirty = true
        }else{
            setPackageNameError('')
        }

        if(!videoTitle){
            setVideoTitleError(`Video Title is Required!`)
            formDirty = true
        }else{
            setVideoTitleError('')
        }

        if(!formDirty){
            const updateOrder = { 
                status,
                assignedTo: assigned,
    
                location: {
                    region,
                    weddingDate,
                    videographer,
                    release,
                    room,
                },
    
                guest: {
                    bookingNumber,
                    receiptNumber,
                    groomFirstName,
                    groomLastName,
                    brideFirstName,
                    brideLastName,
                },
                package:{
                    due,
                    packageName,
                    videoTitle,
                    addons,
                    music
                },
                rush,
                issues,
                updatedAt: serverTimestamp(),
                // comments:[]
            };
    
    
            setIsPending(true);

            //Edit doc submission here - update doc in: (dbFirestore, collection: order, item: id), NEWDATA
            await updateDoc(doc(db,"orders", order.id), updateOrder)
           .then(()=>{
                toast.success("Order Edited Successfully!", {
                    hideProgressBar: true,
                });
                setIsPending(false)
                router.push("/orders/" + order.id)
            })
            .catch(error => {
                toast.error("Something went wrong!", {
                    hideProgressBar: true,
                  });
                  console.log(error)
                
            })
            
        }
        
    }

    const handleCheckBoxRush = (event) => {
        setRush(!rush);
      };

      const handleCheckBoxIssues = (event) => {
        setIssues(!issues);
      };



    return ( 
        <>
            <Head>
                <link rel="logo icon" href="/was_logo_red.png"/>
                <title>Edit - W.A.S.</title>
                <meta name="home" content="home" />
            </Head>
        
            <Fade in timeout={500}>

            {/* content section */}

            <Container>
                <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography variant='h4' gutterBottom sx={{ 
                            mb: 4, color: 'black',
                            fontFamily: 'Public Sans',
                            fontWeight: 800
                }}> Edit Order
                </Typography>
            </Container>
                <Box display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    
                    onSubmit={handleSubmit} component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' },}} noValidate autoComplete="off">


                    <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent:'center' }}>
                        
                        <FormControlLabel 
                            control={<Checkbox 
                            color="error"
                            label="Rush"
                            checked={rush}
                            onChange={handleCheckBoxRush}/>} label="Rush" 
                        />

                        <FormControlLabel 
                            control={<Checkbox 
                            color="warning"
                            label="Problem"
                            checked={issues}
                            onChange={handleCheckBoxIssues}/>} label="Issues" 
                        />
                          
                    </Box>


                    {/* location */}
                    <TextField
                    error = {regionError && regionError.length ? true : false}
                        id="region"
                        required
                        select
                        label="Region"
                        helperText={regionError}
                        value={ region }
                        onChange = { (e)=> setRegion(e.target.value) }
                        >
                       <MenuItem value={'Antigua'}>Antigua</MenuItem>
                       <MenuItem value={'Bahamas'}>Bahamas</MenuItem>
                       <MenuItem value={'Curacao'}>Curacao</MenuItem>
                       <MenuItem value={'Grenada'}>Grenada</MenuItem>
                       <MenuItem value={'Jamaica'}>Jamaica</MenuItem>
                    </TextField>

                    {/* wedding date */}
                    <DatePicker
                        error = {weddingDateError && weddingDateError.length ? true : false}
                        helperText={weddingDateError}
                        id="wedding-date" 
                        required
                        label="Wedding Date" 
                        value= { dayjs(weddingDate) }
                        onChange = { (date)=> setWeddingDate(formatDate(date)) }
                    />

                    {/* videograpger */}
                    <TextField
                        error = {videographerError && videographerError.length ? true : false}
                        id="videographer"
                        required
                        select
                        label="Videographer"
                        helperText={videographerError}
                        value={ videographer }
                        onChange = { (e)=> setVideographer(e.target.value) }
                        >
                       <MenuItem value={'Dwight'}>Dwight</MenuItem>
                       <MenuItem value={'Jan'}>Jan</MenuItem>
                       <MenuItem value={'Andy'}>Andy</MenuItem>
                       <MenuItem value={'Angela'}>Angela</MenuItem>
                    </TextField>

                    {/* release */}
                    <TextField
                        error = {releaseError && releaseError.length ? true : false}
                        id="releaase"
                        required
                        select
                        label="Model Release"
                        helperText={releaseError} 
                        value={ release }
                        onChange = { (e)=> setRelease(e.target.value) }
                        >
                       <MenuItem value={'true'}>Yes</MenuItem>
                       <MenuItem value={'false'}>No</MenuItem>
                    </TextField>

                    {/*  room */}
                    <TextField 
                    error = {roomError && roomError.length ? true : false}
                    id="room-number" 
                    required
                    label="Room Number"
                    helperText={roomError}
                    type="number"
                    InputProps={{
                        inputProps: { 
                            min: 0
                        }
                    }}
                    value= { room }
                    onChange = { (e)=> setRoom(e.target.value) }
                    variant="outlined" />
                    

                    {/* Booking Number */}
                    <TextField 
                    error = {bookingNumberError && bookingNumberError.length ? true : false}
                    id="booking-number" 
                    required
                    label="Booking Number" 
                    helperText={bookingNumberError}
                    type="number"
                    InputProps={{
                        inputProps: { 
                            min: 0
                        }
                    }}
                    variant="outlined"
                    value= { bookingNumber }
                     onChange = { (e)=> setBookingNumber(e.target.value) }
                    />

                    {/* receipt # */}
                    <TextField 
                    error = {receiptNumberError && receiptNumberError.length ? true : false}
                    id="receipt-number" 
                    required
                    label="Receipt Number" 
                    helperText={receiptNumberError}
                    type="number"
                    InputProps={{
                        inputProps: { 
                            min: 0
                        }
                    }}
                    variant="outlined"
                    value= { receiptNumber }
                    onChange = { (e)=> setReceiptNumber(e.target.value) }
                    />

                    {/* groom first name */}
                    <TextField
                    error = {groomFirstNameError && groomFirstNameError.length ? true : false} 
                    id="groom-first" 
                    required
                    label="Groom First Name" 
                    helperText={groomFirstNameError}
                    variant="outlined"
                    value= { groomFirstName }
                    onChange = { (e)=> setGroomFirstName(e.target.value) }
                    />

                    {/* groom last name */}
                    <TextField 
                    error = {groomLastNameError && groomLastNameError.length ? true : false}
                    id="groom-last" 
                    required
                    label="Groom Last Name" 
                    helperText={groomLastNameError}
                    variant="outlined"
                    value= { groomLastName }
                    onChange = { (e)=> setGroomLastName(e.target.value) }
                    />


                    {/* bride first name */}
                    <TextField 
                    error = {brideFirstNameError && brideFirstNameError.length ? true : false}
                    id="bride-first" 
                    required
                    label="Bride First Name" 
                    helperText={brideFirstNameError}
                    variant="outlined"
                    value= { brideFirstName }
                    onChange = { (e)=> setBrideFirstName(e.target.value) }
                    />

                    {/* bride last name */}
                    <TextField 
                    error = {brideLastNameError && brideLastNameError.length ? true : false}
                    id="bride-last" 
                    required
                    label="Bride Last Name" 
                    helperText={brideLastNameError}
                    variant="outlined"
                    value= { brideLastName }
                    onChange = { (e)=> setBrideLastName(e.target.value) }
                    />

                     {/* due date */}
                     <DatePicker
                     error = {dueError && dueError.length ? true : false}
                     helperText={dueError}
                        id="due-date" 
                        required
                        label="Due Date" 
                        value= { dayjs(due) }
                        onChange = { (date)=> setDue(formatDate(date)) }
            
                    />

                    {/* package type */}
                    <TextField
                    error = {packageNameError && packageNameError.length ? true : false}
                        id="package-name"
                        required
                        select
                        label="Package Name"
                        helperText={packageNameError}
                        value={ packageName }
                        onChange = { (e)=> setPackageName(e.target.value) }
                        >
                       <MenuItem value={'The Classic'}>The Classic</MenuItem>
                       <MenuItem value={'The Luxe'}>The Luxe</MenuItem>
                       <MenuItem value={'The Prestige'}>The Prestige</MenuItem>
            
                    </TextField>

                    {/* video title */}
                    <TextField 
                    error = {videoTitleError && videoTitleError.length ? true : false}
                    id="video-title" 
                    required
                    label="Video Title" 
                    helperText={videoTitleError}
                    variant="outlined"
                    value= { videoTitle }
                    onChange = { (e)=> setVideoTitle(e.target.value) }
                    />

                    {/* Add-Ons */}
                    <Box sx={{ display: 'flex', flexDirection:'column' }}>
                        <Button color='warning' variant="outlined" sx={{ mb: 2 }} onClick={handleAddAddon}>
                            <AddCircleIcon/> 
                        </Button>
                        {addons.map((addon, index) => (
                            <Box key={index} sx={{ display:'flex', alignItems:"center" }}>
                                
                                <TextField 
                                sx={{  mr: 1, mb: 2  }}
                                required
                                label="Add-On" 
                                variant="outlined"
                                value={addon.name}
                                onChange={(event) => handleAddonNameChange(event, index)}
                                />

                                <TextField 
                                sx={{  mr: 1, mb: 2  }}
                                id="addon-Amount" 
                                required
                                label="Amount" 
                                type="number"
                                InputProps={{
                                    inputProps: { 
                                        min: 0
                                    }
                                }}
                                variant="outlined"
                                value={addon.quantity}
                                onChange={(event) => handleAddonQuantityChange(event, index)}
                                />
                                <DeleteForeverIcon onClick={() => handleRemoveAddon(index)} color='error'/>
                                
                            </Box>
                        ))}
                    </Box>


                     {/* Music */}
                     <Box sx={{ display: 'flex', flexDirection:'column' }}>
                        <Button color='warning' variant="outlined" sx={{ mb: 2 }} onClick={handleAddMusic}>
                            <MusicNoteIcon />
                        </Button>
                        {music.map((song, index) => (
                            <Box key={index} sx={{ display:'flex', alignItems:"center" }}>
                                
                                <TextField 
                                sx={{ minWidth:210, mr: 2, mb: 2  }}
                                required
                                label="Song Name" 
                                variant="outlined"
                                value={song}
                                onChange={(event) => setMusic([...music.slice(0, index), event.target.value, ...music.slice(index + 1)])}
                                />

                                <DeleteForeverIcon onClick={() => handleRemoveMusic(index)} color='error'/>

                                
                                
                                
                            </Box>
                        ))}
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection:'column', }}>
                    { !isPending && <Button sx={{ mb:5 }} type="submit" color="warning" variant="contained">Edit Order</Button>} 
                    { isPending && <Button sx={{ mb:5 }} color="warning" variant="contained" disabled>Editing Order</Button>} 
                    </Box>

                </Box>
            </Container>

            
         </Fade>
        </>
     );
}
 
export default EditOrder;