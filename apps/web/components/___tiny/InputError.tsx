import clsx from "clsx";

export type InputErrorProps = React.HTMLAttributes<HTMLParagraphElement>;

export default function InputError({ ...props }: InputErrorProps) {
  return <p {...props} className={clsx("text-red-500", props.className)} />;
}
