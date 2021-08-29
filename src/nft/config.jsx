import ForgeUI, {
  Fragment,
  render,
  MacroConfig,
  TextField,
  CheckboxGroup, Checkbox,
  Select, Option,
} from '@forge/ui';

const Config = () => {
  return (
    <Fragment>
      <TextField label='Contract Address' name='contract' />
      <TextField label='Token ID' name='tokenId' />
      <Select label='Size' name='size'>
        {['xsmall', 'small', 'medium', 'large', 'xlarge']
          .map(o => <Option label={o} value={o} />)}
      </Select>
      <CheckboxGroup label='Others' name='settings'>
        <Checkbox label='Show Info' value='info' />
      </CheckboxGroup>
    </Fragment>
  );
};

export default render(
  <MacroConfig>
    <Config />
  </MacroConfig>
);