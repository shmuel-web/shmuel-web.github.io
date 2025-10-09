"use client";

export default function SvgAnimation() {
  // Calculate triangle points for an isosceles triangle
  // Base: 50px, height: ~43.3px (using 30-60-90 triangle ratio)
  const base = 63;
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

  // No labels; SVG-only visual

  const bringGroupToFront = (e: React.MouseEvent<SVGGElement>) => {
    const group = e.currentTarget as unknown as SVGGElement;
    const parent = group.parentNode;
    if (parent) {
      parent.appendChild(group);
    }
  };

  const setHover = (key: "top" | "left" | "right", hovered: boolean) => {
    const node = document.getElementById(`node-${key}`);
    if (node) node.classList.toggle("hovered", hovered);
  };

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-[300px] text-foreground"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
          {`
            .interactive-circle {
              transition: fill-opacity 300ms ease;
            }
            .interactive-circle:hover {
              fill-opacity: 1;
            }
            /* Hover scale behavior for circles and labels */
            .node, .label {
              transition: transform 150ms ease;
              transform-box: fill-box;
              transform-origin: center;
            }
            .hovered {
              transform: scale(1.1);
            }
            .svg-link {
              cursor: pointer;
            }
            .svg-link text { text-decoration: none; }
            .svg-link:hover text { text-decoration: underline; }
          `}
        </style>
        {/* Group containing all content with shared rotation */}
        <g>
          {/* Shapes layer: only shapes are re-ordered on hover */}
          <g id="shapes-layer">
            {/* Dashed triangle */}
            {/* <polygon
              points={`${topX},${topY} ${bottomLeftX},${bottomLeftY} ${bottomRightX},${bottomRightY}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="5,5"
              className="text-foreground/60"
            /> */}
            
            {/* Top circle */}
            <g id="node-top" className="node" onMouseEnter={(e) => { bringGroupToFront(e); setHover("top", true); }} onMouseLeave={() => setHover("top", false)}>
              <circle
                cx={topX}
                cy={topY}
                r="1"
                fillOpacity="0"
                fill="red"
                className="interactive-circle"
              >
                <animate
                  attributeName="r"
                  from="0"
                  to="63"
                  dur="2s"
                  begin="0s"
                  repeatCount="1"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1"
                />
                <animate
                  attributeName="fill-opacity"
                  from="0"
                  to="0.72"
                  dur="2s"
                  begin="0s"
                  repeatCount="1"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1"
                />
              </circle>
            </g>
            
            {/* Bottom-left circle */}
            <g id="node-left" className="node" onMouseEnter={(e) => { bringGroupToFront(e); setHover("left", true); }} onMouseLeave={() => setHover("left", false)}>
              <circle
                cx={bottomLeftX}
                cy={bottomLeftY}
                r="1"
                fill="yellow"
                fillOpacity="0"
                className="interactive-circle"
              >
                <animate
                  attributeName="r"
                  from="0"
                  to="63"
                  dur="2s"
                  begin="0s"
                  repeatCount="1"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1"
                />
                             <animate
                  attributeName="fill-opacity"
                  from="0"
                  to="0.72"
                  dur="2s"
                  begin="0s"
                  repeatCount="1"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1"
                />
              </circle>
            </g>
            
            {/* Bottom-right circle */}
            <g id="node-right" className="node" onMouseEnter={(e) => { bringGroupToFront(e); setHover("right", true); }} onMouseLeave={() => setHover("right", false)}>
              <circle
                cx={bottomRightX}
                cy={bottomRightY}
                r="1"
                fill="blue"
                fillOpacity="0"
                className="interactive-circle"
              >
                <animate
                  attributeName="r"
                  from="0"
                  to="63"
                  dur="2s"
                  begin="0s"
                  repeatCount="1"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1"
                />
                <animate
                  attributeName="fill-opacity"
                  from="0"
                  to="0.72"
                  dur="2s"
                  begin="0s"
                  repeatCount="1"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1"
                />
              </circle>
            </g>
          </g>

          {/* Rotation animation for the entire group */}
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="2s"
            begin="0s"
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
