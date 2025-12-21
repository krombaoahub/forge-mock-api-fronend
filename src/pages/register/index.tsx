import { useForm, type FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerFormSchema, type RegisterFormFields } from '@/zod/schema';
import AuthLayout from '@/layouts/auth-layout';
import '@/App.css'
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context';
import AppLogo from '@/components/logo';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context';
import { useGotoSection } from '@/hooks/use-goto-section';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { setErrorMsg } from '@/states/slice/app-slice';
import { loadingAndErrorSelector } from '@/states/selector';
import type { InputFormInterface, TInputTypes } from '@/interfaces';

interface RegisterForm extends InputFormInterface {
    field: keyof RegisterFormFields
}

const inputFields = [{
    placeholder: 'John Doe',
    type: 'text' as TInputTypes,
    field: 'name' as keyof RegisterFormFields,
    label: 'Name'
}, {
    placeholder: 'example@domain.com',
    type: 'text' as TInputTypes,
    field: 'email' as keyof RegisterFormFields,
    label: 'Email'
}, {
    placeholder: '********',
    type: 'password' as TInputTypes,
    field: 'password' as keyof RegisterFormFields,
    label: 'Password',
    passwordMeter: true
}, {
    placeholder: '********',
    type: 'password' as TInputTypes,
    field: 'confirmPassword' as keyof RegisterFormFields,
    label: 'Confirm password'
}]

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
    }, [errorMsg, errors.root?.message, delayTimer, dispatch]);

    useEffect(() => {
        return () => reset(); // cleanup on unmount
    }, [reset]);


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

                            <form onSubmit={handleSubmit((data) => handleRegister(data, navigate))} className={`flex flex-col gap-6 w-full p-6 pt-0`} >
                                {inputFields.map((input: RegisterForm, key: number) => {
                                    const { field, placeholder, label, type } = input
                                    const fieldError = errors[field] as FieldError | undefined;
                                    const keyId = 'id-' + key
                                    return (
                                        <div className="input-floating" key={key}>
                                            <input type={type} placeholder={placeholder} id={keyId}
                                                {...register(field)}
                                                className={`input border-0 border-b rounded-none rounded-t`} />
                                            <label htmlFor={keyId} className="input-floating-label" >{label}</label>
                                            {fieldError && fieldError.message && (
                                                <div className="text-sm mt-2 text-red-400 text-left">
                                                    {fieldError.message}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                                <div className="flex justify-center w-full">
                                    <button type="submit" className={`w-full btn btn-primary ${loading ? 'btn-disabled' : ''}`}>
                                        {loading && <span className="loading loading-spinner"></span>}
                                        Register
                                    </button>
                                </div>
                            </form>
                            {/* <FormField handleSubmit={handleSubmit((data) => handleRegister(data, navigate))} className='w-full' inputs={[{
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
                            </FormField> */}

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