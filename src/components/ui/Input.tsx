import { forwardRef, useId } from "react";
import { cn } from "@/utils/cn";

export const fieldClasses = cn(
  "w-full rounded-xl border border-input bg-card px-4 text-[15px] text-foreground",
  "placeholder:text-muted-foreground/70 transition-colors duration-150",
  "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15",
  "disabled:cursor-not-allowed disabled:bg-muted",
  "aria-invalid:border-destructive aria-invalid:focus:ring-destructive/15"
);

interface FieldShellProps {
  id: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FieldShell({
  id,
  label,
  helperText,
  error,
  required,
  children,
}: FieldShellProps): React.ReactElement {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-0.5 text-primary">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="mt-1.5 text-sm text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string, helperText?: React.ReactNode) {
  if (error) return `${id}-error`;
  if (helperText) return `${id}-helper`;
  return undefined;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id || props.name || autoId;
    return (
      <FieldShell
        id={inputId}
        label={label}
        helperText={helperText}
        error={error}
        required={props.required}
      >
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              fieldClasses,
              "h-12",
              leftIcon ? "pl-10" : undefined,
              rightIcon ? "pr-10" : undefined,
              className
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(inputId, error, helperText)}
            {...props}
          />
          {rightIcon && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              {rightIcon}
            </span>
          )}
        </div>
      </FieldShell>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, helperText, id, ...props }, ref) => {
    const autoId = useId();
    const textareaId = id || props.name || autoId;
    return (
      <FieldShell
        id={textareaId}
        label={label}
        helperText={helperText}
        error={error}
        required={props.required}
      >
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            fieldClasses,
            "min-h-24 resize-y py-3 leading-relaxed [field-sizing:content]",
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(textareaId, error, helperText)}
          {...props}
        />
      </FieldShell>
    );
  }
);

Textarea.displayName = "Textarea";

export default Input;
