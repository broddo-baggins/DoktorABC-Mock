// Props that make a clickable card behave like a button for keyboard and screen-reader users.
export function selectableProps(onSelect, selected) {
  return {
    role: 'button',
    tabIndex: 0,
    'aria-pressed': selected === undefined ? undefined : !!selected,
    onClick: onSelect,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onSelect(e)
      }
    },
  }
}
