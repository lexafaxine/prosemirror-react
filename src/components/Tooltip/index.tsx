import React from "react";

type TooltipProps = {
  visible: boolean;
  text: string;
  top: number;
  left: number;
};

const Tooltip: React.FC<TooltipProps> = ({ visible, text, top, left }) => {
  if (!visible) return null;

  return (
    <div
      className="tooltip"
      style={{ top: `${top}px`, left: `${left}px`, position: "absolute" }}
    >
      <button className="tooltip-btn">Button 1</button>
      <button className="tooltip-btn">Button 2</button>
    </div>
  );
};

export default Tooltip;
