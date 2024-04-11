import Navbar from "./Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from "next-auth/react";
import Spinner from './Spinner'
import LoginPage from "../pages/login";

const Layout = ({ children }) => {

  const { status } = useSession();


  if (status !== 'authenticated') {
    return <LoginPage />;
 }
      
    return (
        <div>
            <Navbar />
            { children }
            <ToastContainer />
        </div>
     );
}
 
export default Layout;