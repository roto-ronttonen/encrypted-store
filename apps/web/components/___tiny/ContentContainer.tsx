import clsx from "clsx";

export type ContentContainerProps = React.HTMLAttributes<HTMLDivElement>;

export default function ContentContainer({ ...props }: ContentContainerProps) {
  return <div {...props} className={clsx("p-5", props.className)} />;
}
