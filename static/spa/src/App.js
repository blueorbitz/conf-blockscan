import React, { useEffect, useState, Fragment } from 'react';
import { invoke } from '@forge/bridge';

// Atlaskit
import Lozenge from '@atlaskit/lozenge';
import Spinner from '@atlaskit/spinner';

// Custom Styles
import {
  Card, Row, Icon, IconContainer, Status, SummaryActions, SummaryCount, SummaryFooter,
  ScrollContainer, Form, LoadingContainer
} from './Styles';

function App() {
  const [samples, setSample] = useState(null);
  const [input, setInput] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const [isDeleteAllShowing, setDeleteAllShowing] = useState(false);
  const [isDeletingAll, setDeletingAll] = useState(false);

  if (!isFetched) {
    setIsFetched(true);
    invoke('get-all').then(setSample);
  }

  const onSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (!samples) return;
    console.log('useEffect');
  }, [samples]);

  if (!samples) {
    return (
      <Card>
        <LoadingContainer>
          <Spinner size="large" />
        </LoadingContainer>
      </Card>
    );
  }

  return (
    <Card>
      <SummaryFooter>
        <Lozenge>Completed</Lozenge>
      </SummaryFooter>
    </Card>
  );
}

export default App;
