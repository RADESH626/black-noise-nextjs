# System Patterns and Best Practices

## Server Actions Pattern (Next.js 14+) - ESTABLISHED ✅

### Form Component Structure
All forms in the application now follow this standardized pattern:

```jsx
"use client";
import { useEffect } from "react";
import { useActionState, useFormStatus } from 'react-dom';
import { usePopUp } from '@/context/PopUpContext';

// Submit button component with pending state
function SubmitButton({ customText = 'Submit' }) {
  const { pending } = useFormStatus();
  return (
    <BotonGeneral type="submit" disabled={pending}>
      {pending ? 'Loading...' : customText}
    </BotonGeneral>
  );
}

// Initial state for useActionState
const initialState = {
  message: null,
  success: false,
};

function FormComponent({ onSuccess }) {
  const { showPopUp } = usePopUp();
  const [state, formAction] = useActionState(serverAction, initialState);

  useEffect(() => {
    if (state.message) {
      showPopUp(state.message, state.success ? 'success' : 'error');
      if (state.success && onSuccess) {
        onSuccess();
      }
    }
  }, [state, showPopUp, onSuccess]);

  return (
    <form action={formAction}>
      {/* Form fields */}
      <SubmitButton />
    </form>
  );
}
```

### Server Action Structure
All server actions follow this standardized pattern:

```javascript
"use server"
import { revalidatePath } from 'next/cache';

export async function actionName(prevState, formData) {
    console.log('Server Action: Started');

    // Validation
    const requiredField = formData.get('requiredField');
    if (!requiredField) {
        return { message: 'Required field missing.', success: false };
    }

    try {
        // Business logic
        const result = await businessLogicFunction(formData);

        if (result.success) {
            // Revalidate relevant paths
            revalidatePath('/relevant/path');
            return { 
                message: result.message || 'Operation completed successfully.', 
                success: true, 
                data: result.data 
            };
        } else {
            return { message: result.error || 'Operation failed.', success: false };
        }
    } catch (error) {
        console.error('Server Action Error:', error.message);
        return { message: 'Unexpected error occurred.', success: false };
    }
}
```

## Form Field Naming Conventions - STANDARDIZED ✅

### User Forms Field Mapping
- `tipoDocumento` → Document type
- `numeroDocumento` → Document number
- `primerNombre` → First name
- `segundoNombre` → Second name (optional)
- `primerApellido` → First surname
- `segundoApellido` → Second surname
- `fechaNacimiento` → Birth date
- `genero` → Gender
- `numeroTelefono` → Phone number (NOT `telefono`)
- `direccion` → Address
- `correo` → Email
- `contrasena` → Password (mapped to `password` in server action)
- `rol` → Role

### File Upload Fields
- Use `name="file"` for single file uploads
- Use `name="bulkFile"` for bulk upload files
- Always include `accept` attribute for file type restrictions

## UI/UX Patterns - ESTABLISHED ✅

### PopUp Integration
All forms use the PopUp context for user feedback:

```jsx
const { showPopUp } = usePopUp();

useEffect(() => {
  if (state.message) {
    showPopUp(state.message, state.success ? 'success' : 'error');
  }
}, [state, showPopUp]);
```

### Loading States
All forms implement consistent loading states:

```jsx
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Processing...' : 'Submit'}
    </button>
  );
}
```

### Form Styling
Standard form styling patterns:

```jsx
<form className="space-y-5 text-white">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="relative">
      <label className="block mb-1 text-sm font-medium text-purple-400">
        Field Label
      </label>
      <InputComponent required />
    </div>
  </div>
</form>
```

## Database Patterns - ESTABLISHED ✅

### User Model Fields
Standard user document structure:
- `tipoDocumento`: String (enum)
- `numeroDocumento`: String (unique)
- `primerNombre`: String (required)
- `segundoNombre`: String (optional)
- `primerApellido`: String (required)
- `segundoApellido`: String (required)
- `nombreUsuario`: String (auto-generated)
- `fechaNacimiento`: Date
- `genero`: String (enum)
- `numeroTelefono`: String
- `direccion`: String
- `correo`: String (unique)
- `password`: String (hashed)
- `rol`: String (enum)
- `habilitado`: Boolean
- `fotoPerfil`: String (base64 or URL)

### Data Conversion Patterns
Always convert MongoDB objects to plain objects:

```javascript
const plainUser = {
  ...mongoUser,
  _id: mongoUser._id.toString(),
  fechaNacimiento: mongoUser.fechaNacimiento ? 
    new Date(mongoUser.fechaNacimiento).toISOString().split('T')[0] : null,
  createdAt: mongoUser.createdAt ? 
    new Date(mongoUser.createdAt).toISOString() : null,
};
```

## Authentication Patterns - ESTABLISHED ✅

### Login Flow
1. Server Action validates form data
2. Returns credentials to client
3. Client calls NextAuth `signIn`
4. Handles authentication result
5. Redirects on success

### Session Management
- Use `getServerSession` for server-side session access
- Implement proper role-based access control
- Handle session expiration gracefully

## Error Handling Patterns - ESTABLISHED ✅

### Server-Side Error Handling
```javascript
try {
  // Business logic
} catch (error) {
  console.error('Detailed error:', error.message);
  return { message: 'User-friendly error message', success: false };
}
```

### Client-Side Error Display
```jsx
useEffect(() => {
  if (state.message) {
    showPopUp(state.message, state.success ? 'success' : 'error');
  }
}, [state, showPopUp]);
```

## File Upload Patterns - ESTABLISHED ✅

### CSV Processing
```javascript
const buffer = await file.arrayBuffer();
const text = new TextDecoder().decode(buffer);
const result = Papa.parse(text, {
  header: true,
  skipEmptyLines: true,
  transformHeader: header => header.trim(),
  transform: value => typeof value === 'string' ? value.trim() : value,
});
```

### Image Upload
- Store as base64 strings in database
- Provide default profile pictures
- Validate file types and sizes

## Revalidation Patterns - ESTABLISHED ✅

### Path Revalidation
```javascript
import { revalidatePath } from 'next/cache';

// After successful mutation
revalidatePath('/admin/usuarios');           // Admin user list
revalidatePath('/perfil/editar');            // Profile edit page
revalidatePath(`/admin/usuarios/editar/${userId}`); // Specific edit page
```

## Code Organization Patterns - ESTABLISHED ✅

### File Structure
```
src/
├── app/
│   ├── acciones/
│   │   └── UsuariosActions.js    # All user-related Server Actions
│   ├── admin/
│   │   └── usuarios/
│   │       └── components/       # Admin-specific components
│   └── api/                      # API routes (legacy/external)
├── components/
│   ├── common/                   # Reusable components
│   └── layout/                   # Layout-specific components
└── models/                       # Database models
```

### Import Patterns
```javascript
// Server Actions imports
import { actionName } from "@/app/acciones/ModuleActions";

// Component imports
import { useActionState, useFormStatus } from 'react-dom';
import { usePopUp } from '@/context/PopUpContext';

// Database imports
import connectDB from '@/utils/DBconection';
import Model from '@/models/Model';
```

## Performance Patterns - ESTABLISHED ✅

### Client Bundle Optimization
- Use Server Actions to reduce client-side JavaScript
- Implement proper loading states
- Minimize unnecessary re-renders

### Database Optimization
- Use `.lean()` for read operations
- Convert MongoDB objects to plain objects
- Implement proper indexing

### Caching Strategy
- Use `revalidatePath` for targeted cache invalidation
- Implement `cache: 'no-store'` for real-time data
- Optimize API call patterns

## Security Patterns - ESTABLISHED ✅

### Input Validation
- Server-side validation for all inputs
- Proper field type checking
- Sanitization of user inputs

### Authentication Security
- Password hashing with bcrypt
- Session management with NextAuth
- Role-based access control

### Data Protection
- Sensitive data handling
- Proper error message sanitization
- Secure file upload processing

## Testing Patterns - TO BE ESTABLISHED

Future patterns to establish:
- Unit testing for Server Actions
- Integration testing for forms
- E2E testing for user workflows
