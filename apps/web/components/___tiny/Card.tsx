import clsx from "clsx";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export default function Card({ ...props }: CardProps) {
  return (
    <div {...props} className={clsx("shadow rounded-lg", props.className)} />
  );
}
