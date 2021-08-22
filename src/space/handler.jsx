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
  Strong,
  CheckboxGroup,
  Checkbox,
} from '@forge/ui';
import { supportedCoins } from '../utils/blockchain-api';
import * as storage from '../utils/storage';
import { webTrigger } from '@forge/api';

const ConfirmDeleteModal = ({ wallet, onClose }) => {
  return (
    <ModalDialog
      appearance='danger'
      header={`Confirm Delete "${wallet.name}"?`}
      onClose={onClose}>
      <Form onSubmit={async () => {
        await storage.removeWallet(wallet);
        onClose();
      }} />
    </ModalDialog>
  );
};

const EditWalletModal = ({ onSubmit, onClose, data}) => {
  return (
    <ModalDialog header="Edit Wallet" onClose={onClose}>
      <Form onSubmit={onSubmit}>
        <TextField label='Wallet Name' name='name' defaultValue={data.name} />
        <Select label='Platform' name='platform'>
          {supportedCoins.map(coin => coin.value === data.platform
            ? <Option label={coin.name} value={coin.value} defaultSelected />
            : <Option label={coin.name} value={coin.value} />
          )}
        </Select>
        <TextField label='Wallet Address' name='address' defaultValue={data.address} />
        <CheckboxGroup label='Others' name='settings'>
          <Checkbox label='Watch transaction' value='watch' defaultChecked={data.settings.indexOf('watch') !== -1}/>
        </CheckboxGroup>
      </Form>
    </ModalDialog>
  );
};

const WalletTable = ({ list, reload }) => {
  const [isOpen, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleteWallet, setDeleteWallet] = useState(null);

  return (
    <Fragment>
      <Table>
        <Head>
          <Cell><Text>Type</Text></Cell>
          <Cell><Text>Name</Text></Cell>
          <Cell><Text>Platform</Text></Cell>
          <Cell><Text>address</Text></Cell>
          <Cell><Text>Action</Text></Cell>
        </Head>
        {list.map(o => o.value).map((wallet, i) =>
          <Row>
            <Cell>
              <Button 
                text={wallet.type} 
                icon={wallet.type === 'wallet' ? 'suitcase' : 'document' }
                appearance='subtle'
                disabled
              />
            </Cell>
            <Cell><Text>{wallet.name}</Text></Cell>
            <Cell><Text>{wallet.platform}</Text></Cell>
            <Cell><Text>{wallet.address}</Text></Cell>
            <Cell>
              <ButtonSet>
                <Button text='' icon='edit' onClick={async () => {
                  if (wallet.type === 'wallet')
                    setEdit(wallet);
                  else
                    console.log('edit contract', wallet.key)
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
      {edit && <EditWalletModal
        data={edit}
        onSubmit={async form => {
          await storage.editWallet({ ...edit, ...form });
          reload(true);
          setEdit(false);
        }}
        onClose={() => setEdit(false)}
      />}
    </Fragment>
  );
};

const AddWalletModal = (props) => {
  return (
    <ModalDialog header="Add Wallet" onClose={props.onClose}>
      <Form onSubmit={props.onSubmit}>
        <TextField label='Wallet Name' name='name' />
        <Select label='Platform' name='platform' >
          {
            supportedCoins.map(coin => <Option label={coin.name} value={coin.value}/>)
          }
        </Select>
        <TextField label='Wallet Address' name='address' />
        <CheckboxGroup label='Others' name='settings'>
          <Checkbox label='Watch transaction' value='watch' />
        </CheckboxGroup>
      </Form>
    </ModalDialog>
  );
};

const AddContractModal = (props) => {
  return (
    <ModalDialog header="Add Contract" onClose={props.onClose}>
      <Form onSubmit={props.onSubmit}>
        <TextField label='Contract Name' name='name' />
        <Select label='Platform' name='platform'>
          <Option label='Ethereum' value='eth' />
        </Select>
        <TextField label='Contract Address' name='address' />
      </Form>
    </ModalDialog>
  );
};

const App = () => {
  const [isWalletOpen, setWalletOpen] = useState(false);
  const [isContractOpen, setContractOpen] = useState(false);
  const [isReload, setReload] = useState(true);
  const [storageList, setStorageList] = useState([]);

  const [triggerWatch] = useState(async () => await webTrigger.getUrl('test-watch'));
  const [triggerClean] = useState(async () => await webTrigger.getUrl('test-clean'))

  useEffect(async () => {
    if (isReload === false)
      return;
    console.log('reloading', isReload);
    const results = await storage.getAllWHash();
    setStorageList(results);
    setReload(false);
  }, [isReload])

  return (
    <Fragment>
      <WalletTable list={storageList} reload={setReload} />
      <Button text='Add Wallet' icon='editor-add' onClick={() => setWalletOpen(true)} />
      <Button text='Add Contract' icon='editor-add' onClick={() => setContractOpen(true)} />
      {isWalletOpen && <AddWalletModal
        onSubmit={async form => {
          await storage.addWallet({ type: 'wallet', ...form });
          setReload(true);
          setWalletOpen(false);
        }}
        onClose={() => setWalletOpen(false)}
      />}
      {isContractOpen && <AddContractModal
        onSubmit={async form => {
          await storage.addWallet({ type: 'contract', ...form });
          setReload(true);
          setContractOpen(false);
        }}
        onClose={() => setContractOpen(false)}
      />}
      <Text>&nbsp;</Text>
      <Text><Strong>Watch Url </Strong>{triggerWatch}</Text>
      <Text><Strong>Clean Url </Strong>{triggerClean}</Text>
    </Fragment>
  );
};

export default render(
  <SpacePage>
    <App />
  </SpacePage>
);