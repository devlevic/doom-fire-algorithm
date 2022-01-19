import { fireColorsPalette } from "./firePallete";

export type FireColorProps = "red" | "green" | "blue";

export type FireDataProps = {
  fireWidth: number;
  fireHeight: number;
  source: number[];
  size: number;
  direction: 1 | 0 | 2;
  color: FireColorProps;
};

type GetColorProps = {
  r: number;
  g: number;
  b: number;
  returnColor: FireColorProps;
};

export function getColor({ r, g, b, returnColor }: GetColorProps) {
  switch (returnColor) {
    case "green":
      return `rgb(${b},${r}, ${g})`;
    case "blue":
      return `rgb(${b}, ${g}, ${r})`;
    case "red":
      return `rgb(${r}, ${g}, ${b})`;
  }
}

type RenderFireCanvasProps = {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
};

export type FireDoomMethods = {
  createFireStructure: () => void;
  stopFireSource: () => void;
  createFireSource: () => void;
  updateFireStructure: () => void;
  renderFireCanvas: (props: RenderFireCanvasProps) => void;
  setNewColor: (color: FireColorProps) => void;
  setNewSize: (newValue: number) => void;
  setNewDirection: (direction: 0 | 1 | 2) => void;
};

export const fireDoom = ({
  source,
  fireWidth,
  fireHeight,
  direction,
  size,
  color,
}: FireDataProps): FireDoomMethods => {
  const props: FireDataProps = {
    fireWidth,
    fireHeight,
    source,
    color,
    size,
    direction,
  };

  const createFireStructure = () => {
    const { fireWidth, fireHeight, source } = props;
    const numberOfPixels = fireWidth * fireHeight;

    for (let i = 0; i < numberOfPixels; i++) {
      source.push(0);
    }
  };

  function stopFireSource() {
    const { source, fireWidth, fireHeight } = props;
    for (let column = 0; column < fireWidth; column++) {
      const overflowCanvas = fireWidth * fireHeight;
      const index = overflowCanvas - fireWidth + column;
      source[index] = 0;
    }
  }

  function createFireSource() {
    const { source, fireWidth, fireHeight } = props;
    for (let column = 0; column < fireWidth; column++) {
      const overflowCanvas = fireWidth * fireHeight;
      const index = overflowCanvas - fireWidth + column;
      source[index] = 36;
    }
  }

  function updateFireStructure() {
    const { source, fireWidth, fireHeight, size, direction } = props;
    for (let row = 0; row < fireHeight; row++) {
      for (let column = 0; column < fireWidth; column++) {
        const index = column + fireWidth * row;
        const belowLine = index + fireWidth;
        const belowIntensity = source[belowLine];
        const decay = Math.floor(Math.random() * size);

        if (belowLine >= fireWidth * fireHeight) return;
        if (direction == 1) {
          source[index - decay] =
            belowIntensity - decay >= 0 ? belowIntensity - decay : 0;
        } else if (direction == 2) {
          source[index] =
            belowIntensity - decay >= 0 ? belowIntensity - decay : 0;
        } else {
          source[index + decay] =
            belowIntensity - decay >= 0 ? belowIntensity - decay : 0;
        }
      }
    }
  }

  function renderFireCanvas({
    ctx,
    canvasWidth,
    canvasHeight,
  }: RenderFireCanvasProps) {
    const { source, fireWidth, fireHeight, color } = props;

    const rectWidth = Math.floor(canvasWidth / fireWidth);
    const rectHeight = Math.floor(canvasHeight / fireHeight);
    for (let row = 0; row < fireHeight; row++) {
      for (let column = 0; column < fireWidth; column++) {
        const index = column + fireWidth * row;
        const intensity = source[index];
        const { r, g, b } = fireColorsPalette[intensity];
        const x = Math.round(rectWidth * column);
        const y = Math.round(rectHeight * row);
        ctx.fillStyle = getColor({ r, g, b, returnColor: color });
        ctx.fillRect(x, y, rectWidth, rectHeight);
      }
    }
  }

  function setNewColor(color: "red" | "green" | "blue") {
    props.color = color;
  }

  function setNewSize(newValue: number) {
    props.size = newValue;
  }

  function setNewDirection(direction: 1 | 0 | 2) {
    props.direction = direction;
  }

  return {
    setNewColor,
    setNewDirection,
    createFireStructure,
    stopFireSource,
    createFireSource,
    updateFireStructure,
    renderFireCanvas,
    setNewSize,
  };
};
