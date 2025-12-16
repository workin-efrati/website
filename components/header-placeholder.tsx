import clsx from "clsx"

export default function HeaderPlaceholder({ className }: { className?: string }) {
   return (
      <div className={clsx('h-20 w-full', className)} />
   )
}
