import api, {
  route,
} from '@forge/api';
import ForgeUI, {
  render,
  Fragment,
  Macro,
  MacroConfig,
  Text,
  TextField,
  useProductContext,
  useState,
  useConfig,
} from '@forge/ui';

const fetchCommentsForContent = async (contentId) => {
  const res = await api
    .asUser()
    .requestConfluence(route`/rest/api/content/${contentId}/child/comment`);

  const data = await res.json();
  return data.results;
};

const defaultConfig = {
  name: 'Unnamed Pet',
  age: '0'
};

const App = () => {
  const context = useProductContext();
  const [comments] = useState(async () => await fetchCommentsForContent(context.contentId));
  console.log(`Number of comments on this page: ${comments.length}`);

  const config = useConfig() || defaultConfig;

  return (
    <Fragment>
      <Text>Hello world!!</Text>
      <Text>
        Number of comments on this page: {comments.length}
      </Text>
      <Text>{config.name} is {config.age} years old.</Text>
    </Fragment>
  );
};

export const run = render(
  <Macro
    app={<App />}
  />
);


const Config = () => {
  return (
    <MacroConfig>
      <TextField name='name' label='Pet name' defaultValue={defaultConfig.name} />
      <TextField name='age' label='Pet age' defaultValue={defaultConfig.age} />
    </MacroConfig>
  );
};

export const config = render(<Config />);