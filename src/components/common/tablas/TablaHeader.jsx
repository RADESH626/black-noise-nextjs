
function TablaHeader({ children }) {
    return (
        <thead className="border-b border-accent1 sticky top-0 z-10 bg-neutral-800">
            <tr className="text-secondary">
                {children}
            </tr>
        </thead>
    )
}

export default TablaHeader
