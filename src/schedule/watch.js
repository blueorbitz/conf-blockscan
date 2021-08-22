import { buildRestOutput } from '../utils';
import * as storage from '../utils/storage';
import api, { route } from '@forge/api';
import BlockAPI from '../utils/blockchain-api';

const WATCH_ALERT_PAGE_NAME = 'Blockscan Alert';

const getWatchPage = async (spaceKey) => {
  const queryParams = new URLSearchParams({ spaceKey });
  const response = await api.asApp()
    .requestConfluence(route`/wiki/rest/api/content?${queryParams}`);

  console.log(`Get watch page: ${response.status} ${response.statusText}`);
  const json = await response.json();

  const parentPages = json.results.filter(o => o.title === WATCH_ALERT_PAGE_NAME);
  if (parentPages.length === 0)
    return null;
  else
    return parentPages[0];
}

const createConfPage = async ({ parentId, spaceKey, title, value }) => {
  const bodyData = {
    type: 'page',
    title: title,
    space: { key: spaceKey },
    body: {
      storage: {
        value: value,
        representation: 'storage',
      },
    },
  };

  if (parentId)
    bodyData.ancestors = [{ id: parentId }];

  const response = await api.asApp()
    .requestConfluence(route('/wiki/rest/api/content'), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData),
    });

  console.log(`Create conf page: ${response.status} ${response.statusText}`);
  if (response.status === 200)
    return await response.json();
  else
    return null
}

const createAlertPage = async ({ wallet, txref }) => {
  let parentPage = await getWatchPage(wallet.spaceKey);
  if (parentPage == null)
    parentPage = await createConfPage({
      spaceKey: wallet.spaceKey,
      title: WATCH_ALERT_PAGE_NAME,
      value: '<p>This pages will records all the alerts from watch wallet.</p>',
    });
  
  console.log('creating alert page', parentPage.id);
  await createConfPage({
    parentId: parentPage.id,
    spaceKey: wallet.spaceKey,
    title: `${wallet.name} - Alert on ${txref.confirmed}: `,
    value: `<h3>New Transaction Detected on ${txref.confirmed}</h3>
    <p><b>Wallet Name:</b> ${wallet.name}</p>
    <p><b>Wallet Address:</b> ${wallet.address}</p>
    <h3>Transaction Block Info:</h3>
    <pre>${JSON.stringify(txref, null, 2)}</pre>
    `
  })
};

export default async () => {
  console.log('schedule watch');
  try {
    let response = await storage.getWallets('W#');
    response = response.filter(o => o.key.indexOf('#wallet#') !== -1);

    for (let i = 0; i < response.length; i++) {
      const wallet = response[i].value;

      const { platform, address, key, settings } = wallet;
      if (settings.indexOf('watch') === -1)
        continue;

      const transactions = await BlockAPI.GetCoinTransactionLite(platform, 'main', address);
      if (transactions.error)
        continue;

      const txref = transactions.txrefs[0];
      const lastHash = txref.tx_hash;
      const storedHash = await storage.getLastTransaction(key);
      console.log('hash check:', storedHash, lastHash);
      if (storedHash == null)
        await storage.updateLastTransaction(key, lastHash);
      else if (storedHash !== lastHash) {
        console.log('Wallet Alert for:', key);
        await storage.updateLastTransaction(key, lastHash);
        await createAlertPage({ wallet, txref });
      }
    }

    return buildRestOutput();
  }
  catch (error) {
    console.error(error);
    return buildRestOutput('', 500, 'Internal Error');
  }
};