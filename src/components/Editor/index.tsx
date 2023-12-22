import React, { FC, useEffect, useRef, useState } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, Node as ProseMirrorNode } from "prosemirror-model";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { menuBar } from "prosemirror-menu";
import { history } from "prosemirror-history";
import "prosemirror-menu/style/menu.css";
import "prosemirror-view/style/prosemirror.css";
import Tooltip from "../Tooltip";
import "./editorStyles.css";
import {
  buildInputRules,
  buildKeymap,
  buildMenuItems,
} from "prosemirror-example-setup";

type Props = {
  schema: Schema;
  editorValue: object | null; //デフォルト内容
  setEditorState: (state: EditorState) => void;
};

const Editor: FC<Props> = ({ schema, editorValue, setEditorState }) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    text: string;
    top: number;
    left: number;
  }>({ visible: false, text: "", top: 0, left: 0 });
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      const editorState = EditorState.create({
        doc: ProseMirrorNode.fromJSON(schema, editorValue) ?? undefined,
        plugins: [
          keymap(buildKeymap(schema)),
          keymap(baseKeymap),
          buildInputRules(schema),
          menuBar({
            content: buildMenuItems(schema).fullMenu,
            floating: true,
          }),
          history(),
        ],
      });

      const view = new EditorView(contentRef.current, {
        state: editorState,
        dispatchTransaction(transaction) {
          const newState = view.state.apply(transaction);
          view.updateState(newState);
          setEditorState(newState);
          updateTooltip(newState);
        },
      });

      view.focus();
      viewRef.current = view;
    }
    return () => {
      viewRef.current?.destroy();
    };
  }, [editorValue, schema, setEditorState]);

  const updateTooltip = (state: EditorState) => {
    const { empty, from, to } = state.selection;
    if (!empty) {
      const start = viewRef.current?.coordsAtPos(from);
      const end = viewRef.current?.coordsAtPos(to);
      if (start && end && contentRef.current) {
        const box = contentRef.current.getBoundingClientRect();
        const left = Math.max((start.left + end.left) / 2, start.left + 3);
        const top = start.top - box.top;
        setTooltip({
          visible: true,
          text: `Size: ${to - from}`,
          top: top,
          left: left,
        });
      }
    } else {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }
  };

  return (
    <>
      <Tooltip
        visible={tooltip.visible}
        top={tooltip.top}
        left={tooltip.left}
        text={tooltip.text}
      />
      <div ref={contentRef} id="editor"></div>
    </>
  );
};

export default React.memo(Editor);
