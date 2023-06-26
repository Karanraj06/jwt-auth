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
import { Separator } from './ui/separator';
import { useUserInfo } from '../context/user-info-context';
import axios from 'axios';

const profileFormSchema = z.object({
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

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const { userInfo, setUserInfo } = useUserInfo();

  const defaultValues: Partial<ProfileFormValues> = {
    username: userInfo?.name,
    email: userInfo?.email,
    password: '',
    confirmPassword: '',
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: ProfileFormValues) {
    if (data.password !== data.confirmPassword) {
      return toast({
        title: 'Register failed',
        description: 'Passwords do not match',
      });
    }

    try {
      const response = await axios.put('/api/users/profile', {
        _id: userInfo?._id,
        name: data.username,
        email: data.email,
        password: data.password,
      });

      setUserInfo(response.data);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated',
      });
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
        <h3 className='text-2xl font-medium'>Update Profile</h3>
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
          <Button type='submit'>Update profile</Button>
        </form>
      </Form>
    </div>
  );
}
