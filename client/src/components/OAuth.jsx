import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import app from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showToast = (message, type = 'info') => {
    toast[type](message, {
      position: 'top-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const response = await axios.post('/api/auth/google', {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      });

      const data = response.data;
      dispatch(signInSuccess(data));
      showToast('Sign-in with Google successful!', 'success');
      navigate('/');
      
    } catch (error) {
      console.log('Could not sign in with Google', error);
      showToast('Could not sign in with Google', 'error');
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-600 text-white p-3 rounded-full uppercase hover:opacity-95'
    >
      Continue with Google
    </button>
  );
}
