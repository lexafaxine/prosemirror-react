import { EditorState } from "prosemirror-state";
import { NodeType } from "prosemirror-model";

export const isActiveHeading = (
  state: EditorState,
  headingType: NodeType,
  level: number
) => {
  const { from, to } = state.selection;

  let isActive = false;

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type === headingType && node.attrs.level === level) {
      isActive = true;
    }
  });

  return isActive;
};
