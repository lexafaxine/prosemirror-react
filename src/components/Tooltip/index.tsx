import { EditorView } from "prosemirror-view";
import { toggleMark } from "prosemirror-commands";
import { isActiveMark } from "./utils/isActiveMark";
import React, { forwardRef } from "react";
import { Schema } from "prosemirror-model";
import styled from "styled-components";

type TooltipContainerProps = {
  top: number;
  left: number;
};

const TooltipContainer = styled.div<TooltipContainerProps>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  z-index: 100;
`;

type StyledButtonProps = {
  isActive: boolean;
};

const StyledButton = styled.button<StyledButtonProps>`
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
`;

type TooltipProps = {
  visible: boolean;
  top: number;
  left: number;
  editorView: EditorView;
  schema: Schema;
};

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ visible, top, left, editorView, schema }, ref) => {
    const toggle = (markType: any) => {
      toggleMark(markType)(editorView.state, editorView.dispatch, editorView);
      editorView.focus();
    };

    if (!visible) return null;

    return (
      <TooltipContainer ref={ref} top={top} left={left}>
        <StyledButton
          isActive={isActiveMark(editorView.state, schema.marks.strong)}
          onClick={() => toggle(schema.marks.strong)}
        >
          B
        </StyledButton>
        <StyledButton
          isActive={isActiveMark(editorView.state, schema.marks.em)}
          onClick={() => toggle(schema.marks.em)}
        >
          I
        </StyledButton>
      </TooltipContainer>
    );
  }
);

export default Tooltip;
