
function TablaHeader({ children }) {
    return (
        <thead className='border-b border-gray-400 sticky top-0 z-10 bg-white ring ring-gray-500 ring-inset'>
            <tr className='ring ring-gray-500 ring-inset'>
                {children}
            </tr>
        </thead>
    )
}

export default TablaHeader