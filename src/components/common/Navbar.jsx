import {
  Navbar, Typography, Button, Menu, MenuHandler, MenuList, MenuItem, Avatar, Badge, IconButton
} from "@material-tailwind/react";
import { BellIcon } from "@heroicons/react/24/solid";
import { useGoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from "react";
import axios from 'axios';
import SignUpForm from "../../pages/signUpForm";
import { deleteToken, fetchToken, addToken } from '../../utility/jwtLocalStorage';
import { deleteUser, fetchUser, addUser } from "../../utility/userLocalStorage";
import { postDataFromApi, getDataFromApi, patchDataFromApi } from "../../utility/api";
import { useNavigate } from 'react-router-dom';

export default function StickyNavbar() {
  const navigate = useNavigate();
  const [googleUser, setGoogleUser] = useState(null);
  const [openSignup, setOpenSignup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // --- NOTIFICATION STATE ---
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const authStatus = !!fetchToken();
    setIsAuthenticated(authStatus);
    setUserData(fetchUser());

    // Fetch notifications only if the user is logged in
    if (authStatus) {
      getDataFromApi('/notifications')
        .then(res => {
          if (res.success) {
            setNotifications(res.notifications);
          }
        }).catch(err => console.error("Failed to fetch notifications:", err));
    }
  }, []);

  const handleMarkAsRead = () => {
    if (notifications.length > 0) {
      patchDataFromApi('/notifications/mark-read')
        .then(res => {
            if(res.success) {
                setNotifications([]); // Clear notifications from the frontend state
            }
        });
    }
  };

  // --- SIGN IN LOGIC ---
  const handleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const googleUserInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const loginData = await postDataFromApi('/users/login', { email: googleUserInfo.data.email });
        if (loginData.success) {
          addToken(loginData.token);
          addUser(loginData.user);
          window.location.reload();
        }
      } catch (error) {
        alert(error.response?.data?.message || "Login failed. Please sign up first.");
      }
    },
    onError: () => alert('Google login failed. Please try again.'),
  });

  // --- SIGN UP LOGIC ---
  const handleSignUp = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const googleUserInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const checkResponse = await postDataFromApi('/users/checkUserExists', { email: googleUserInfo.data.email });
        if (checkResponse.exists) {
            alert("An account with this email already exists. Please Sign In.");
        } else {
            setGoogleUser(googleUserInfo.data);
            setOpenSignup(true);
        }
      } catch (error) {
        alert("An error occurred during signup. Please try again.");
      }
    },
    onError: () => alert('Google signup failed. Please try again.'),
  });

  const handleSignOut = () => {
    deleteToken();
    deleteUser();
    navigate('/');
    setTimeout(() => window.location.reload(), 100);
  };

  // --- NOTIFICATION MENU COMPONENT ---
  const NotificationMenu = () => (
      <Menu onOpen={handleMarkAsRead}>
        <MenuHandler>
            <IconButton variant="text">
            <Badge color="red" content={notifications.length} invisible={notifications.length === 0}>
                <BellIcon className="h-6 w-6 text-white" />
            </Badge>
            </IconButton>
        </MenuHandler>
        <MenuList className="bg-nightfall-card border-gray-700 text-white max-h-80">
            {notifications.length > 0 ? (
                notifications.map(notif => (
                    <MenuItem key={notif._id} className="hover:bg-white/10 flex flex-col items-start gap-2 whitespace-normal">
                       <Typography variant="small">{notif.message}</Typography>
                       <Typography variant="small" className="text-xs text-gray-500">
                           {new Date(notif.createdAt).toLocaleString()}
                       </Typography>
                    </MenuItem>
                ))
            ) : (
                <MenuItem className="hover:bg-white/10">No new notifications</MenuItem>
            )}
        </MenuList>
      </Menu>
  );

  // --- USER AVATAR MENU COMPONENT ---
  const CustomMenu = () => (
    <Menu>
      <MenuHandler>
        <Avatar
          variant="circular"
          alt={userData?.name || "User"}
          className="cursor-pointer border-2 border-accent-purple"
          src={userData?.profileImage}
        />
      </MenuHandler>
      <MenuList className="bg-nightfall-card border-gray-700 text-white">
        <MenuItem className="hover:bg-white/10" onClick={() => navigate('/accounts', { state: { value: 'profile' } })}>My Profile</MenuItem>
        <MenuItem className="hover:bg-white/10" onClick={() => navigate('/accounts', { state: { value: 'lending' } })}>My Lending</MenuItem>
        <MenuItem className="hover:bg-white/10" onClick={() => navigate('/accounts', { state: { value: 'borrow' } })}>My Borrowing</MenuItem>
        <hr className="my-2 border-gray-700" />
        <MenuItem onClick={handleSignOut} className="text-red-400 hover:bg-white/10 hover:text-red-500">Sign Out</MenuItem>
      </MenuList>
    </Menu>
  );

  return (
    <Navbar className="sticky top-0 z-50 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 bg-nightfall-card shadow-lg border-b border-gray-800">
      <SignUpForm open={openSignup} setOpen={setOpenSignup} userData={googleUser} />
      <div className="flex items-center justify-between text-gray-200">
        <Typography as="a" href="/" className="mr-4 cursor-pointer py-1.5 font-bold text-xl md:text-2xl text-white">
          HostelBuddy
        </Typography>
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <div className="flex items-center gap-x-2 md:gap-x-4">
              <button className="font-semibold text-white hover:text-accent-purple transition-colors px-2 md:px-4 py-2" onClick={() => handleSignUp()}>
                <span>Sign Up</span>
              </button>
              <button className="animated-button" onClick={() => handleSignIn()}>
                <span>Sign In</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
               <Button className="capitalize text-sm py-2 bg-accent-purple" onClick={() => navigate('/lend')}>
                Lend Item
              </Button>
              <NotificationMenu />
              <CustomMenu />
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
}