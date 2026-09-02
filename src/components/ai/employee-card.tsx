import Link from 'next/link'
import { ArrowRight } from '@/components/graphics'
import { cn } from '@/components/ui'
import { EmployeeMark } from '@/components/ai/employee-mark'
import { STATUS_LABEL, type Employee } from '@/lib/ai/employees'

/**
 * One employee, one screen's worth of understanding:
 * one problem, one employee, three benefits, one action.
 *
 * The status sits at the top rather than buried at the bottom, because
 * "planned" changes how everything below it should be read.
 */
export function EmployeeCard({
  employee,
  className,
}: {
  employee: Employee
  className?: string
}) {
  const live = employee.status === 'live'
  return (
    <article
      className={cn(
        'group relative flex flex-col border border-line bg-paper-raised p-6 transition-colors duration-200 focus-within:border-line-strong hover:border-line-strong sm:p-8',
        className
      )}
      style={{ ['--emp' as string]: `var(${employee.colourVar})` }}
    >
      <header className="flex items-baseline justify-between gap-4">
        <span className="label text-ink-faint">
          NB.AI / {employee.number}
        </span>
        <span
          className={cn('label', live ? 'text-accent' : 'text-ink-faint')}
        >
          {STATUS_LABEL[employee.status]}
        </span>
      </header>

      <EmployeeMark
        employee={employee}
        className="mt-6 w-full text-ink-faint"
      />

      <h3 className="display mt-7 text-[clamp(2.5rem,9vw,3.5rem)] text-ink">
        {employee.name}
      </h3>
      <p className="label mt-2" style={{ color: 'var(--emp)' }}>
        {employee.role}
      </p>

      <p className="mt-5 text-[17px] leading-relaxed text-ink-muted">
        {employee.purpose}
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {employee.does.map((d) => (
          <li key={d} className="flex gap-3">
            {/* The check is the system signal, not the employee colour —
                state is always yellow, identity is always the employee. */}
            <svg
              viewBox="0 0 12 12"
              className="mt-1.5 h-3 w-3 shrink-0 text-accent"
              fill="none"
              aria-hidden
            >
              <path
                d="M1.5 6.2 4.6 9.2 10.5 2.8"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="square"
              />
            </svg>
            <span className="text-[15px] leading-relaxed text-ink-muted">{d}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/ai/employees/${employee.slug}`}
        className="label mt-8 inline-flex min-h-11 items-center gap-2.5 text-ink after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
      >
        Meet {employee.name}
        <span className="text-accent transition-transform duration-200 group-hover:translate-x-1">
          <ArrowRight />
        </span>
      </Link>
    </article>
  )
}
