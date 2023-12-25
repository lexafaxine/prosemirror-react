import { EditorState } from "prosemirror-state";
import { NodeType } from "prosemirror-model";

export const isActiveList = (state: EditorState, listType: NodeType) => {
  const { from, to } = state.selection;
  let isActive = false;

  state.doc.nodesBetween(from, to, (node) => {
    if (node.type === listType) {
      isActive = true;
    }
  });

  console.log(isActive)

  return isActive;
};
