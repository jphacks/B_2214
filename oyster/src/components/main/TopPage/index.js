import { TopPageStateProvider } from './contexts/topPageStateContext';
import DrawCanvasSection from './elements/DrawCanvasSection';

const TopPage = () => {
  return (
    <TopPageStateProvider>
      <DrawCanvasSection />
    </TopPageStateProvider>
  );
};

export default TopPage;
