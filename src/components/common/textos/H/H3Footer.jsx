
function H3Footer({props,children}) {
  return (
    <h3 className='text-center text-2xl font-bold text-white' {...props}>
        {children}
    </h3>
  )
}

export default H3Footer