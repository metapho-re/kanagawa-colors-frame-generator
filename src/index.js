const colors = [
  '#76946A',
  '#C34043',
  '#DCA561',
  '#E82424',
  '#FF9E3B',
  '#6A9589',
  '#658594',
  '#727169',
  '#938AA9',
  '#957FB8',
  '#7E9CD8',
  '#9CABCA',
  '#7FB4CA',
  '#A3D4D5',
  '#7AA89F',
  '#98BB6C',
  '#938056',
  '#C0A36E',
  '#E6C384',
  '#D27E99',
  '#E46876',
  '#FF5D62',
  '#FFA066',
  '#717C7C',
];

const innerSquareTypes = ['left', 'top', 'right', 'bottom'];

const colorsUsedInSameSquare = [];

const frameParameters = {};

const colorsUsedInOtherSquares = {
  topRow: [],
  leftSquare: '',
};

const isColorUniqueInSquare = (color) =>
  colorsUsedInSameSquare.indexOf(color) === -1;

const isColorDifferentFromAdjacentSquares = (
  color,
  innerSquareType,
  rowPosition,
  columnPosition
) => {
  if (innerSquareType === 'left' && columnPosition > 0) {
    return colorsUsedInOtherSquares.leftSquare !== color;
  }

  if (innerSquareType === 'top' && rowPosition > 0) {
    return colorsUsedInOtherSquares.topRow[columnPosition] !== color;
  }

  return true;
};

const getInnerSquareBackgroundColor = (innerSquareType, index) => {
  const color = colors[Math.floor(colors.length * Math.random())];

  const rowPosition = Math.floor(index / frameParameters.squaresPerSide);
  const columnPosition = index % frameParameters.squaresPerSide;

  const isColorValid =
    isColorUniqueInSquare(color) &&
    isColorDifferentFromAdjacentSquares(
      color,
      innerSquareType,
      rowPosition,
      columnPosition
    );

  if (isColorValid && innerSquareType === 'right') {
    colorsUsedInOtherSquares.leftSquare = color;
  }

  if (isColorValid && innerSquareType === 'bottom') {
    colorsUsedInOtherSquares.topRow[columnPosition] = color;
  }

  if (isColorValid) {
    colorsUsedInSameSquare.push(color);

    return color;
  }

  return getInnerSquareBackgroundColor(innerSquareType, index);
};

const createAndAppendInnerSquareElement =
  (container, index) => (innerSquareType) => {
    const element = document.createElement('div');

    element.classList.add(innerSquareType);
    element.style.backgroundColor = getInnerSquareBackgroundColor(
      innerSquareType,
      index
    );
    element.style.width = `${frameParameters.innerSquareDimension}px`;
    element.style.height = `${frameParameters.innerSquareDimension}px`;

    container.appendChild(element);
  };

const createAndAppendOuterSquareElement = (container, index) => {
  const element = document.createElement('div');

  element.classList.add('container');
  element.style.width = `${frameParameters.outerSquareDimension}px`;
  element.style.height = `${frameParameters.outerSquareDimension}px`;

  colorsUsedInSameSquare.length = 0;
  innerSquareTypes.forEach(createAndAppendInnerSquareElement(element, index));

  container.appendChild(element);
};

const getFrameDimensionFromUrl = (urlSearchParams) => {
  const frameDimension = urlSearchParams.get('frame_dimension');
  const isFrameDimensionValid = frameDimension > 0;

  return isFrameDimensionValid ? frameDimension : 400;
};

const getSquaresPerSideFromUrl = (urlSearchParams) => {
  const squaresPerSide = urlSearchParams.get('squares_per_side');
  const isSquaresPerSideValid =
    Number.isInteger(Number(squaresPerSide)) && squaresPerSide > 0;

  return isSquaresPerSideValid ? squaresPerSide : 5;
};

const setFrameParameters = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);

  const frameDimension = getFrameDimensionFromUrl(urlSearchParams);
  const squaresPerSide = getSquaresPerSideFromUrl(urlSearchParams);

  frameParameters.frameDimension = frameDimension;
  frameParameters.squaresPerSide = squaresPerSide;
  frameParameters.outerSquareDimension =
    Math.floor((frameDimension * 10) / squaresPerSide) / 10;
  frameParameters.innerSquareDimension =
    0.5 * Math.sqrt(2 * Math.pow(frameParameters.outerSquareDimension, 2));
};

const generateFrame = () => {
  const frame = document.querySelector('#root');

  setFrameParameters();

  frame.style.width = `${frameParameters.frameDimension}px`;
  frame.style.height = `${frameParameters.frameDimension}px`;

  for (
    let index = 0;
    index < Math.pow(frameParameters.squaresPerSide, 2);
    index += 1
  ) {
    createAndAppendOuterSquareElement(frame, index);
  }
};

generateFrame();
