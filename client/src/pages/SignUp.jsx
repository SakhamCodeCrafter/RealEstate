import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        showToast(data.message, 'error');
        return;
      }
      
      setLoading(false);
      showToast('Sign up successful! Please sign in.', 'success');
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="h-[92vh] pt-[7rem] mx-auto " style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("https://www.bproperty.com/blog/wp-content/uploads/2021/04/house-1867187_1920.jpg")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      transition: "background-image 1s  ease-in",
      position: "relative",
    }}>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7 text-white'>Sign Up</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='text'
            placeholder='Username'
            className='border p-3 rounded-lg'
            id='username'
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='Email'
            className='border p-3 rounded-lg'
            id='email'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Password'
            className='border p-3 rounded-lg'
            id='password'
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className='bg-slate-700 text-white p-3 rounded-full uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
          <OAuth/>
        </form>
        <div className='flex gap-2 mt-5 justify-center'>
          <p className='text-white'>Have an account?</p>
          <Link to={'/sign-in'}>
            <span className='text-blue-400'>Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
