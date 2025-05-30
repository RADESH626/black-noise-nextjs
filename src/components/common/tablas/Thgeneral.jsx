import React from 'react'

function Thgeneral({children,props}) {
  return (
    <th className="border border-gray-400 px-4 py-2 tracking-wider " {...props}>
        {children}
    </th>
  )
}

export default Thgeneral