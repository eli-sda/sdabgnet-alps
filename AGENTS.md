# Project instructions

## Git

- NEVER run `git commit`, `git commit --amend`, `git push`, or `git tag`.
- When a commit is requested, only propose the commit message text (and the exact
  `git commit -m "..."` command) for the user to run themselves.
- Do not stage or unstage changes unless explicitly asked.

## Changes

- Do not change code unless it was explicitly requested and approved by the user.
- Ask for approval before making changes.
- The user may be editing files at the same time. Re-read the current file
  before every edit and never overwrite changes that were not requested.

## SCSS

- Keep selector hierarchy consistent with the component hierarchy: styles for
  an element that lives inside a component must be nested inside that
  component's root selector (e.g. `.videoPlayer-helpDialog` belongs inside
  `.videoPlayer`), never defined at the top level of the file.
- Do not duplicate rules between `.scss` files. Extract the shared rules into
  an `@mixin` (in a shared partial, e.g. next to the components it belongs to
  or under `src/styles/`) and `@include` it where needed.
