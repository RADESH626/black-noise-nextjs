function InputFiles(props) {
    return (
            <input
                type="file"
                className="
                inline-block 
                cursor-pointer 
                rounded-md border 
                border-gray-300
                bg-gray-100
                text-sm
                text-gray-700
                hover:bg-gray-200
                file:mr-3
                file:py-[6px]
                file:px-3
                file:rounded-md
                file:border-0
                file:text-sm
                file:font-medium
                file:bg-gray-200
                file:text-gray-700
                hover:file:bg-gray-300"
                accept=".csv"

                {...props}
            />
    )
}

export default InputFiles