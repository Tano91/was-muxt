import Head from 'next/head'
import { Container, Typography } from '@mui/material'
import OrderDisplay from './orders'
import Search from '../comps/Search'
import {ordersColRef, statusesColRef, usersColRef } from '../firebase/config'
import { getDocs, query, orderBy } from "firebase/firestore"; 
import Fade from '@mui/material/Fade';

export default function Home(props) {

  return (
        <>
        <Container>
            {/* Header section */}
          <Head>
            <link rel="logo icon" href="/was_logo_red.png"/>
            <title>All Orders - W.A.S.</title>
            <meta name="home" content="home" />
          </Head>
          
          {/* Content Section */}
          <Fade in timeout={500}>

            <Container > 
              <Container sx={{ display: 'flex', flexDirection:{xs:'column', md:'row'} , justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography variant='h4' gutterBottom sx={{ 
                            my: 2,
                            color: 'black',
                            fontFamily: 'Public Sans',
                            fontWeight: 800
                    }}>Orders
                </Typography>
                <Search orders={props.orders} statuses={props.statuses} users={props.users}/>
              </Container>
              
              {/* Orders Component */}
              <OrderDisplay orders={props.orders} statuses={props.statuses} users={props.users}  />
              
            </Container>
          
          </Fade>
        </Container>
        </>
  )
}


//ISR Revalidate Incrementally with updated data on new request
export async function getStaticProps() {
  // Create a query to retrieve the ordered documents
  const orderedQuery = query(ordersColRef, orderBy("createdAt", "desc"));

  // Get Collection Data
  const fetchedOrders = await getDocs(orderedQuery);
  const fetchedStatuses = await getDocs(statusesColRef);
  const fetchedUsers = await getDocs(usersColRef);

  // Store Collection Data in Object
  const dataOrders = fetchedOrders.docs.map((doc) => {
    const data = doc.data();
    // Check if createdAt field exists and is a valid date
    const createdAt = data.createdAt && data.createdAt.toDate() ? data.createdAt.toDate().toISOString() : null;
    const updatedAt = data.updatedAt && data.updatedAt.toDate() ? data.updatedAt.toDate().toISOString() : null;
    return { ...data, id: doc.id, createdAt, updatedAt };
  });

  const dataStatuses = fetchedStatuses.docs.map((doc) => {
    return { ...doc.data(), id: doc.id }; 
  });

  const dataUsers = fetchedUsers.docs.map((doc) => {
    return { ...doc.data(), id: doc.id }; 
  });

  // Return Collection Data as a Prop for Component
  return {
    props: { orders: dataOrders, statuses: dataStatuses, users: dataUsers },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 2 seconds
    revalidate: 2,
  };
}

