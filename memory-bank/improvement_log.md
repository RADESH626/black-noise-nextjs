# Improvement Log

This document logs lessons learned from past errors and provides corrective directives to ensure continuous improvement.

## Directives:

*   **Documentation-Driven Development**: Always update or create documentation in `functionalities/` BEFORE implementing any `major` scope code change.
*   **Context-Aware Loading**: NEVER read all files at once. Start by reading `memory-bank/manifest.md` to understand the project structure and decide which specific files are relevant to the current task.
*   **Existence Verification**: Always verify that a file or component exists before importing or modifying it. Do not assume file paths.
*   **Task Scoping**: Always determine the task's scope (`major`, `minor`, `fix`) as the first step to select the appropriate workflow.
*   **Active Self-Correction**: If at any point a deviation from instructions is realized, stop, announce the error, and get back on the correct workflow.
*   **File Deletion Rule**: When deleting a file, always check if the parent directory becomes empty. If it does, delete the empty directory as well.
*   **Command Execution Reliability**: If a command execution fails, log the command and the reason for failure in this document to inform future command choices.
