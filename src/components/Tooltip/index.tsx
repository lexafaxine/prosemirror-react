import { EditorView } from "prosemirror-view";
import { toggleMark } from "prosemirror-commands";
import { isActiveMark } from "./utils/isActiveMark";
import React, { forwardRef } from "react";
import { Schema } from "prosemirror-model";

type TooltipProps = {
  visible: boolean;
  top: number;
  left: number;
  editorView: EditorView;
  schema: Schema;
};

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ visible, top, left, editorView, schema }, ref) => {
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
          style={{
            fontWeight: isActiveMark(
              editorView.state,
              schema.marks.strong
            )
              ? "bold"
              : undefined,
          }}
          onClick={() => {
            toggleMark(schema.marks.strong)(
              editorView.state,
              editorView.dispatch,
              editorView
            );
            editorView.focus();
          }}
        >
          B
        </button>
        <button
        style={{
          fontWeight: isActiveMark(editorView.state, schema.marks.em)
            ? "bold"
            : undefined
        }}
        onClick={() => {
          toggleMark(schema.marks.em)(
            editorView.state,
            editorView.dispatch,
            editorView
          );
          editorView.focus();
        }}
      >
        I
      </button>
      </div>
    );
  }
);
export default Tooltip;
