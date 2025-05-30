import Tabla from "@/components/common/tablas/Tabla"

function SeccionLista({children}) {
    return (
        <section className="flex flex-col items-center justify-center w-full h-full bg-white rounded-2xl">

            <div className="overflow-y-auto max-h-[400px] w-full">
                <Tabla>{children}</Tabla>
            </div>

        </section >
    )
}

export default SeccionLista
