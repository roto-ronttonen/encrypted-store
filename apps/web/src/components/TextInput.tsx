import clsx from "clsx";

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function TextInput({ ...props }: TextInputProps) {
  return (
    <input
      {...props}
      type={props.type ?? "text"}
      className={clsx(
        "rounded border border-solid border-gray-300 p-2 bg-white",
        props.className
      )}
    />
  );
}
