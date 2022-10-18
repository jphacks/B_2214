import { TopPageStateProvider } from '../../contexts/TopPageStateContext';

import StateHandler from './StateHandler';

const TopPage = () => {
  return (
    <TopPageStateProvider>
      <StateHandler />
    </TopPageStateProvider>
  );
};

export default TopPage;
