# Manifest of Memory Bank

This document serves as the master index for the entire Memory Bank, providing a structured overview of all documentation files and their purposes.

## Core Project Knowledge:
- [projectbrief.md](projectbrief.md): Defines the core project requirements and objectives.
- [productContext.md](productContext.md): Explains the "why" of the project, problems it solves, and user experience objectives.
- [systemPatterns.md](systemPatterns.md): Describes the system architecture, design patterns, key technical decisions, and Cline's operational directives.
- [techContext.md](techContext.md): Details the technologies, dependencies, and technical limitations.

## Feature Documentation:
- [functionalities/](functionalities/): Directory with a .md file for each functionality.
- [AdminManagement.md](functionalities/AdminManagement.md)
- [Cart.md](functionalities/Cart.md)
- [CatalogBrowsing.md](functionalities/CatalogBrowsing.md)
- [DesignImageManagement.md](functionalities/DesignImageManagement.md)
- [OrderConfirmation.md](functionalities/OrderConfirmation.md)
- [Login.md](functionalities/Login.md)
- [OrderAndPaymentManagement.md](functionalities/OrderAndPaymentManagement.md)
- [UserProfileManagement.md](functionalities/UserProfileManagement.md)
- [PurchasePolicyViewing.md](functionalities/PurchasePolicyViewing.md)
- [PrivacyPolicyViewing.md](functionalities/PrivacyPolicyViewing.md)
- [SupplierManagement.md](functionalities/SupplierManagement.md)
- [UserRegistration.md](functionalities/UserRegistration.md)
- [TermsAndConditionsViewing.md](functionalities/TermsAndConditionsViewing.md)
- [DashboardManagement.md](functionalities/DashboardManagement.md)
- [SalesManagement.md](functionalities/SalesManagement.md)

## Knowledge Base:
- [techniques/](techniques/): Knowledge base of reusable problem-solving techniques.

## Project Structure Overview:
- **src/**: Contains the main application source code, organized by features and components.
    - **src/components/common/botones/Boton.jsx**: Componente de botón consolidado y reutilizable.
    - **src/components/common/inputs/**: Directorio de componentes de entrada refactorizados y consolidados.
    - **src/components/common/inputs/Input.jsx**: Componente de entrada base consolidado y reutilizable.
    - **src/components/common/modales/**: Directorio de componentes de modales refactorizados y consolidados.
    - **src/components/common/modales/Modal.jsx**: Componente base de modal reutilizable.
    - **src/components/common/modales/index.js**: Archivo de exportación para componentes de modales.
    - **src/components/common/pop-up/**: Directorio de componentes de pop-ups refactorizados y consolidados.
    - **src/components/common/pop-up/PopUpMessage.jsx**: Componente de mensaje pop-up consolidado y reutilizable.
    - **src/components/common/pop-up/index.js**: Archivo de exportación para componentes de pop-ups.
    - **src/components/common/tablas/**: Directorio de componentes de tablas refactorizados y consolidados.
    - **src/components/common/tablas/Tabla.jsx**: Componente de tabla consolidado y reutilizable.
    - **src/components/common/tablas/index.js**: Archivo de exportación para componentes de tablas.
- **public/**: Stores static assets like images, icons, and fonts.
- **Configuration Files**: Includes project-level configuration files such as `next.config.mjs`, `package.json`, `tailwind.config.js`, and ESLint configurations.
- **.clinerules**: Defines project-specific conventions and rules for Cline's operation.

## Operational Logs:
- [activeContext.md](activeContext.md): Session change log, updated after every task.
- [progress.md](progress.md): High-level project status and milestones.
- [improvement_log.md](improvement_log.md): Lessons learned from past errors and areas for improvement.

## Refactoring Status:
- [refactoring_plan.md](refactoring_plan.md): Checklist for ongoing refactoring tasks.
- [refactoring_complete.md](refactoring_complete.md): Flag file indicating completion of the main refactoring plan.
