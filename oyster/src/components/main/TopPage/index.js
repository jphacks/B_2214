import { TopPageStateProvider } from './contexts/TopPageStateContext';
import CaluculateSection from './elements/CalculateSection';
import DrawCanvasSection from './elements/DrawCanvasSection';
import DropImageSection from './elements/DropImageSection';

const TopPage = () => {
  return (
    <TopPageStateProvider>
      <DrawCanvasSection />
      <DropImageSection />
      <CaluculateSection />
    </TopPageStateProvider>
  );
};

export default TopPage;
