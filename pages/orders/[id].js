import { FormControl, TextField, Box, Typography, Container, Grid, Divider, Chip, Button, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import Fade from '@mui/material/Fade';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router'
import ToggleRushBtn from '../../comps/ToggleRushBtn';
import ToggleIssueBtn from '../../comps/ToggleIssueBtn';
import CommentIcon from '@mui/icons-material/Comment';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { db } from '../../firebase/config'
import { doc, getDoc, deleteDoc,updateDoc } from "firebase/firestore"; 
import formatDateTime from '../../comps/toDateString';
import { toast } from "react-toastify";
import { useState } from 'react';
import { useEffect } from 'react';
import { getDocs} from "firebase/firestore"; 
import { statusesColRef } from '../../firebase/config';
import { usersColRef } from '../../firebase/config';
import { arrayUnion } from 'firebase/firestore';
import { uid } from 'uid';
import { Fragment } from 'react';
import { useSession } from "next-auth/react"
import { arrayRemove  } from 'firebase/firestore';
import ConfirmDialog from '../../comps/confirmDialogue';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';




export async function getServerSideProps(context) {
    const id = context.params.id;
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
  
    // Convert Firebase Server Timestamp to a serializable format
    const createdAt = data.createdAt && data.createdAt.toDate() ? formatDateTime(data.createdAt.toDate().toISOString()) : null;
    const updatedAt = data.updatedAt && data.updatedAt.toDate() ? formatDateTime(data.updatedAt.toDate().toISOString()) : null;
  
    //grab statuses
    const fetchedStatuses = await getDocs(statusesColRef);
    const dataStatuses = fetchedStatuses.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }; 
      });

    //grab users
    const fetchedUsers = await getDocs(usersColRef);
    const dataUsers = fetchedUsers.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }; 
      });

    return {
      props: { order: { ...data, id: docRef.id, createdAt, updatedAt }, statuses:{...dataStatuses}, users:{...dataUsers} },
    };
  }


const Details = ({ order, statuses, users}) => {
    const [orderState, setOrderState] = useState(order);
    const [confirmOpen, setConfirmOpen] = useState(false);


    const { data: session, status } = useSession()

    const router = useRouter()

    //Delete Logic
    const handleDelete = async (item) => {
        if (confirmOpen) {
          await deleteDoc(doc(db,"orders", item))
          .then(()=>{
            toast.success("Order Deleted!", {
              hideProgressBar: true,
            });
            router.push('/')
          })
          .catch(error => {
            toast.error("Something Went Wrong", {
              hideProgressBar: true,
            });
            console.log(error)
          });
          setConfirmOpen(false);
        }
       }
       


    //List statuses
    const listStatuses = () =>{
        const statusNames = Object.entries(statuses).map(([key, value]) => value.name);
        return statusNames
    }
  
 
    const dataStatuses = listStatuses()

    

    //Statuses Dropdown Logic
    const [selectedOption, setSelectedOption] = useState(orderState.status);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    // await updateDoc(doc(db,"orders", order.id), updateOrder)
    const handleUpdateDocument = async () => {
        
        // Update the document in Firestore
        const docRef = doc(db, 'orders', orderState.id);
        await updateDoc(docRef, {status: selectedOption })
        .then(()=>{
            toast.success(`Status Updated to: ${selectedOption}`, {
                hideProgressBar: true,
            });
        })
        .catch(error => {
            toast.error("Something went wrong!", {
                hideProgressBar: true,
              });
              console.log(error)
            
        })
    };


    //List users
    const listUsers = () =>{
        const userNames = Object.entries(users).map(([key, value]) => value.name);
        return userNames
    }
 
    const dataUsers = listUsers()


    //Assigned Dropdown Logic
    const [selectedOptionAssigned, setSelectedOptionAssigned] = useState(orderState.assignedTo);

    const handleOptionChangeAssigned = (event) => {
        setSelectedOptionAssigned(event.target.value);
    };
    // await updateDoc(doc(db,"orders", order.id), updateOrder)
    const handleUpdateDocumentAssigned = async () => {
        
        // Update the document in Firestore
        const docRef = doc(db, 'orders', orderState.id);
        await updateDoc(docRef, {assignedTo: selectedOptionAssigned })
        .then(()=>{
            toast.success(`Assigned to: ${selectedOptionAssigned}`, {
                hideProgressBar: true,
            });
        })
        .catch(error => {
            toast.error("Something went wrong!", {
                hideProgressBar: true,
              });
              console.log(error)
            
        })
    };

    useEffect(()=>{
    }, [listStatuses, listUsers]);



    //comments logic

    const [newComment, setNewComment]= useState('')
    const [allComments, setAllComments] = useState(orderState.comments || []);



    const handleCommentSubmit = async (e) => {
        e.preventDefault();
      
        const commentData = {
          user: session.user ? session.user.name: '',
          image: session.user? session.user.image: '',
          comment: newComment,
          id: uid(),
        };
      
        const docRef = doc(db, 'orders', orderState.id);
      
        try {
          await updateDoc(docRef, {
            comments: arrayUnion(commentData),
          });

        // Update the order state to include the new comment
        setOrderState((prevState) => ({
            ...prevState,
            comments: [...prevState.comments, commentData],
        }));
          
          
        } catch (error) {
          console.error('Error adding comment:', error);
          toast.error('An error occurred while adding the comment.', {
            hideProgressBar: true,
          });
        }
        
        setNewComment(''); // Clear the text field
      };

      //Delete Comment Logic
    const handleDeleteComment =  async (item) => {
        const docRef = doc(db, "orders", orderState.id);

        try {
            await updateDoc(docRef, {
              comments: arrayRemove(item)
            });

            // Update the state by removing the deleted comment
            setOrderState((prevState) => ({
                ...prevState,
                comments: prevState.comments.filter((comment) => comment.id !== item.id)
            }));
            
            console.log('Item deleted successfully');
          } catch (error) {
            console.error('Error deleting item:', error);
          }

    }
      

    
    return ( 
        <>
        <Fade in timeout={200}>
            <Container>
            {/* header section */}
            <Head>
                    <link rel="logo icon" href="/was_logo_red.png"/>
                    <title>W.A.S. | Order Display</title>
                    <meta name="all orders" content="all orders" />
                </Head>

            <Container > 

            <Container sx={{ display: 'flex', flexDirection:{xs:'column', md:'row'} , justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography variant='h4' gutterBottom sx={{ 
                            my: 2,
                            color: 'black',
                            fontFamily: 'Public Sans',
                            fontWeight: 800
                }}> {orderState.guest.groomFirstName} & {orderState.guest.brideFirstName}
                </Typography>
                <Typography color={'#bababa'} sx={{ mb:{xs:5, md:0}, mt:{xs:2, md:0}}} > <b>ID:</b> <em>{orderState.id}</em></Typography>
                <Typography color={'#bababa'} sx={{ mb:{xs:5, md:0}, mt:{xs:2, md:0}}} > <b>Created:</b> <em>{orderState.createdAt}</em></Typography>
                {orderState.updatedAt && (
                    <Typography color={'#bababa'} sx={{ mb:{xs:5, md:0}, mt:{xs:2, md:0}}} >
                        <b>Edited:</b> <em>{orderState.updatedAt}</em>
                    </Typography>
                )}
                
                
            </Container>
            
                <Box sx={{ pt:2, pr:4, display:'flex', justifyContent:{xs:'center', md:'flex-end'}}}>
                <Link href={"/orders/edit/" + orderState.id}><Button variant='outlined' disableElevation color='warning' sx={{ mr:2}}><EditIcon/></Button></Link>

                    <Button variant='outlined' disableElevation color='error' 
                    onClick={() => setConfirmOpen(true)}>
                        <DeleteForeverIcon/>
                    </Button>
                    <ConfirmDialog
                        open={confirmOpen}
                        setOpen={setConfirmOpen}

                        onConfirm={() => handleDelete(orderState.id)}
                    />
                </Box>

                    {/* Info Display */}
                <Grid container sx={{ flexDirection:{xs:'column', md:'row'}, p:4, justifyContent: 'space-between'}}>

                    {/* Rush & Issues */}
                <Divider  style={{width:'100%', height:'100%'}}>
                    <Chip label={<ToggleRushBtn rushVal = {orderState.rush}/>}/>
                    <Chip label={<ToggleIssueBtn issueVal = {orderState.issues}/>}/>
                </Divider>

                    
                {/* Main Details */}
                <Grid item xs={5} py={4}>
                    <Grid container sx={{display:'flex', flexDirection:{xs:'column', md:'row'}}}>
                        <Grid item xs={12} >
                            
                            {/* Status Update */}
                            <FormControl variant="outlined" fullWidth >
                                <InputLabel htmlFor="select-status">Status:</InputLabel>
                                <Select sx={{mb:3}}
                                    value={selectedOption}
                                    onChange={handleOptionChange}
                                    label="Choose a Status"
                                    inputProps={{
                                    name: 'select-status',
                                    id: 'select-status',
                                    
                                    }}
                                >
                                    {dataStatuses.map((item, index) => (
                                    <MenuItem value={item} key={index}>{item}</MenuItem>
                                    ))}
                                </Select>
                                <Button variant='outlined' onClick={handleUpdateDocument}>Update Status</Button>
                            </FormControl>

                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-start'}}}>

                        </Grid>
                   
                    </Grid>
                </Grid>

                <Grid item xs={5} py={4}>
                    <Grid container sx={{display:'flex', flexDirection:{xs:'column', md:'row'}}}>
                        <Grid item xs={12}>

                            {/* Assigned Update */}
                        <FormControl variant="outlined" fullWidth >
                                <InputLabel htmlFor="select-user">Assigned To:</InputLabel>
                                <Select sx={{mb:3}}
                                    value={selectedOptionAssigned} 
                                    onChange={handleOptionChangeAssigned}
                                    label="Choose a User to Assign"
                                    inputProps={{
                                    name: 'select-user',
                                    id: 'select-user',
                                    
                                    }}
                                >
                                    {dataUsers.map((itemAssigned, indexAssigned) => (
                                    <MenuItem value={itemAssigned} key={indexAssigned}>{itemAssigned}</MenuItem>
                                    ))}
                                </Select>
                                <Button variant='outlined' onClick={handleUpdateDocumentAssigned}>Assign Case</Button>
                            </FormControl>

                        
                        </Grid>
                    </Grid>
                </Grid>



                
                    {/* Location Details */}
                <Divider  style={{width:'100%', height:'100%'}}><Chip label="LOCATION DETAILS" /></Divider>

                  <Grid item xs={5} py={4} >
                    <Grid container sx={{display:'flex', flexDirection:{xs:'column', md:'row'}}}>
                        <Grid item xs={6}>
                            <Typography>Region:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                            <Typography variant='h6'>{orderState.location.region}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>Room #:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                            <Typography variant='h6'>{orderState.location.room}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>Videographer:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                            <Typography variant='h6'>{orderState.location.videographer}</Typography>
                        </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={5} py={4}>
                    <Grid container sx={{display:'flex', flexDirection:{xs:'column', md:'row'}}}>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-start'}}}>
                            <Typography>Wedding Date:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                            <Typography variant='h6'>{orderState.location.weddingDate}</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-start'}}}>
                            <Typography>Release:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                            <Typography variant='h6'>{orderState.location.release}</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-start'}}}>
                            <Typography>Due:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                            <Typography variant='h6'>{orderState.package.due}</Typography>
                        </Grid>  
                        </Grid>
                  </Grid>

                  {/* Guest Details */}

                  <Divider style={{width:'100%', height:'100%'}}><Chip label="GUEST DETAILS" /></Divider>

                  <Grid item xs={5} py={4} >
                    <Grid container sx={{display:'flex', flexDirection:{xs:'column', md:'row'}}}>
                        <Grid item xs={6}>
                            <Typography>Booking Number:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                            <Typography variant='h6'>{orderState.guest.bookingNumber}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>Groom First Name:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                            <Typography variant='h6'>{orderState.guest.groomFirstName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>Bride First Name:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                            <Typography variant='h6'>{orderState.guest.brideFirstName}</Typography>
                        </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={5} py={4}>
                    <Grid container sx={{display:'flex', flexDirection:{xs:'column', md:'row'}}}>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-start'}}}>
                            <Typography>Receipt Number:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                            <Typography variant='h6'>{orderState.guest.receiptNumber}</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-start'}}}>
                            <Typography>Groom Last Name:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                            <Typography variant='h6'>{orderState.guest.groomLastName}</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-start'}}}>
                            <Typography>Bride Last Name:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                            <Typography variant='h6'>{orderState.guest.brideLastName}</Typography>
                        </Grid>  
                        </Grid>
                  </Grid>

                    {/* Package Details */}
                  <Divider style={{width:'100%', height:'100%'}}><Chip label="PACKAGE DETAILS" /></Divider>

                  <Grid item xs={5} py={4} >
                    <Grid container sx={{display:'flex', flexDirection:{xs:'column', md:'row'}}}>
                        <Grid item xs={6}>
                            <Typography>Package Name:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                            <Typography variant='h6'>{orderState.package.packageName}</Typography>
                        </Grid>  
                        
                    </Grid>
                  </Grid>

                  <Grid item xs={5} py={4}>
                    <Grid container sx={{display:'flex', flexDirection:{xs:'column', md:'row'}}}>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-start'}}}>
                            <Typography>Video Title:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                            <Typography variant='h6'>{orderState.package.videoTitle}</Typography>
                        </Grid>  
                    </Grid>
                  </Grid>

                    {/* Add-Ons */}

                    {orderState.package.addons.length > 0 ? (
                        <Divider style={{width:'100%', height:'100%'}}><Chip label="ADD-ONS PURCHASED" /></Divider>
                    ) : (
                        null
                    )}
                        {orderState.package.addons.map((obj) => (
                            <Grid key={obj.name} item xs={5} py={2} >
                                <Grid container sx={{display:'flex', flexDirection:{xs:'column', md:'row'}}}>
                                    
                                    <Grid item xs={6}>
                                        <Typography >{obj.name}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                                        <Typography variant='h6'>x{obj.quantity}</Typography>
                                    </Grid>  
                                    
                                </Grid>
                            </Grid>
                        ))}
                        
                        
                
                    {/*Music  */}

                    {orderState.package.music.length > 0 ? (
                        <Divider style={{width:'100%', height:'100%'}}><Chip label="MUSIC SELECTED" /></Divider>
                    ) : (
                        null
                    )}
               

                  {orderState.package.music.map((song) => (
                            <Grid key={song} item xs={5} py={2} >
                            <Grid container sx={{display:'flex', flexDirection:{xs:'column', md:'row'}}}>
                                <Grid item xs={6}>
                                    <Typography>{song}</Typography>
                                </Grid>
                                <Grid item xs={6} sx={{display:'flex', justifyContent:{md:'flex-end'}}}>
                                        <MusicNoteIcon/>
                                </Grid>  
                                
                            </Grid>
                        </Grid>
                        ))}
                    


                    {/* Comment test */}

                    <Divider style={{width:'100%', height:'100%'}}><Chip label="COMMENTS" /></Divider>

                    <FormControl  variant="standard" onSubmit={handleCommentSubmit} component="form" sx={{width:'100%', mt:4}} noValidate autoComplete="off">
                        <Box>
                            <CommentIcon color='primary'/>
                        <TextField 
                            fullWidth
                            label={'Type a Comment & Press Enter!'} 
                            id="commentBox"
                            value={newComment} // Bind the input value to the state variable
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        </Box> 
                    </FormControl>

                    <List sx={{ width: '100%'}} >
                        {orderState?.comments?.map((item) => (
                            <Fragment key={item.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                <Avatar alt={item.user || ''} 
                                        src={item.image || ''}  
                                        sx={{ bgcolor: 'blue[700]' }} />
                                </ListItemAvatar>
                                <ListItemText sx={{ width: '100%'}}  
                                primary={<>{item.user.split(' ')[0]}</>}
                                secondary={<>{item.comment}</>}
                                />
                                <ListItemText 
                                onClick={() => handleDeleteComment(item)}
                                secondary={<>
                                    <IconButton aria-label="delete" size="small">
                                        <DeleteForeverIcon/>
                                    </IconButton>
                                </>}
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            </Fragment>
                        ))}
                    </List>


                </Grid>
          </Container>
          </Container>
          </Fade>
        </>
     );
}
 
export default Details;




  
  