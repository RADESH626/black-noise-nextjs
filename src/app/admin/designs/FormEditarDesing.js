import { BotonGeneral } from '@/components/common/botones';
import { ObtenerDesignPorId } from '@/app/acciones/DesignActions';
import { CategoriaDesing, EstadoDesing } from '@/models/enums/design';
import {
  InputTextoGeneral,
  InputSelectGeneral,
  InputNumero,
  InputURL,
} from '@/components/common/inputs';

async function FormEditarDesign({ designId }) {
  const design = await ObtenerDesignPorId(designId);

  return (
    <form className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="nombreDesing" className="block mb-1 text-sm font-medium text-bn-accent">Nombre del Diseño</label>
          <div className="relative">
            <InputTextoGeneral
              id="nombreDesing"
              name="nombreDesing"
              required
              placeholder="Nombre del diseño"
              defaultValue={design.nombreDesing || ""}
            />
          </div>
        </div>

        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-bn-accent">ID de Usuario (Creador)</label>
          <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
            <span className="text-sm text-gray-700">
              {design.usuarioId?._id || design.usuarioId || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="categoria" className="block mb-1 text-sm font-medium text-bn-accent">Categoría</label>
          <div className="relative">
            <InputSelectGeneral
              id="categoria"
              name="categoria"
              required
              options={Object.values(CategoriaDesing).map(cat => ({
                value: cat,
                label: cat
              }))}
              defaultValue={design.categoria || ""}
            />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="estadoDesing" className="block mb-1 text-sm font-medium text-bn-accent">Estado del Diseño</label>
          <div className="relative">
            <InputSelectGeneral
              id="estadoDesing"
              name="estadoDesing"
              required
              options={Object.values(EstadoDesing).map(est => ({
                value: est,
                label: est
              }))}
              defaultValue={design.estadoDesing || ""}
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="palabrasClave" className="block mb-1 text-sm font-medium text-bn-accent">Palabras Clave</label>
        <div className="relative">
          <InputTextoGeneral
            id="palabrasClave"
            name="palabrasClave"
            placeholder="Palabras clave separadas por coma"
            defaultValue={Array.isArray(design.palabrasClave) ? design.palabrasClave.join(', ') : ''}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="valorDesing" className="block mb-1 text-sm font-medium text-bn-accent">Valor del Diseño</label>
          <div className="relative">
            <InputNumero
              id="valorDesing"
              name="valorDesing"
              required
              step="0.01"
              defaultValue={design.valorDesing?.toString() || ""}
            />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="elementoIds" className="block mb-1 text-sm font-medium text-bn-accent">IDs de Elementos</label>
          <div className="relative">
            <InputTextoGeneral
              id="elementoIds"
              name="elementoIds"
              placeholder="IDs separados por coma"
              defaultValue={Array.isArray(design.elementoIds) ? design.elementoIds.join(', ') : ''}
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="imagenDesing" className="block mb-1 text-sm font-medium text-bn-accent">URL de la Imagen</label>
        <div className="relative">
          <InputURL
            id="imagenDesing"
            name="imagenDesing"
            required
            placeholder="https://ejemplo.com/imagen.jpg"
            defaultValue={design.imagenDesing || ""}
          />
        </div>
      </div>

      <div className="flex flex-row gap-2 items-center justify-center mt-5">
        <BotonGeneral type="submit">Editar diseño</BotonGeneral>
      </div>
    </form>
  );
}

export default FormEditarDesign;
