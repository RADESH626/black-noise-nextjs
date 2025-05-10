import {BotonGeneral} from '@/components/common/botones/index';
import {InputEmail,InputPassword} from "@/components/common/inputs";
import {IniciarSesion} from "@/app/acciones/UsuariosActions";

function FormLogin() {

    return (


            <form className="flex flex-col" action={IniciarSesion} >

                <div className="relative mb-5">

                    <label className="block mb-1 text-sm font-medium text-bn-accent">Correo electrónico</label>

                    <div className="relative">

                        <InputEmail required placeholder="ejemplo@gmail.com"  name="email" />

                    </div>

                </div>

                <div className="relative mb-5">

                    <label htmlFor="password-login" className="block mb-1 text-sm font-medium text-bn-accent">Contraseña</label>

                    <div className="relative">

                        <InputPassword required placeholder="contraseña" name="password" />

                    </div>

                </div>
                <div className="relative mb-5 items-center flex justify-center">

                    <BotonGeneral type="submit">Iniciar Sesión</BotonGeneral>

                </div>


                <div className="text-center mt-5 ">
                    <p>¿No tienes una cuenta?
                        <a href="/registro" id="showRegister" className="font-medium  no-underline hover:underline">Regístrate ahora</a>
                    </p>
                </div>

            </form>

    )
}

export default FormLogin;