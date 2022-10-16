import { useTopPageState } from '../../hooks/useTopPageState';

const CaluculateSection = () => {
  const {
    pixelArea,
    inputArea,
    setInputArea,
    options,
    scale,
    setScale,
    selectedMetric,
    setSelectedMetric,
    setShowResult,
  } = useTopPageState();
  const onClickCalc = () => {
    if (selectedMetric === 'm2') {
      setScale(inputArea / pixelArea);
      console.log(inputArea / pixelArea);
    } else {
      setScale((1.62 * inputArea) / pixelArea);
      console.log((1.62 * inputArea) / pixelArea);
    }
    setShowResult(true);
  };

  const handleChange = (event) => {
    console.log(event.target.value);
    setSelectedMetric(event.target.value);
  };

  return (
    <div>
      <p>total pixels in the polygon is {pixelArea} pixels</p>

      <input
        type="number"
        value={inputArea}
        onChange={(event) => setInputArea(event.target.value)}
      />
      <select value={selectedMetric} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
      <button onClick={onClickCalc}>calc</button>
      <p>scale: {scale} m^2/pixel</p>
    </div>
  );
};

export default CaluculateSection;
