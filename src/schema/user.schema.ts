import { TypeOf, object, string } from "zod";

export const CreateUserSchema = object({
    body: object({
        name: string(
            {
                required_error: "Name is required"
            }
        ),
        email:string(
            {
                required_error: "Email is required"
            }
        ).email("Not a valid email"),
        password:string(
            {
                required_error: "Password is required"
            }
        ).min(6, "Password too short, should be atleast 6 characters"),
        passwordConfirmation:string(
            {
                required_error: "Password Confirm is required"
            }
        ),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Password do not match",
        path: ["passwordConfirmation"]
    })
})

export type CreateUserInput = Omit<TypeOf<typeof CreateUserSchema>, "body.passwordConfirmation">;