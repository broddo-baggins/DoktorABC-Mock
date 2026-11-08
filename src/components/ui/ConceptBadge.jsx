import React from 'react'

// Small, quiet label shown in both footers. Links back to the portfolio's projects list.
const ConceptBadge = ({ className = '' }) => (
  <a
    href="https://amityogev.com/?cmd=projects"
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center rounded-[4px] border border-current px-2 py-1 font-mono text-xs leading-none no-underline opacity-90 hover:opacity-100 ${className}`}
  >
    Concept demo with sample data
    <span className="sr-only"> (opens the projects list in a new tab)</span>
  </a>
)

export default ConceptBadge
