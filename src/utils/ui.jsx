import ForgeUI, {
  Text,
  Strong,
  Link,
} from '@forge/ui';

export const Description = ({ title, children }) =>
  <Text>
    <Strong>{`${title} `}</Strong>
    {children}
  </Text>;

export const DescriptionLink = ({ href, children }) =>
  <Link href={href} openNewTab={true}>
    {children}
  </Link>
