import CalculateSection from '../../components/CalculateSection';
import DrawCanvasSection from '../../components/DrawCanvasSection';
import DropImageSection from '../../components/DropImageSection';
import Predict from '../../components/Predict';
import { TopPageStateProvider } from '../../contexts/TopPageStateContext';

const TopPage = () => {
  return (
    <TopPageStateProvider>
      <DrawCanvasSection />
      <DropImageSection />
      <CalculateSection />
      <Predict imageUrl="https://github.com/pytorch/hub/raw/master/images/dog.jpg"/>
    </TopPageStateProvider>
  );
};

export default TopPage;
