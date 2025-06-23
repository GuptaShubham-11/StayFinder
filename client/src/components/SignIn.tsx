import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signinValidation } from '@/schemas/singinValidation';
import type { SigninInput } from '@/schemas/singinValidation';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from './';
import { userApi } from '@/api/userApi';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export default function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninInput>({
    resolver: zodResolver(signinValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login } = useAuthStore.getState();
  const navigate = useNavigate();

  const onSubmit = async (data: SigninInput) => {
    try {
      const response = await userApi.signIn(data);
      if (response.statusCode < 400) {
        toast.success('Logged in successfully!');
        login(response.data.user);
        navigate('/listings');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md space-y-6 p-6 rounded-2xl shadow-xl border bg-white">
        <h2 className="text-2xl font-semibold text-txt text-center">
          Sign into your account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-txt flex items-center gap-2">
              <Mail className="w-4 h-4 text-acc" />
              Email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              className="bg-blue-50 text-txt"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-txt flex items-center gap-2">
              <Lock className="w-4 h-4 text-acc" />
              Password
            </label>
            <Input
              type="password"
              placeholder="********"
              className="bg-blue-50 text-txt"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-pri text-white hover:bg-pri/90 cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-sec">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-acc cursor-pointer underline">
            Sign up
          </Link>
          {' ||  '}
          <Link to="/" className="text-acc cursor-pointer underline">
            Go to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
