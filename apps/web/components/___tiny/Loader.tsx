import clsx from "clsx";
import { BiLoaderAlt } from "react-icons/bi";

export type LoaderProps = React.HTMLAttributes<HTMLDivElement>;

export default function Loader({ ...props }: LoaderProps) {
  return (
    <div
      {...props}
      className={clsx(
        "w-[max-content] h-[max-content] inline-flex items-center justify-center animate-spin",
        props.className
      )}
    >
      <BiLoaderAlt size={20} />
    </div>
  );
}
