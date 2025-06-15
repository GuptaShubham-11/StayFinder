'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock } from 'lucide-react';
import type { SigninInput } from '@/schemas/singinValidation';
import { signinValidation } from '@/schemas/singinValidation';
import { Link } from 'react-router-dom';


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

    const onSubmit = async (data: SigninInput) => {
        console.log('Signin data:', data);
        // TODO: Send to backend
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg px-4">
            <div className="w-full max-w-md space-y-6 p-6 rounded-2xl shadow-xl border bg-white">
                <h2 className="text-2xl font-semibold text-txt text-center">Sign into your account</h2>

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
                            className="bg-bg text-txt"
                            {...register('email')}
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
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
                            className="bg-bg text-txt"
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-pri text-white hover:bg-pri/90 cursor-pointer"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signging in...' : 'Sign In'}
                    </Button>
                </form>

                <p className="text-center text-sm text-sec">
                    Don’t have an account?{' '}
                    <Link to="/signup" className="text-acc cursor-pointer underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
