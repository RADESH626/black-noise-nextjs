import { NextResponse } from "next/server";

async function IniciarSesion(formData) {
    'use server'; // Directiva para marcar esta función como Server Action

    const correo = formData.get('email');
    const password = formData.get('password');


    console.log('correo recibido:', correo);
    console.log('contraseña recibida:', password);

}

async function RegistrarUsuario(formData) {
    'use server'; // Directiva para marcar esta función como Server Action

    const tipoDocumento = formData.get('tipoDocumento');
    const numeroDocumento = formData.get('numeroDocumento');
    const primerNombre = formData.get('primerNombre');
    const segundoNombre = formData.get('segundoNombre');
    const primerApellido = formData.get('primerApellido');
    const segundoApellido = formData.get('segundoApellido');
    const fechaNacimiento = formData.get('fechaNacimiento');
    var genero = formData.get('genero');

    // TODO: verificar por que el genero es null o undefined
    
    if (genero === null || genero === undefined) {
        console.warn("El valor de 'genero' es null o undefined. Verificar el formulario o los datos enviados.");
    }


    console.log("genero recibido:", genero);
    
    if (genero === null || genero === ''){
        genero = 'OTRO';
    }

    const numeroTelefono = formData.get('numeroTelefono');
    const direccion = formData.get('direccion');
    const correo = formData.get('correo');
    const password = formData.get('password');

    const data = {
        tipoDocumento,
        numeroDocumento,
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        nombreUsuario: primerNombre + ' ' + primerApellido,
        fechaNacimiento,
        genero,
        numeroTelefono,
        direccion,
        correo,
        password
    }

    //has una peticion tipo post a la api de usuarios para guardar el usuario en la base de datos
    const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log('Resultado de la API:', result);
    if (result.error) {
        console.error('Error al registrar el usuario:', result.error);
        return NextResponse.json({ error: 'Error al registrar el usuario' });
    }

}




export { RegistrarUsuario, IniciarSesion };

//TODO: terminar de hacer el crud

