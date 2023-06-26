import { Link, useNavigate } from 'react-router-dom';
import { useUserInfo } from '../context/user-info-context';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import axios from 'axios';

export default function Navbar() {
  const { userInfo, removeUserInfo } = useUserInfo() ?? {};
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await axios.post('/api/users/logout');
      removeUserInfo();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <nav className='bg-black'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <span className='text-white font-bold'>JWT Auth</span>
            </div>
          </div>
          <div className='flex items-center'>
            <div className='ml-4'>
              <span className='text-white'>
                {userInfo ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant='secondary'>{userInfo.name}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-56'>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link to='/profile'>Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant='secondary'
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
