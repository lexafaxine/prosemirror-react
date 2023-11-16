import React, { FC, useEffect, useRef } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, Node as ProseMirrorNode } from "prosemirror-model";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { menuBar } from "prosemirror-menu";
import { history } from "prosemirror-history";
import "prosemirror-menu/style/menu.css";
import "prosemirror-view/style/prosemirror.css";
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
  useEffect(() => {
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
      }
    });
    view.focus();
    return () => {
      view.destroy();
    };
  }, [editorValue, schema, setEditorState]);
  return <div ref={contentRef} id="editor"></div>;
};

export default React.memo(Editor);
