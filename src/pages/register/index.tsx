import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerFormSchema, type RegisterFormFields } from '@/zod/schema';
import AuthLayout from '@/layouts/auth-layout';
import '@/App.css'
import { FormField } from '@/components/forms';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import AppLogo from '@/components/logo';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useGotoSection } from '@/hooks/use-goto-section';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { setErrorMsg } from '@/states/slice/app-slice';
import { loadingAndErrorSelector } from '@/states/selector';

export default function RegisterPage() {
    const { loading, errorMsg } = useAppSelector(loadingAndErrorSelector);
    const dispatch = useAppDispatch()

    const navigate = useNavigate()
    const { handleRegister } = useAuthContext()
    const [errorToast, setErrorToast] = useState<boolean>(false)
    const { delayTimer } = useAppContext()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<RegisterFormFields>({
        resolver: zodResolver(registerFormSchema),
    });

    useEffect(() => {
        if (errorMsg || errors.root?.message) {
            setErrorToast(true)
            delayTimer(() => {
                setErrorToast(false)
                dispatch(setErrorMsg(''))
            }, 2500)
        }
    }, [errorMsg, errors.root?.message]);

    useEffect(() => {
        return () => reset(); // cleanup on unmount
    }, []);


    const handleGotoSection = useGotoSection()
    return (
        <AuthLayout>
            <div className='w-full border rounded-md border-secondary/50'>
                <div className="card max-w-md">
                    <div className="card-body ">
                        <div className="flex mb-2"> <AppLogo className='mx-auto' logoOnly={true} /></div>
                        <h5 className="card-title mb-2.5">Sign Up</h5>
                        <p className="mb-4">Join us by creating an account.</p>
                        <div className="card-actions gap-5">
                            <div className={`transition-all rounded border alert-error alert-soft w-full alert ${!errorToast ? 'p-0 opacity-0' : 'p-5 opacity-100 '}`}>
                                {errors.root?.message && (
                                    <small className="font-medium">{errors.root.message}</small>
                                )}
                                {errorMsg && <small className='text-red-500'>{errorMsg}</small>}
                            </div>

                            <FormField handleSubmit={handleSubmit((data) => handleRegister(data, navigate))} className='w-full' inputs={[{
                                register,
                                errors,
                                className: 'border-0 border-b-1 rounded-none rounded-t',
                                placeholder: 'John Doe',
                                field: 'name',
                                label: 'Name'
                            }, {
                                register,
                                errors,
                                className: 'border-0 border-b-1 rounded-none rounded-t',
                                placeholder: 'example@domain.com',
                                field: 'email',
                                label: 'Email'
                            }, {
                                register,
                                errors,
                                className: 'border-0 border-b-1 rounded-none rounded-t',
                                placeholder: '********',
                                type: 'password',
                                field: 'password',
                                label: 'Password',
                                passwordMeter: true
                            }, {
                                register,
                                errors,
                                className: 'border-0 border-b-1 rounded-none rounded-t',
                                placeholder: '********',
                                type: 'password',
                                field: 'confirmPassword',
                                label: 'Confirm password'
                            }]} >

                                <div className="flex justify-center w-full">
                                    <button type="submit" className={`w-full btn btn-primary ${loading ? 'btn-disabled' : ''}`}>
                                        {loading && <span className="loading loading-spinner"></span>}
                                        Register
                                    </button>
                                </div>
                            </FormField>

                            <div className="divider">OR</div>

                            <div className='mx-auto w-full'>
                                <span className='me-2'> Already have an account?</span>
                                <Link onClick={() => setTimeout(() => { handleGotoSection('loginRef') }, 100)} to={'/login'} className="link link-accent link-animated hover:text-base-content">Login here</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};