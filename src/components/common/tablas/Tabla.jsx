function Tabla({children}) {
    return (
        <div className="overflow-x-auto rounded-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-neutral-900 [&::-webkit-scrollbar-thumb]:bg-accent1 [&::-webkit-scrollbar-thumb]:rounded">
            <table className="w-full bg-neutral-800 text-secondary border border-accent1">{children}</table>
        </div>
    )
}

export default Tabla;
