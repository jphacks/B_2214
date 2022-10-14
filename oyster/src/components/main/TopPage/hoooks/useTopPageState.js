import { useContext } from 'react';

import { WithoutProviderError } from '../../../modules/utils/error';
import { topPageStateContext } from '../contexts/TopPageStateContext';

export const useTopPageState = () => {
  const context = useContext(topPageStateContext);

  if (!context) throw new WithoutProviderError();

  return context;
};
