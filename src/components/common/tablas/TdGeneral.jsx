import React from 'react'

function TdGeneral({props,children}) {
  return (
    <td className="border border-gray-400 px-4 py-2" {...props}>{children}</td>
  )
}

export default TdGeneral
