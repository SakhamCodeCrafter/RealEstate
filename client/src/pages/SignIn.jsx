import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data.message);

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        showToast(data.message, 'error');
        return;
      }

      dispatch(signInSuccess(data));
      showToast('Sign-in successful!', 'success');
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
      showToast(error.message, 'error');
    }
  };

  
  return (
    <div
        className="h-[92vh] pt-[8.5rem] mx-auto"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("https://www.bproperty.com/blog/wp-content/uploads/2021/04/house-1867187_1920.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1s  ease-in",
          position: "relative",
        }}
      >
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-white text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
          required
        />
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-full uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5 text-white justify-center'>
        <p>Don't have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-400'>Sign up</span>
        </Link>
      </div>
     
    </div>
    </div>
  );
}
