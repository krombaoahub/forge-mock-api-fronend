import { useForm, type FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type LoginFormFields } from '@/zod/schema';
import AuthLayout from '@/layouts/auth-layout';
import '@/App.css'
import { Link, useNavigate } from 'react-router-dom';
import { LoginWithGoogle } from '@/components/login-with-button';
import { useAuthContext } from '@/context';
import AppLogo from '@/components/logo';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context';
import { useAppSelector } from '@/states/hooks';
import { setErrorMsg } from '@/states/slice/app-slice';
import { loadingAndErrorSelector } from '@/states/selector';
import type { InputFormInterface, TInputTypes } from '@/interfaces';

interface LoginForm extends InputFormInterface {
    field: keyof LoginFormFields
}

const inputFields = [{
    placeholder: 'example@domain.com',
    type: 'text' as TInputTypes,
    field: 'email' as keyof LoginFormFields,
    label: 'Email'
}, {
    placeholder: '********',
    type: 'password' as TInputTypes,
    field: 'password' as keyof LoginFormFields,
    label: 'Password',
}]

export default function LoginPage() {
    const { loading, errorMsg } = useAppSelector(loadingAndErrorSelector);
    const navigate = useNavigate()

    const [errorToast, setErrorToast] = useState<boolean>(false)
    const { handleLogin } = useAuthContext()
    const { delayTimer } = useAppContext()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<LoginFormFields>({
        resolver: zodResolver(loginFormSchema),
    });

    useEffect(() => {
        if (errorMsg || errors.root?.message) {
            setErrorToast(true)
            delayTimer(() => {
                setErrorToast(false)
                setErrorMsg('')
            }, 2500)
        }
    }, [errorMsg, errors.root?.message, delayTimer]);

    useEffect(() => {
        return () => reset(); // cleanup on unmount
    }, [reset]);

    return (
        <section id="loginRef">
            <AuthLayout>
                <div className='w-full border rounded-md border-secondary/50'>
                    <div className="card max-w-md">
                        <div className="card-body">
                            <AppLogo className='mx-auto' logoOnly={true} />
                            <h5 className="card-title mb-2.5">Sign In</h5>
                            <p className="mb-4">Login your ForgeMockAPI account.</p>
                            <div className="card-actions gap-5">

                                <div className={`transition-all rounded border alert-error alert-soft w-full alert ${!errorToast ? 'p-0 opacity-0' : 'p-5 opacity-100 '}`}>
                                    {errors.root?.message && (
                                        <small className="font-medium">{errors.root.message}</small>
                                    )}
                                    {errorMsg && <small className='text-red-500'>{errorMsg}</small>}
                                </div>

                                <form onSubmit={handleSubmit((data) => handleLogin(data, navigate))} className={`flex flex-col gap-6 w-full p-6 pt-0`} >
                                    {inputFields.map((input: LoginForm, key: number) => {
                                        const { field, placeholder, label, type } = input
                                        const fieldError = errors[field] as FieldError | undefined;
                                        const keyId = 'id-' + key
                                        return (
                                            <div className="input-floating" key={key}>
                                                <input type={type} placeholder={placeholder} id={keyId}
                                                    {...register(field)}
                                                    className={`input border-0 border-b rounded-none rounded-t`} />
                                                <label htmlFor={keyId} className="input-floating-label" >{label}</label>
                                                {fieldError && fieldError.message && (<div className="text-sm mt-2 text-red-400 text-left">{fieldError.message}</div>)}
                                            </div>
                                        )
                                    })}
                                    <div className="flex justify-center w-full">
                                        <button type="submit" className={`w-full btn btn-primary ${loading ? 'btn-disabled' : ''}`}>
                                            {loading && <span className="loading loading-spinner"></span>}
                                            Login
                                        </button>
                                    </div>
                                </form>
                                {/* <FormField handleSubmit={handleSubmit((data) => handleLogin(data, navigate))} className='w-full' inputs={[{
                                    className: 'border-0 border-b-1 rounded-none rounded-t',
                                    register,
                                    placeholder: 'example@domain.com',
                                    errors,
                                    field: 'email',
                                    label: 'Email'
                                }, {
                                    className: 'border-0 border-b-1 rounded-none rounded-t',
                                    register,
                                    placeholder: '********',
                                    errors,
                                    type: 'password',
                                    field: 'password',
                                    label: 'Password',
                                }]} >

                                    <div className="flex justify-center w-full">
                                        <button type="submit" className={`w-full btn btn-primary ${loading ? 'btn-disabled' : ''}`}>
                                            {loading && <span className="loading loading-spinner"></span>}
                                            Login
                                        </button>
                                    </div>
                                </FormField> */}

                                <div className="divider">OR</div>

                                <div className='mx-auto w-full gap-5 flex flex-col'>
                                    <LoginWithGoogle />
                                    <div>
                                        <span className='me-2'>Don't have an account?</span>
                                        <Link to={'/register'} className="link link-accent link-animated hover:text-base-content">Sign up</Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        </section>
    );
};