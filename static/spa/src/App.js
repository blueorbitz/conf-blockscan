import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';

// Atlaskit
import Lozenge from '@atlaskit/lozenge';
import Spinner from '@atlaskit/spinner';

// Custom Styles
import {
  Card, SummaryFooter, LoadingContainer,
} from './Styles';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      balance: null,
    };
  }

  async componentDidMount() {
    const balance = await invoke('get-balance');
    this.setState({ balance });
  }

  componentWillUnmount() {
  }

  render() {
    const { balance } = this.state;

    const AppLoading = () =>
      <Card>
        <LoadingContainer>
          <Spinner size="large" />
        </LoadingContainer>
      </Card>;

    const AppContent = (props) => {
      return (<Card>
        <SummaryFooter>
          <Lozenge>{ props.address }</Lozenge>
        </SummaryFooter>
      </Card>);
    };

    if (balance == null)
      return <AppLoading />;
    else
      return <AppContent address={balance.address || ''}/>;
  }
}
