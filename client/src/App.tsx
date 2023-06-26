import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/nav';
import { Toaster } from './components/ui/toaster';
import LoginForm from './components/login';
import RegisterForm from './components/register';
import ProfileForm from './components/profile';
import { useUserInfo } from './context/user-info-context';

export default function App() {
  const { userInfo } = useUserInfo() ?? {};

  return (
    <div className='min-h-screen'>
      <Navbar />
      <div className='mx-auto max-w-2xl px-6 py-20'>
        <Routes>
          <Route path='/' element={<div>Home</div>} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<RegisterForm />} />
          <Route
            path='/profile'
            element={
              userInfo ? <ProfileForm /> : <Navigate to='/login' replace />
            }
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}
