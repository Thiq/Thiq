# Changelog
## v2.0.1
- Added plugin class loading for dependency plugins that are otherwise locked off from Bukkit
## v2.0.0
- Allowed for all files to be embedded. It will check first locally and if it doesn't exist, it will load embedded scripts.
- `require` is now file relative.
- Added `$DIR` and `$FILE` global variables, allowing you to see which dir and file you're in (in case you get lost).
- Privatized the loader script; global functions are now
    - `createWrapperFunction(body, argsObject)`
    - `callFn(js, argsObject)`
    - `loadFromFile(file)`
- Scripts in the `libs` folder are no longer wrapped. This means what variables get set are now global again.

## v1.0.2
- Adjusted the modules system. All `libs` scripts are wrapped for safety.
- Embedded the `core` directory to prevent mishaps.

## v1.0.0 Initial Release