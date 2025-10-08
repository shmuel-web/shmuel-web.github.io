"use client";

export default function SvgAnimation() {
  // Calculate triangle points for an isosceles triangle
  // Base: 50px, height: ~43.3px (using 30-60-90 triangle ratio)
  const base = 50;
  const height = (base * Math.sqrt(3)) / 2; // ~43.3px
  
  // Triangle points (centered in viewBox)
  const centerX = 100;
  const centerY = 100;
  
  // Top point
  const topX = centerX;
  const topY = centerY - height / 2;
  
  // Bottom left point
  const bottomLeftX = centerX - base / 2;
  const bottomLeftY = centerY + height / 2;
  
  // Bottom right point
  const bottomRightX = centerX + base / 2;
  const bottomRightY = centerY + height / 2;

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-auto max-h-[200px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Group containing triangle and circles for rotation */}
        <g>
          {/* Dashed triangle */}
          {/* <polygon
            points={`${topX},${topY} ${bottomLeftX},${bottomLeftY} ${bottomRightX},${bottomRightY}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="5,5"
            className="text-foreground/60"
          /> */}
          
          {/* Red circle at top point */}
          <circle
            cx={topX}
            cy={topY}
            r="1"
            fill="red"
            fillOpacity="0.63"
          >
            <animate
              attributeName="r"
              from="1"
              to="45"
              dur="2s"
              begin="1s"
              repeatCount="1"
              fill="freeze"
              calcMode="spline"
              keySplines="0.25 0.1 0.25 1"
            />
          </circle>
          
          {/* Yellow circle at bottom left point */}
          <circle
            cx={bottomLeftX}
            cy={bottomLeftY}
            r="1"
            fill="yellow"
            fillOpacity="0.63"
          >
            <animate
              attributeName="r"
              from="1"
              to="45"
              dur="2s"
              begin="1s"
              repeatCount="1"
              fill="freeze"
              calcMode="spline"
              keySplines="0.25 0.1 0.25 1"
            />
          </circle>
          
          {/* Blue circle at bottom right point */}
          <circle
            cx={bottomRightX}
            cy={bottomRightY}
            r="1"
            fill="blue"
            fillOpacity="0.63"
          >
            <animate
              attributeName="r"
              from="1"
              to="45"
              dur="2s"
              begin="1s"
              repeatCount="1"
              fill="freeze"
              calcMode="spline"
              keySplines="0.25 0.1 0.25 1"
            />
          </circle>
          
          {/* Rotation animation for the entire group */}
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="2s"
            begin="1s"
            repeatCount="1"
            fill="freeze"
            calcMode="spline"
            keySplines="0.25 0.1 0.25 1"
          />
        </g>
      </svg>
    </div>
  );
}
