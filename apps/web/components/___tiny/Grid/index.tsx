import clsx from "clsx";

export type GridProps = React.HTMLAttributes<HTMLDivElement>;

export default function Grid({ ...props }: GridProps) {
  return (
    <div
      {...props}
      className={clsx("grid gap-4 grid-cols-12", props.className)}
    />
  );
}

export { default as GridColumn } from "./GridColumn";
