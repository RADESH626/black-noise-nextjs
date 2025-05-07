
function BotonGeneral({children,props}) {
    return (
        <button type="submit" className="
        inline-flex
        items-center
        py-4 px-12
        bg-gradient-to-r from-white to-[#d89ceb]
        text-black
        font-bold text-[1.1rem]
        border-none
        rounded-xl
        cursor-pointer
        transition-all duration-300 ease-in-out
        shadow-[0_8px_20px_rgba(0,0,0,0.3)]
        hover:scale-105 hover:shadow-[0_12px_25px_rgba(196,121,206,0.5)] hover:brightness-110
        "
        {...props}>

           {children}
        </button>

    )
}

export default BotonGeneral