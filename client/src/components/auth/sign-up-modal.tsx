import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { FieldGroup } from "../ui/field"
import { Button } from "../ui/button"
import FormInput from "../form/form-input"
import type { FC } from "react"
import http from "@/config/http"

export type SignUpModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSignInClick: CallableFunction
}

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.email("Email format is invalid."),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

type RegisterSchema = z.infer<typeof schema>

const defaultValues = {
  name: "",
  email: "",
  password: "",
}

const SignUpModal: FC<SignUpModalProps> = ({
  open,
  onOpenChange,
  onSignInClick,
}) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema as any),
    defaultValues,
    mode: "onChange",
  })

  const { mutate: signUpMutate } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: (values: RegisterSchema) => {
      return http.post("/auth/signup", values)
    },
    onSuccess() {
      toast.success("Sign up successfully")
      onSignInClick()
    },
  })

  const onSubmit = (data: RegisterSchema) => {
    signUpMutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogDescription>
              Sign up a new account to get started.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <FormInput
              control={form.control}
              id="sign-up-name"
              label="Name"
              name="name"
            />
            <FormInput
              control={form.control}
              id="sign-up-email"
              label="Email"
              name="email"
            />
            <FormInput
              control={form.control}
              id="sign-up-password"
              label="Password"
              name="password"
            />
          </FieldGroup>
          <span>
            Already have an account?{" "}
            <Button onClick={() => onSignInClick()} variant="link">
              Sign in
            </Button>
          </span>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={!form.formState.isValid} type="submit">
              {form.formState.isSubmitting ? "loading..." : "Sign up"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default SignUpModal
