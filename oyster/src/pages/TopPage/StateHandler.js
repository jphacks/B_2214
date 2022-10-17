import CalculateSection from '../../components/CalculateSection';
import DrawCanvasSection from '../../components/DrawCanvasSection';
import DropImageSection from '../../components/DropImageSection';
import Predict from '../../components/Predict';
import Result from '../../components/Result';
import { useTopPageState } from '../../hooks/useTopPageState';

const StateHandler = () => {
  const { imageSize, manual, imageFile, showResult } = useTopPageState();

  if (imageSize) {
    if (showResult) {
      return (
        <>
          <Result />
          <DropImageSection />
        </>
      );
    } else {
      if (manual) {
        return (
          <>
            <DrawCanvasSection />
            <DropImageSection />
            <CalculateSection />
          </>
        );
      } else {
        return (
          <>
            <Predict imageUrl={imageFile} />
            <DropImageSection />
            <CalculateSection />
          </>
        );
      }
    }
  } else {
    return <DropImageSection />;
  }
};

export default StateHandler;
