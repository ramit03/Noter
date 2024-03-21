import { Modal, Form, Button } from "react-bootstrap";
import { Note } from "../models/notes";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import TextInputField from "../components/form/TextInputField"
interface AddEditNoteDialogProps {
  notetoEdit?:Note,
  onDismiss: () => void;
  onNoteSaved: (note: Note) => void;
}

const AddEditNoteDialog = ({ notetoEdit,onDismiss, onNoteSaved }: AddEditNoteDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>({
    defaultValues: {
      title:notetoEdit?.title || "",
      text:notetoEdit?.text|| ""
    }
  });

  async function onSubmit(input: NoteInput) {
    try {
      let noteResponse:Note;
      if(notetoEdit){
        noteResponse = await NotesApi.updateNode(notetoEdit._id,input);
      }else {
        noteResponse = await NotesApi.createNote(input);
       
      }
      onNoteSaved(noteResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
  return (
    <Modal centered show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>{notetoEdit? "Edit note": "Add note"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addNoteForm" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
          name="title"
          label="Title"
          type="text"
          placeholder = "Title"
          register={register}
          registerOptions={{required:"Required"}}
          error={errors.title}
          />
           <TextInputField
          name="text"
          label="Text"
          as="textarea"
          rows={5}
          placeholder = "Text"
          register={register}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="addNoteForm" disabled={isSubmitting}>
        {notetoEdit? "Save": "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditNoteDialog;
