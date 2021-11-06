import clsx from "clsx";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx("rounded-lg p-2 bg-blue-500 text-white", props.className)}
    />
  );
}
