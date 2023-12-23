import React, { forwardRef } from "react";

type TooltipProps = {
  visible: boolean;
  text: string;
  top: number;
  left: number;
};

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ visible, text, top, left }, ref) => {
    if (!visible) return null;

    return (
      <div
        ref={ref}
        className="tooltip"
        style={{
          top: `${top}px`,
          left: `${left}px`,
          position: "absolute",
          zIndex: "100",
        }}
      >
        <button
          onClick={() => {
            console.log("click button 1");
          }}
          type="button"
        >
          button 1
        </button>
        <button
          onClick={() => {
            console.log("click button 2");
          }}
         type="button">
          button 2
        </button>
      </div>
    );
  }
);
export default Tooltip;
