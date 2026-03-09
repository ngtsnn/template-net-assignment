import { Controller} from 'react-hook-form'
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input";
import type {Control} from 'react-hook-form';
import type {FC, ReactNode} from "react";

export type FormInputProps = {
  control: Control<any>;
  label: ReactNode;
  name: string;
  id?: string;
  placeholder?: string;
  description?: ReactNode;
  autoComplete?: string;
  type?: string
} 

const FormInput: FC<FormInputProps> = ({
  control,
  name,
  label,
  id,
  placeholder,
  description,
  autoComplete,
  type
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input
            {...field}
            id={id ?? field.name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            autoComplete={autoComplete}
            type={type}
          />
          <FieldDescription>
            {description}
          </FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

export default FormInput
