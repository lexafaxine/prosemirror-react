import { EditorState } from "prosemirror-state";
import { MarkType } from "prosemirror-model";
import { TextSelection } from "prosemirror-state";

export const isActiveMark = (state: EditorState, markType: MarkType) => {
    // 参考: https://github.com/ProseMirror/prosemirror-commands/blob/1.3.1/src/commands.ts#L510-L534
    if (state.selection instanceof TextSelection && state.selection.$cursor) {
      return markType.isInSet(
        state.storedMarks || state.selection.$cursor.marks()
      )
        ? true
        : false;
    }
  
    const { ranges } = state.selection;
    for (let i = 0; i < ranges.length; i++) {
      if (
        state.doc.rangeHasMark(ranges[i].$from.pos, ranges[i].$to.pos, markType)
      ) {
        return true;
      }
    }
    return false;
  };