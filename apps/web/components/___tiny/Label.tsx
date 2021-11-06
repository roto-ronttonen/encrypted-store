import clsx from "clsx";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({ ...props }: LabelProps) {
  return <label {...props} className={clsx("text-sm", props.className)} />;
}
