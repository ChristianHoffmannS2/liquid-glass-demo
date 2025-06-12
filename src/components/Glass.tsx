/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useRef, useEffect, useState } from "react";
import background from "../assets/room.jpg";

const svg = css`
  width: 100vw;
  height: 100vh;
  display: block;
`;

const MASK_WIDTH = 720;
const MASK_HEIGHT = 400;
const MASK_RADIUS = 28;
const VIEWBOX_WIDTH = 1920;
const VIEWBOX_HEIGHT = 1080;

// Speed in pixels per second
const SPEED_X = 75;
const SPEED_Y = 75;

// For shadow
const OUTER_SHADOW_BLUR = 32; // You can set this to your --outer-shadow-blur value

const Glass: React.FC = () => {
  const [maskPos, setMaskPos] = useState({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0, dx: SPEED_X, dy: SPEED_Y });
  const lastTimeRef = useRef(performance.now());
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const animate = (now: number) => {
      const elapsed = (now - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = now;

      let { x, y, dx, dy } = posRef.current;
      x += dx * elapsed;
      y += dy * elapsed;

      // Bounce off edges
      if (x < 0) {
        x = 0;
        dx *= -1;
      }
      if (x > VIEWBOX_WIDTH - MASK_WIDTH) {
        x = VIEWBOX_WIDTH - MASK_WIDTH;
        dx *= -1;
      }
      if (y < 0) {
        y = 0;
        dy *= -1;
      }
      if (y > VIEWBOX_HEIGHT - MASK_HEIGHT) {
        y = VIEWBOX_HEIGHT - MASK_HEIGHT;
        dy *= -1;
      }

      posRef.current = { x, y, dx, dy };
      setMaskPos({ x, y });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <svg css={svg} viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="glass-distortion" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            numOctaves="2"
            seed="92"
            result="noise"
          >
            <animate
              id="noiseAnimate"
              attributeName="baseFrequency"
              values="0.002;.008;0.002"
              from="0"
              to="8"
              dur="10s"
              repeatCount="indefinite"
            ></animate>
          </feTurbulence>
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale="77"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        {/* Shadow filter */}
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="-6"
            dy="-6"
            stdDeviation={OUTER_SHADOW_BLUR / 8}
            floodColor="rgba(255,255,255,1)"
          />

          <feDropShadow
            dx="6"
            dy="6"
            stdDeviation={OUTER_SHADOW_BLUR / 8}
            floodColor="rgba(0,0,0,0.2)"
          />
        </filter>

        {/* Animated rectangular mask with border radius */}
        <mask id="glass-mask">
          <rect
            x={maskPos.x}
            y={maskPos.y}
            width={MASK_WIDTH}
            height={MASK_HEIGHT}
            rx={MASK_RADIUS}
            ry={MASK_RADIUS}
            fill="white"
          />
        </mask>
      </defs>

      {/* Background image */}
      <image
        href={background.src}
        width="1920"
        height="1080"
        preserveAspectRatio="xMidYMid meet"
      />

      <foreignObject x="600" y="200" width="720" height="400">
        <button onClick={() => alert("Button clicked!")}>Click Me</button>
      </foreignObject>

      <image
        href={background.src}
        width="1920"
        height="1080"
        preserveAspectRatio="xMidYMid meet"
        filter="url(#glass-distortion)"
        mask="url(#glass-mask)"
      />

      <foreignObject
        x="600"
        y="200"
        width="720"
        height="400"
        filter="url(#glass-distortion)"
        mask="url(#glass-mask)"
      >
        <button onClick={() => alert("Button clicked!")}>Click Me</button>
      </foreignObject>

      {/* Shadow rectangle behind the glass area */}
      <rect
        x={maskPos.x}
        y={maskPos.y}
        width={MASK_WIDTH}
        height={MASK_HEIGHT}
        rx={MASK_RADIUS}
        ry={MASK_RADIUS}
        fill="white"
        opacity="0.2"
        filter="url(#shadow)"
      />
    </svg>
  );
};

export default Glass;
