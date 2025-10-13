import {
  SimpleForm,
  Create,
  TextInput,
  ReferenceInput,
  NumberInput,
  required,
  SelectInput,
  FormDataConsumer
} from "react-admin";

export const ChallengeCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput 
          source="question" 
          validate={[required()]} 
          label="Question"
        />
        <SelectInput
          source="type"
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "ASSIST", name: "ASSIST" },
            { id: "SCRAMBLED", name: "SCRAMBLED" },
          ]}
          validate={[required()]} 
        />

        <FormDataConsumer>
          {({ formData }) =>
            formData.type === "SCRAMBLED" && (
              <>
                <TextInput
                  source="scramble_letters"
                  label="Letters (comma‑separated)"
                  helperText="e.g. G,y,a,m,x,b"
                />  
                <TextInput
                  source="correct_answer"
                  label="Correct answer"
                  helperText="e.g. Gayam"
                />
              </>
            )
          }
        </FormDataConsumer>

        <ReferenceInput source="lessonId" reference="lessons" />
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>
    </Create>
  );
};
