import * as React from "react";
import { TextInput, TextInputProps } from "react-native";
import { cn } from "@/libs/utils";

interface InputProps extends Omit<TextInputProps, "style"> {
  className?: string;
}

const Input = React.forwardRef<TextInput, InputProps>((props, ref) => {
  const { className, ...rest } = props;

  const computedClassName = cn(
    "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    className
  );

  return <TextInput ref={ref} {...rest} className={computedClassName} />;
});

Input.displayName = "Input";

export { Input };
