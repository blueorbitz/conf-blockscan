import ForgeUI, {
  render,
  Text,
  SpacePage,
  Table,
  Head,
  Row,
  Cell,
  Button,
  ButtonSet,
  Fragment,
  ModalDialog,
  Form,
  Select,
  Option,
  TextField,
  useState,
  useEffect,
} from '@forge/ui';
import { coinNetwork } from '../utils/blockchain-api';
import * as storage from '../utils/storage';

const ConfirmDeleteModal = ({ wallet, onClose }) => {
  return (
    <ModalDialog
      appearance='danger'
      header={`Confirm Delete "${wallet.name}"?`}
      onClose={onClose}>
      <Form onSubmit={async () => {
        console.log('submit');
        await storage.removeWallet(wallet);
        onClose();
      }} />
    </ModalDialog>
  );
};

const WalletTable = ({ list, reload }) => {
  const [isOpen, setOpen] = useState(false);
  const [deleteWallet, setDeleteWallet] = useState(null);
  console.log(list);

  return (
    <Fragment>
      <Table>
        <Head>
          <Cell><Text>Name</Text></Cell>
          <Cell><Text>Coin</Text></Cell>
          <Cell><Text>Network</Text></Cell>
          <Cell><Text>address</Text></Cell>
          <Cell><Text>Action</Text></Cell>
        </Head>
        {list.map(o => o.value).map((wallet, i) =>
          <Row>
            <Cell><Text>{wallet.name}</Text></Cell>
            <Cell><Text>{wallet.coin}</Text></Cell>
            <Cell><Text>{wallet.network}</Text></Cell>
            <Cell><Text>{wallet.address}</Text></Cell>
            <Cell>
              <ButtonSet>
                <Button text='' icon='edit' onClick={async () => {
                  console.log('edit', issue.key)
                }} />
                <Button text='' icon='trash' onClick={async () => {
                  setDeleteWallet(wallet);
                  setOpen(true);
                }} />
              </ButtonSet>
            </Cell>
          </Row>
        )}
      </Table>
      {isOpen && <ConfirmDeleteModal
        wallet={deleteWallet}
        onClose={() => {
          reload(true);
          setOpen(false);
        }}
      />}
    </Fragment>
  );
};

const AddWalletModal = (props) => {
  const [name] = useState(null);
  const [coin] = useState('btc');
  const [network] = useState(null);
  const [address] = useState(null);

  return (
    <ModalDialog header="Add Wallet" onClose={props.onClose}>
      <Form onSubmit={props.onSubmit}>
        <TextField label='Wallet Name' name='name' value={name} />
        <Select label='Coin' name='coin' value={coin}>
          {
            Object.keys(coinNetwork).map(_coin => <Option label={_coin} value={_coin} />)
          }
        </Select>
        <Select label='Network' name='network' value={network}>
          {
            coinNetwork[coin].map(_network => <Option label={_network} value={_network} />)
          }
        </Select>
        <TextField label='Wallet Address' name='address' value={address} />
      </Form>
    </ModalDialog>
  );
}

const App = () => {
  const [isOpen, setOpen] = useState(false);
  const [isReload, setReload] = useState(true);
  const [wallets, setWallets] = useState([]);

  useEffect(async () => {
    if (isReload === false)
      return;
    console.log('reloading', isReload);
    const results = await storage.getWallets();
    setWallets(results);
    setReload(false);
  }, [isReload])

  return (
    <Fragment>
      <WalletTable list={wallets} reload={setReload} />
      <Button text='Add Wallet' icon='editor-add' onClick={() => setOpen(true)} />
      {isOpen && <AddWalletModal
        onSubmit={async form => {
          storage.addWallet(form);
          setReload(true);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />}
    </Fragment>
  );
};

export default render(
  <SpacePage>
    <App />
  </SpacePage>
);