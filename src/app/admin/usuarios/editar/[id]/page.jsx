async function page(searchParams) {

    const params = await searchParams.params;

    const { id } = params;

    console.log('parametros:', id);

    


    return (
        <div>page</div>
    )
}

export default page

//TODO:agregar logica de la pagina
