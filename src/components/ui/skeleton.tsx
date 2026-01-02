import { cn } from "@/lib/utils";

/**
 * Renders a div styled as a visual skeleton placeholder for loading states.
 *
 * @param className - Additional CSS classes to merge with the component's base skeleton styles.
 * @param props - Additional HTML attributes applied to the rendered div.
 * @returns A div element with skeleton styling suitable for use as a loading placeholder.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };