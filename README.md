# Confluence Blockscan

This application empowers confluence users by providing blockchain-related macros such as checking for wallet balance, displaying transactions and NFT assets, and watching alerts for favorite wallets.

This project contains a Forge app written in Javascript in a Confluence macro. 

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

### Environment Variable

The following environment variable is need for the application to function properly:
- `TOKEN`: (--encrypt) Get the key from [Blockcypher](https://www.blockcypher.com).
- `ETHERSCAN_APIKEY`: (--encrypt) Get the key from  [EtherScan](https://etherscan.io).

Refer to [configure environment variable](https://developer.atlassian.com/platform/forge/environments/#environment-variables).

### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.
- You can always delete your app from the site by running the `forge uninstall` command.
- No external `APIKEY` is needed at the moment.

## Inspiration
- Blockchain technology and adoption have been growing in recent years. I notice that there is a gap in the current marketplace without this kind of support.
- Also, I am passionate about this technology space. Thus, this is the right opportunity to blend them together to create a solution that can be used by people or companies that has present in the blockchain space.

## What's next for Blockscan
- Add test
- Improve UI/UX of the macros
- Fix macro error cause by the third-party timeout or failed request. This also happens when the cache is cleaned.
