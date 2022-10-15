import CalculateSection from '../../components/CalculateSection';
import DrawCanvasSection from '../../components/DrawCanvasSection';
import DropImageSection from '../../components/DropImageSection';
import { TopPageStateProvider } from '../../contexts/TopPageStateContext';

const TopPage = () => {
  return (
    <TopPageStateProvider>
      <DrawCanvasSection />
      <DropImageSection />
      <CalculateSection />
    </TopPageStateProvider>
  );
};

export default TopPage;
