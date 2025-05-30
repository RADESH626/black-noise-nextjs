import React from 'react'

function Thgeneral({children,props}) {
  return (
    <th className="border border-accent1 px-4 py-2 tracking-wider bg-neutral-800 text-secondary" {...props}>
        {children}
    </th>
  )
}

export default Thgeneral
