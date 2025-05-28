# Credenciales de Prueba para Usuario Administrador

## 📋 Información de Login

### Usuario Administrador:
- **Email**: `luis.ramirez@email.com`
- **Contraseña**: `admin123`
- **Rol**: `ADMINISTRADOR`

## 🧪 Cómo Probar la Redirección

1. **Ir a la página de login**: http://localhost:3001/login

2. **Usar las credenciales**:
   - Email: `luis.ramirez@email.com`
   - Contraseña: `admin123`

3. **Resultado esperado**:
   - ✅ Inicio de sesión exitoso
   - ✅ Redirección automática a `/admin`
   - ✅ Acceso al panel de administrador

## 🔧 Para Crear el Usuario en la Base de Datos

### Opción 1: Registro Manual
1. Ve a `/registro`
2. Crea una cuenta con `luis.ramirez@email.com`
3. Usa la contraseña `admin123`
4. Cambia manualmente el rol a `ADMINISTRADOR` en la base de datos

### Opción 2: Directamente en la Base de Datos
Ejecuta este código en MongoDB:

```javascript
db.usuarios.insertOne({
  tipoDocumento: "CEDULA",
  numeroDocumento: "5566778899",
  primerNombre: "Luis",
  segundoNombre: "Fernando", 
  primerApellido: "Ramírez",
  segundoApellido: "Castro",
  nombreUsuario: "luis.ramirez",
  fechaNacimiento: new Date("1988-03-18"),
  genero: "MASCULINO",
  numeroTelefono: "3155566778",
  direccion: "Calle 50 #78-90, Barranquilla",
  correo: "luis.ramirez@email.com",
  password: "$2b$10$0Ak7TvlAF7JpVT4xgXpbk.lkb0McqNo6U2TwYUHVCrBN8/JvS5OE6",
  rol: "ADMINISTRADOR",
  fotoPerfil: "data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAKwAAACUCAMAAAA5xjIqAAAAMFBMVEXk5ueutLenrrHn6eqrsbTq7O3Lz9Hh4+S4vcDGyszT1tjP09Te4OKyuLvCx8nW2dvDGAcOAAAECUlEQVR4nO2c23LjIAxAbcTVBvP/f7vQZLNJx7SAsGTPcp4605czqpC4yJ2mwWAwGAwGg8FgMBgMBq+AUmDisizR5x+5dT4Dk4kuiAfSOm+mUgorv25ByPkZKcK2mNPpqsmF+dX07jvbByfTdWLP9O4r9XmSAaY1fFbNiLCcxBYm+7PqV3DdKVIX4i9hvesGz28LukQ124p4Gdesu/LGtsY12ypWV1HhmqoCY2xhrYnrV2wjly3EStVEMEyy5vf6+h5ay+MKW71rSlvHkQgQW1xTbDmaAzSp8iQCuLbA5mpLLutDoytHaKta1ytiIXY1zYHN0HZdWOr67LfQ0vYxZTGBlRtpaA0msKnpekLXup3hDpRHMkBlQcoDR+eKKLJ3WUu3+UpnRJxs2iDQyWJTdqY8PDbvCx6R1WQrzDTtZF9k6SqtQRaDRKCTxa6vmXB74PGukk4Wm7KpHJAtsCE7ZKeLLbBLla5rNYWGS65XpKU72FxpI3OpLSIsSFfKzTf6WDNbQln0gXGnc73WUfxSlxyTwiUtYZWd8qPShS7mLnXliWpi9O+MiFIbiFVRDyCaXHaaWmUJL+UewNL4aMfy1tz2HEp8Rf+gZY1xPTQ3JQLfWI+q3s9Ixvmu2rQVdKeZPapsJcuswQOosSU8JX7SLe5kgv7p/t22bARJcq6tf4AvuPOQ2ykGJ3Piut053yfVoM8z8AvG/jDsO4uzhPWO8jbI3TFqGTbDOYK4B4B3dv4+oC5nq08wN/tOysqvgXohZCLP/odt8eY8yfoGpAjHVWu9Rn9izRtJFtSN/CO3zgeynfFxyVF1Ce30usTov37BLfcMgInOhqd19VQYgt3WU2QE5M9pVmfzovqhJaTVNm86si42NUW9vZWrx8bSbi7y+ILyLsy/tNn3BhHsQq2bKqqTZRF9Qwgb6T68SjFd7W5rLQ2wsC7SxFeZbf9jqirf2R5/1wF584p/Zr75xkOTASBunVQzwq7HbR3BbOi//wupmh2WDLqv6g17RHAhBtwLzQek0L11cwYcRcqFricJ8EdkwMO25+0HYEbnixC119mn6oqoERn6lAXAz22U2M493psgHpmuz7r4K0Yy1w4fX+FnNipAxrb1+ajVdkPYtnykiEK0vzsd2wp2aW4PNDXrO61Xzsf3gj2aeln7szcKGRpkATmz027rGhZZh7HTRuq3CZrNtf4rIfQAH8a28sFM8VSCO6LKFTzT6rpRN0ChONrBMxVnSOgwLo+iZv/VNv3Sk4r52g7T8khk+RfatLvYXdnynS17FiTb4sgyNoS/FI/bc21hnikttfivELpQJov7wr4Xsmw3o7g9bxQmLbfmjbKjY+P/h+lNWcddxCmwRbLmJJS4Dv5D/gBmFDnwIIZzJgAAAABJRU5ErkJggg==",
  habilitado: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

## 🐛 Debugging

Si el login no funciona, revisa:

1. **Consola del navegador** para logs de Frontend Login
2. **Consola del servidor** para logs de Server Action Login
3. **Estado del useActionState** en el componente FormLogin

### Logs esperados:
```
Frontend Login: State changed: { email: "luis.ramirez@email.com", userRole: "ADMINISTRADOR", readyForSignIn: true }
Frontend Login: User role from state: ADMINISTRADOR  
Frontend Login: Inicio de sesión exitoso.
Frontend Login: Verificando rol para redirección: ADMINISTRADOR
Frontend Login: Redirigiendo administrador al panel de admin.
```

## 🔄 Roles Disponibles

- **ADMINISTRADOR** → Redirige a `/admin`
- **PROVEEDOR** → Redirige a `/proveedor`
- **CLIENTE** → Redirige a `/` (inicio)

## ⚠️ Notas Importantes

- La contraseña `admin123` está hasheada con bcrypt
- El usuario debe existir en la base de datos real (no solo en mock data)
- La redirección solo funciona después de una autenticación exitosa con NextAuth.js
