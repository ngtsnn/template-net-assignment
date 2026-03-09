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
import { queryClient } from "@/config/query-client"
import http from "@/config/http"

export type SignInModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSignUpClick: CallableFunction
}

const schema = z.object({
  email: z.email("Email format is invalid."),
  password: z.string(),
})

type SingInSchema = z.infer<typeof schema>

const defaultValues = {
  name: "",
  email: "",
  password: "",
}

const SignInModal: FC<SignInModalProps> = ({
  open,
  onOpenChange,
  onSignUpClick,
}) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema as any),
    defaultValues,
    mode: "onChange",
  })

  const { mutate: signInMutate } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: (values: SingInSchema) => {
      return http.post("/auth/login", values) as unknown as Promise<{
        accessToken: string
      }>
    },
    onSuccess(data) {
      toast.success("Sign in successfully")
      queryClient.removeQueries({
        predicate: () => true,
      })

      const accessToken = data.accessToken
      localStorage.setItem("accessToken", accessToken)
      onOpenChange(false)
    },
  })

  const onSubmit = (data: SingInSchema) => {
    signInMutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form action="" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>Sign in to get started.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <FormInput
              control={form.control}
              id="sign-in-email"
              label="Email"
              name="email"
            />
            <FormInput
              control={form.control}
              id="sign-in-password"
              label="Password"
              name="password"
            />
          </FieldGroup>
          <span>
            Do not have an account?{" "}
            <Button onClick={() => onSignUpClick()} variant="link">
              Sign up
            </Button>
          </span>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={!form.formState.isValid || form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? "loading..." : "Sign in"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default SignInModal
