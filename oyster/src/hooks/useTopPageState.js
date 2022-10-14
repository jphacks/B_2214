import { useContext } from 'react';

import { topPageStateContext } from '../contexts/TopPageStateContext';
import { WithoutProviderError } from '../utils/error';

export const useTopPageState = () => {
  const context = useContext(topPageStateContext);

  if (!context) throw new WithoutProviderError();

  return context;
};
