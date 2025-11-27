// src/schemas.ts
import { z } from 'zod';

// rules
export const registerFormSchema = z.object({
    name: z.string().min(1, { message: "This field cannot be empty." }),
    email: z.email(),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must include an uppercase letter')
        .regex(/[a-z]/, 'Must include a lowercase letter')
        .regex(/[0-9]/, 'Must include a number')
        .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
    confirmPassword: z.string().min(8, { message: "TPassword must be at least 8 characters." }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
})

export const loginFormSchema = z.object({
    email: z.email(),
    password: z.string().min(1, { message: 'Password must not be empty.' })
})

export const createWorkspaceFormSchema = z.object({
    name: z.string().min(1, { message: "This field cannot be empty." }),
})


export const collectionFormSchema = z.object({
    name: z.string().min(1, { message: 'Name must not be empty.' }),
    field_1: z.string().min(1, { message: 'Field 1 must not be empty.' }),
    field_2: z.string().min(1, { message: 'Field 2 must not be empty.' }).optional(),
    field_3: z.string().min(1, { message: 'Field 3 must not be empty.' }).optional(),
    field_4: z.string().min(1, { message: 'Field 4 must not be empty.' }).optional(),
    field_5: z.string().min(1, { message: 'Field 5 must not be empty.' }).optional(),
    field_6: z.string().min(1, { message: 'Field 6 must not be empty.' }).optional(),
    field_7: z.string().min(1, { message: 'Field 7 must not be empty.' }).optional(),
    field_8: z.string().min(1, { message: 'Field 8 must not be empty.' }).optional(),
    field_9: z.string().min(1, { message: 'Field 9 must not be empty.' }).optional(),
    field_10: z.string().min(1, { message: 'Field 10 must not be empty.' }).optional(),
    select_1: z.any(),
    select_2: z.any().optional(),
    select_3: z.any().optional(),
    select_4: z.any().optional(),
    select_5: z.any().optional(),
    select_6: z.any().optional(),
    select_7: z.any().optional(),
    select_8: z.any().optional(),
    select_9: z.any().optional(),
    select_10: z.any().optional(),
})


// type
export type RegisterFormFields = z.infer<typeof registerFormSchema>;
export type LoginFormFields = z.infer<typeof loginFormSchema>;
export type CreateWorkspaceFormFields = z.infer<typeof createWorkspaceFormSchema>;
export type CollectionFormFields = z.infer<typeof collectionFormSchema>;