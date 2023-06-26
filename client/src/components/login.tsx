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
import { useUserInfo } from '../context/user-info-context';
import axios from 'axios';

const loginFormSchema = z.object({
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
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const defaultValues: Partial<LoginFormValues> = {
  email: '',
  password: '',
};

export default function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { setUserInfo } = useUserInfo();
  const navigate = useNavigate();

  async function onSubmit(data: LoginFormValues) {
    try {
      const response = await axios.post('/api/users/auth', data);
      setUserInfo(response.data);
      navigate('/');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
      });
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-medium'>Sign In</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='karan@karanraj.me'
                    autoComplete='email'
                    {...field}
                  />
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
                    autoComplete='current-password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Sign In</Button>
          <div>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='text-[#0070f3] hover:text-[#52a8ff] underline'
            >
              Register
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
