import { useTopPageState } from '../../hooks/useTopPageState';

const CaluculateSection = () => {
  const {
    pixelArea,
    inputArea,
    setInputArea,
    options,
    setScale,
    selectedMetric,
    setSelectedMetric,
    setShowResult,
    points,
  } = useTopPageState();
  const onClickCalc = () => {
    if (selectedMetric === 'm2') {
      setScale(Math.sqrt(inputArea / pixelArea));
      console.log(inputArea / pixelArea);
    } else {
      setScale(Math.sqrt((1.62 * inputArea) / pixelArea));
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
      {(points &&
      Object.keys(points).length > 1 &&
      points[String(Object.keys(points)[1])].length > 2 &&
      inputArea)?
      <button onClick={onClickCalc}>calc</button>:
      <button disabled >calc</button>}
    </div>
  );
};

export default CaluculateSection;
