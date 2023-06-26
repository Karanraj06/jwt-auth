import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Separator } from './ui/separator';
import axios from 'axios';
import { useUserInfo } from '../context/user-info-context';

const registerFormSchema = z.object({
  username: z.string().min(2).max(30),
  email: z.string().email(),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters long',
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
        'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
    }),
  confirmPassword: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters long',
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
        'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
    }),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const defaultValues: Partial<RegisterFormValues> = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { setUserInfo } = useUserInfo();
  const navigate = useNavigate();

  async function onSubmit(data: RegisterFormValues) {
    if (data.password !== data.confirmPassword) {
      return toast({
        title: 'Register failed',
        description: 'Passwords do not match',
      });
    }

    try {
      const response = await axios.post('/api/users', {
        name: data.username,
        email: data.email,
        password: data.password,
      });
      setUserInfo(response.data);
      navigate('/');
    } catch (error) {
      toast({
        title: 'Register failed',
        description: 'Invalid email or password',
      });
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-medium'>Register</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Username'
                    autoComplete='username'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='karan@karanraj.me' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Password'
                    type='password'
                    autoComplete='new-password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Confirm password'
                    type='password'
                    autoComplete='new-password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Register</Button>
          <div>
            Already have an account?{' '}
            <Link
              to='/login'
              className='text-[#0070f3] hover:text-[#52a8ff] underline'
            >
              Login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
