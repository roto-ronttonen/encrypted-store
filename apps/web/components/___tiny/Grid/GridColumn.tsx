import clsx from "clsx";
import { useMemo } from "react";

export type ColumnSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type GridColumnProps = React.HTMLAttributes<HTMLDivElement> & {
  xs?: ColumnSize;
  sm?: ColumnSize;
  md?: ColumnSize;
  lg?: ColumnSize;
  xl?: ColumnSize;
};

export default function GridColumn({
  xs,
  sm,
  md,
  lg,
  xl,
  ...props
}: GridColumnProps) {
  const styles = useMemo(() => {
    const xsValue = xs ?? 12;
    const smValue = sm ?? xsValue;
    const mdValue = md ?? smValue;
    const lgValue = lg ?? mdValue;
    const xlValue = xl ?? lgValue;

    // This is for tailwind jit, hidden is for colsize 0
    const classOps = [
      "hidden",
      "col-span-1",
      "col-span-2",
      "col-span-3",
      "col-span-4",
      "col-span-5",
      "col-span-6",
      "col-span-7",
      "col-span-8",
      "col-span-9",
      "col-span-10",
      "col-span-11",
      "col-span-12",
      "sm:hidden",
      "sm:col-span-1",
      "sm:col-span-2",
      "sm:col-span-3",
      "sm:col-span-4",
      "sm:col-span-5",
      "sm:col-span-6",
      "sm:col-span-7",
      "sm:col-span-8",
      "sm:col-span-9",
      "sm:col-span-10",
      "sm:col-span-11",
      "sm:col-span-12",
      "md:hidden",
      "md:col-span-1",
      "md:col-span-2",
      "md:col-span-3",
      "md:col-span-4",
      "md:col-span-5",
      "md:col-span-6",
      "md:col-span-7",
      "md:col-span-8",
      "md:col-span-9",
      "md:col-span-10",
      "md:col-span-11",
      "md:col-span-12",
      "lg:hidden",
      "lg:col-span-1",
      "lg:col-span-2",
      "lg:col-span-3",
      "lg:col-span-4",
      "lg:col-span-5",
      "lg:col-span-6",
      "lg:col-span-7",
      "lg:col-span-8",
      "lg:col-span-9",
      "lg:col-span-10",
      "lg:col-span-11",
      "lg:col-span-12",
      "xl:hidden",
      "xl:col-span-1",
      "xl:col-span-2",
      "xl:col-span-3",
      "xl:col-span-4",
      "xl:col-span-5",
      "xl:col-span-6",
      "xl:col-span-7",
      "xl:col-span-8",
      "xl:col-span-9",
      "xl:col-span-10",
      "xl:col-span-11",
      "xl:col-span-12",
    ];

    const makeClass = (
      val: ColumnSize,
      size: "xs" | "sm" | "md" | "lg" | "xl"
    ) => {
      return classOps.find((o) => {
        if (size === "xs") {
          if (val === 0) {
            return o === "hidden";
          } else {
            return o.includes("col-span-" + val.toString());
          }
        }
        if (val === 0) {
          return o.includes(size) && o.includes("hidden");
        }

        return o.includes(size) && o.includes("col-span-" + val.toString());
      });
    };
    const xsClass = makeClass(xsValue, "xs");
    const smClass = makeClass(smValue, "sm");
    const mdClass = makeClass(mdValue, "md");
    const lgClass = makeClass(lgValue, "lg");
    const xlClass = makeClass(xlValue, "xl");
    return clsx(xsClass, smClass, mdClass, lgClass, xlClass);
  }, [xs, sm, md, lg, xl]);

  return <div {...props} className={clsx(styles, props.className)} />;
}
