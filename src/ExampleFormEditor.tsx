import React, { useState } from "react";
import Editor from "./components/Editor";
import { exampleEditorValue } from "./constants/exampleEditorValue";
import { exampleSchema } from "./constants/exampleSchema";
import { EditorState } from "prosemirror-state";
import { defaultMarkdownSerializer } from "prosemirror-markdown";

const ExampleFormEditor = () => {
  const [editorState, setEditorState] = useState<EditorState>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editorState) {
      const content = defaultMarkdownSerializer.serialize(editorState.doc);
      console.log(content);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Editor
        schema={exampleSchema}
        editorValue={exampleEditorValue}
        setEditorState={setEditorState}
      ></Editor>
      <button type="submit">Submit</button>
    </form>
  );
};

export default React.memo(ExampleFormEditor);
