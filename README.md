# Forge Hello World

This project contains a Forge app written in Javascript that displays `Hello World!` in a Confluence macro. 

See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Modify your app by editing the `src/index.jsx` file.

- Build and deploy your app by running:
```
forge deploy
```

- Install your app in an Atlassian site by running:
```
forge install
```

- Develop your app by running `forge tunnel` to proxy invocations locally:
```
forge tunnel
```

### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.
- You can always delete your app from the site by running the `forge uninstall` command.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.

## Improvement

- Stream Forge logs when using forge tunnel
- Not showing error when library import was not found.
  - Debugging why config is not showing is frustrating
  - (After debug) - No clear direction when should use `forge deploy` when running `forge tunnel` to reload the manifest.yml
- Recommended best practice for large-file structure
  - nested folder cannot detect index.jsx
- Forge UI kit component have limited functionality.
  - Should at least have CSS capability to overwrite
  - eg. enable `style` for simple overwrite
  - Modal no ok button, document could explain the intention of such design
  - Select `onChange` event, and Input `onInput` event.
- Hot-reloading for custom-ui to make it easier for development
  - Eg. enable `url` to serve `localhost:3000` in the `resource`
  - (solved) https://developer.atlassian.com/platform/forge/tunneling/
- MacroConfig documentation about use config and form is interlink.
  - PS: it is documented in MacroConfig
  - However, error message could be better. Either in console or UI.
  - Stating `MacroConfig` only supprt type, instead of just yellow warning sign.

## Reference

- Blockchain node api [GetBlock](https://getblock.io/en/)