import { EditorView } from "prosemirror-view";
import { toggleMark, setBlockType } from "prosemirror-commands";
import { isActiveMark } from "./utils/isActiveMark";
import React, { forwardRef, useState } from "react";
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
  setVisible: (visible: boolean) => void;
};

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ visible, top, left, editorView, schema, setVisible }, ref) => {
    const [headingState, setHeadingState] = useState<number>(0); //0 for paragraph

    const toggleMarkdown = (markType: any) => {
      toggleMark(markType)(editorView.state, editorView.dispatch, editorView);
      editorView.focus();
      setVisible(false);
    };
    const toggleHeading = (level: number) => {
      if (headingState !== level) {
        setBlockType(schema.nodes.heading, { level: level })(
          editorView.state,
          editorView.dispatch,
          editorView
        );
        setHeadingState(level);
      } else {
        setParagraph();
        setHeadingState(0);
      }
      setVisible(false);
    };

    const setParagraph = () => {
      setVisible(false);
      setBlockType(schema.nodes.paragraph)(
        editorView.state,
        editorView.dispatch,
        editorView
      );
    };
    if (!visible) return null;

    return (
      <TooltipContainer ref={ref} top={top} left={left}>
        <StyledButton
          isActive={isActiveMark(editorView.state, schema.marks.strong)}
          onClick={() => toggleMarkdown(schema.marks.strong)}
        >
          B
        </StyledButton>
        <StyledButton
          isActive={headingState === 1}
          onClick={() => toggleHeading(1)}
        >
          H1
        </StyledButton>
        <StyledButton
          isActive={headingState === 2}
          onClick={() => toggleHeading(2)}
        >
          H2
        </StyledButton>
      </TooltipContainer>
    );
  }
);

export default Tooltip;
