import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, UserCheck } from 'lucide-react';
import { signupValidation } from '@/schemas/signupValidation';
import type { SignupInput } from '@/schemas/signupValidation';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from './';
import { userApi } from '@/api/userApi';
import { toast } from 'sonner';

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      email: '',
      password: '',
      role: 'user',
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: SignupInput) => {
    try {
      const response = await userApi.signUp(data);
      if (response.statusCode < 400) {
        toast.success('Account created successfully!');
        navigate('/signin');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md space-y-6 p-6 rounded-2xl shadow-xl border bg-white">
        <h2 className="text-2xl font-semibold text-txt text-center">
          Create your account
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

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-txt flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-acc" />
              Role
            </label>
            <select
              className="w-full bg-blue-50 text-txt border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pri"
              {...register('role')}
            >
              <option value="user">User</option>
              <option value="host">Host</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-pri text-white hover:bg-pri/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-sm text-sec">
          Already have an account?{' '}
          <Link to="/signin" className="text-acc cursor-pointer underline">
            Sign in
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
