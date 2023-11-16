import Editor from "./components/Editor";
import { exampleEditorValue } from "./constants/exampleEditorValue";
import { exampleSchema } from "./constants/exampleSchema";

const ExampleEditor = () => {
  return (
    <Editor schema={exampleSchema} editorValue={exampleEditorValue}></Editor>
  );
};

export default ExampleEditor;
