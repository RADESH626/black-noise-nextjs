import React, { useState } from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function InputPassword(props) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? 'text' : 'password'}
        className="
          w-full
          p-3
          bg-bn-input-bg
          text-bn-secondary
          border
          border-bn-accent
          rounded-md
          focus:outline-none
          focus:ring-1
          focus:ring-bn-accent-opaque
          focus:border-bn-accent-opaque
          placeholder:text-bn-accent
        "
        placeholder="Contraseña"
        required
        {...props}
      />
      <BotonGeneral
        type="button"
        onClick={togglePasswordVisibility}
        variant="info"
        className="
          absolute
          right-3
          top-1/2
          transform
          -translate-y-1/2
          text-xs
          px-2
          py-1
          rounded
        "
      >
        {showPassword ? 'Ocultar' : 'Mostrar'}
      </BotonGeneral>
    </div>
  );
}

export default InputPassword;
