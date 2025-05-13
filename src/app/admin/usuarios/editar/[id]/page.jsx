async function page(searchParams) {

    const params = await searchParams.params;

    const { id } = params;

    console.log('parametros:', id);



    


    return (
        <div>page {id}</div>
    )
}

export default page