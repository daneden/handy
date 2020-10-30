import { ReactElement, ReactNode } from "react"

interface Props {
  label: string
  description?: ReactNode
  children: ReactElement<HTMLInputElement | HTMLTextAreaElement>
}

export default function Input({ label, description, children }: Props) {
  return (
    <>
      <label>
        <span className="label">{label}</span>
        {children}
        {description && <small className="description">{description}</small>}
      </label>
      <style jsx>{`
        label {
          display: grid;
          grid-template-columns: 1fr;
          grid-gap: 0.25em;
          margin-bottom: 1rem;
        }

        span.label {
          font-weight: 600;
        }

        label :global(input),
        label :global(textarea),
        label :global(select) {
          -webkit-appearance: none;
          display: block;
          background-color: rgba(128, 128, 128, 0.05);
          padding: 0.25em 0.5em;
          font: inherit;
          border-radius: 0.25em;
          border: 2px solid var(--tertiary-wash);
          color: var(--text-color);
        }

        label :global(input:focus),
        label :global(textarea:focus),
        label :global(select:focus) {
          border-color: var(--highlight-color);
        }

        label:focus-within {
          color: var(--highlight-color);
        }

        small.description {
          font-size: 0.75em;
          color: rgb(128, 128, 128);
        }
      `}</style>
    </>
  )
}
