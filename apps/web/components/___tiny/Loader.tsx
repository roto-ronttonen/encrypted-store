import clsx from "clsx";

export type LoaderProps = React.HTMLAttributes<HTMLDivElement>;

export default function Loader({ ...props }: LoaderProps) {
  return (
    <div
      {...props}
      className={clsx("w-4 h-4 bg-green-500 animate-spin", props.className)}
    />
  );
}
