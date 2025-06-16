# Improvement Log

This document serves as a critical source of wisdom, detailing lessons learned from past errors and areas identified for continuous improvement in my operational processes and code generation.

## Lessons Learned:

- **Error 1: Incomplete Refactoring Plan**: Initially, I did not create a comprehensive refactoring plan before starting the refactoring process.
  - **Correction**: Always create a detailed `refactoring_plan.md` at the beginning of any refactoring task, outlining all necessary steps and tracking progress.
  - **Date**: 2025-10-06

- **Error 2: Assuming File Existence**: I previously assumed the existence of certain files or directories without explicit verification.
  - **Correction**: Always use `list_files` or similar tools to verify the existence of files or components before attempting to read, modify, or import them.
  - **Date**: 2025-10-06

- **Error 3: Not following the Unified Workflow**: I did not strictly adhere to the unified workflow, especially regarding documentation updates before code changes.
  - **Correction**: Prioritize documentation updates in `functionalities/` before implementing any major scope code changes. Always consult `manifest.md` and `improvement_log.md` at the start of every task.
  - **Date**: 2025-10-06

- **Error 4: Incorrect CLI Command Chaining on Windows (CRITICAL REINFORCEMENT)**: I *repeatedly* attempted to chain `git add` and `git commit` using `&&`, which is NOT supported in the default Windows command prompt. This is a recurring error that I MUST eliminate.
  - **Correction**: **ALWAYS** execute `git add` and `git commit` as **SEPARATE, INDIVIDUAL COMMANDS**. Under no circumstances should `&&` or any other chaining operator be used for these commands on Windows. This rule takes precedence.
  - **Date**: 2025-06-15 (Reinforced)

- **Error 5: Hardcoded Enum Usage**: Used hardcoded enum values instead of existing centralized enums.
  - **Correction**: Always check for existing enums in `src/models/enums/` before creating new ones or using hardcoded values. If an existing enum is suitable, use it to ensure consistency and avoid duplication.
  - **Date**: 2025-06-14

- **Lesson Learned 6: Prefer Native HTML `<dialog>` for Modals**: Encountered persistent and complex CSS rendering issues when attempting to style custom `div`-based modals. The native HTML `<dialog>` element provides built-in modal functionality, accessibility, and predictable rendering behavior, simplifying implementation and reducing styling conflicts.
  - **Correction**: For all future modal and popup implementations, prioritize the use of the native HTML `<dialog>` element. Leverage its `showModal()` and `close()` methods, and rely on its native backdrop and positioning unless specific custom styling is explicitly required and thoroughly tested.
  - **Date**: 2025-06-14
- **Lesson Learned 7: Consistent Modal Implementation**: Ensure all modals throughout the application consistently use the native HTML `<dialog>` element for uniform behavior and accessibility.
  - **Correction**: Review existing modal implementations and refactor any `div`-based modals to use `<dialog>`, ensuring proper state management (`isOpen` prop controlling `showModal`/`close`) and accessibility attributes.
  - **Date**: 2025-06-14

- **Error 8: Insufficient API Usage Verification Before Deletion**: I failed to thoroughly verify all potential call sites for an API route (`/api/email`) before its deletion, specifically missing a server-side invocation within `src/app/acciones/ProveedorActions.js`. My search patterns were not comprehensive enough to catch dynamic URL constructions.
  - **Correction**: Before deleting any API route or shared utility, I MUST perform a multi-faceted verification:
    1.  Search for direct string matches of the API path (e.g., `"/api/email"`).
    2.  Search for dynamic constructions of the API path (e.g., `process.env.NEXTAUTH_URL + "/api/email"`). This requires more flexible regex patterns.
    3.  Prioritize checking Server Actions (`"use server"`) and other API routes, as they are common internal consumers.
    4.  If a deletion is proposed, explicitly state the verification steps taken and the files checked.
  - **Date**: 2025-06-15

- **Lesson Learned 9: Modal Backgrounds**: Modals should not have a background overlay unless explicitly requested by the user.
  - **Correction**: When implementing modals, ensure the outer container for the modal overlay uses `bg-transparent` by default. Only add a semi-transparent or colored background if specifically instructed.
  - **Date**: 2025-06-15

## Areas for Continuous Improvement:

- **File Size Management**: When writing to a file, ensure the content does not exceed 1000 lines. If it does, create a new file to continue the content.
- **Enhanced Context Awareness**: Improve my ability to infer context from partial information and proactively gather necessary details using available tools.
- **Optimized Tool Usage**: Continuously refine my selection and application of tools to ensure the most efficient and effective approach for each sub-task.
- **Proactive Error Handling**: Develop more robust strategies for anticipating potential issues and implementing preventative measures.
- **Clarity in Communication**: Ensure all my responses and plans are clear, concise, and directly address the user's request, avoiding ambiguity.
