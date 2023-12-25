import { EditorView } from "prosemirror-view";
import { toggleMark, setBlockType, wrapIn } from "prosemirror-commands";
import { isActiveMark } from "./utils/isActiveMark";
import { isActiveHeading } from "./utils/IsActiveHeading";
import { isActiveList } from "./utils/isActiveList";
import React, { forwardRef } from "react";
import {
  liftListItem,
  wrapInList,
} from "prosemirror-schema-list";
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
    const toggleMarkdown = (markType: any) => {
      toggleMark(markType)(editorView.state, editorView.dispatch, editorView);
      editorView.focus();
      setVisible(false);
    };
    const toggleHeading = (level: number) => {
      if (isActiveHeading(editorView.state, schema.nodes.heading, level)) {
        setParagraph();
      } else {
        setBlockType(schema.nodes.heading, { level: level })(
          editorView.state,
          editorView.dispatch,
          editorView
        );
      }

      setVisible(false);
    };

    const setParagraph = () => {
      setBlockType(schema.nodes.paragraph)(
        editorView.state,
        editorView.dispatch,
        editorView
      );
      setVisible(false);
    };

    const toggleBulletList = () => {
      if (isActiveList(editorView.state, schema.nodes.bullet_list)) {
        console.log("bingo");
        liftListItem(schema.nodes.list_item)(
          editorView.state,
          editorView.dispatch
        );
      } else {
        wrapInList(schema.nodes.bullet_list)(
          editorView.state,
          editorView.dispatch,
          editorView
        );
      }
      setVisible(false);
    };

    const toggleOrderedList = () => {
      if (isActiveList(editorView.state, schema.nodes.ordered_list)) {
        liftListItem(schema.nodes.list_item)(
          editorView.state,
          editorView.dispatch
        );
      } else {
        wrapIn(schema.nodes.ordered_list)(
          editorView.state,
          editorView.dispatch,
          editorView
        );
      }
      setVisible(false);
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
        <StyledButton isActive={false} onClick={() => toggleHeading(1)}>
          H1
        </StyledButton>
        <StyledButton isActive={false} onClick={() => toggleHeading(2)}>
          H2
        </StyledButton>
        <StyledButton
          isActive={isActiveList(editorView.state, schema.nodes.bullet_list)}
          onClick={() => toggleBulletList()}
        >
          L1
        </StyledButton>
        <StyledButton
          isActive={isActiveList(editorView.state, schema.nodes.ordered_list)}
          onClick={() => toggleOrderedList()}
        >
          L2
        </StyledButton>
      </TooltipContainer>
    );
  }
);

export default Tooltip;
