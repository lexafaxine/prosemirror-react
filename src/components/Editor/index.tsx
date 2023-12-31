import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, Node as ProseMirrorNode } from "prosemirror-model";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history } from "prosemirror-history";
import "prosemirror-menu/style/menu.css";
import "prosemirror-view/style/prosemirror.css";
import Tooltip from "../Tooltip";
import "./editorStyles.css";
import { buildInputRules, buildKeymap } from "prosemirror-example-setup";

type Props = {
  schema: Schema;
  editorValue: object | null; //デフォルト内容
  setEditorState: (state: EditorState) => void;
};

type TooltipPosition = {
  top: number;
  left: number;
};

const initialTooltipPosition = {
  top: 0,
  left: 0,
};

const Editor: FC<Props> = ({ schema, editorValue, setEditorState }) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>(
    initialTooltipPosition
  );
  const [visible, setVisible] = useState<boolean>(false);
  const viewRef = useRef<EditorView | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updateTooltip = useCallback((state: EditorState) => {
    const { empty, from, to } = state.selection;
    if (!empty) {
      const start = viewRef.current?.coordsAtPos(from);
      const end = viewRef.current?.coordsAtPos(to);
      if (start && end && contentRef.current) {
        const box = contentRef.current.getBoundingClientRect();
        const left = Math.max((start.left + end.left) / 2, start.left + 3);
        const top = end.bottom - box.top;
        setTooltipPosition({
          top: top,
          left: left,
        });
        setVisible(true);
      }
    } else {
      setTooltipPosition((prev) => ({ ...prev, visible: false }));
    }
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const editorState = EditorState.create({
        doc: ProseMirrorNode.fromJSON(schema, editorValue) ?? undefined,
        plugins: [
          keymap(buildKeymap(schema)),
          keymap(baseKeymap),
          buildInputRules(schema),
          history(),
        ],
      });

      const view = new EditorView(contentRef.current, {
        state: editorState,
        dispatchTransaction(transaction) {
          const newState = view.state.apply(transaction);
          view.updateState(newState);
          setEditorState(newState);
        },
      });

      view.focus();
      viewRef.current = view;

      const handleMouseUp = () => {
        if (viewRef.current) {
          updateTooltip(viewRef.current.state);
        }
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (
          tooltipRef.current &&
          !tooltipRef.current.contains(event.target as Node)
        ) {
          setVisible(false);
        }
      };

      view.dom.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        viewRef.current?.destroy();
        view.dom.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [editorValue, schema, setEditorState, updateTooltip]);

  return (
    <>
      {viewRef.current && (
        <Tooltip
          ref={tooltipRef}
          visible={visible}
          top={tooltipPosition.top}
          left={tooltipPosition.left}
          editorView={viewRef.current}
          setVisible = {setVisible}
          schema={schema}
        />
      )}
      <div ref={contentRef} id="editor"></div>
    </>
  );
};

export default React.memo(Editor);
