# Improvement Log

## Lessons Learned:

### 2025-09-06 - Git Command Chaining on Windows (CMD)
**Error:** Attempted to chain `git add . && git commit -m "message"` using `&&` operator in a single `execute_command` call. This failed because `cmd.exe` (the default shell on Windows) does not interpret `&&` for command chaining in the same way as Unix-like shells (e.g., Bash, Zsh).
**Correction:** For Windows `cmd.exe`, `git add .` and `git commit -m "message"` must be executed as separate commands.
**Rule Update:** When performing `git add` and `git commit`, always execute `git add .` first, wait for its successful completion, and then execute `git commit -m "message"`. Do not attempt to chain these commands with `&&` on Windows.
