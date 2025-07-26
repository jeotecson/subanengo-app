import { SimpleForm, Create, TextInput, ReferenceInput, NumberInput, required, SelectInput, FormDataConsumer, ArrayInput, SimpleFormIterator } from "react-admin";

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
            {
              id: "SELECT",
              name: "SELECT",
            },
            {
              id: "ASSIST",
              name: "ASSIST",
            },
            {
              id: "SCRAMBLED",
              name: "SCRAMBLED",
            }
          ]}
          validate={[required()]} 
        />
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
          {({ formData, ...rest }) =>
            formData.type === "SCRAMBLED" && (
              <>
                <TextInput 
                  source="correct_answer" 
                  label="Correct Word"
                  validate={[required()]}
                  fullWidth
                />
                <ArrayInput source="letters" label="Scrambled Letters">
                  <SimpleFormIterator>
                    <TextInput source="letter" label="Letter" validate={[required()]} />
                  </SimpleFormIterator>
                </ArrayInput>
              </>
            )
          }
        </FormDataConsumer>

        <ReferenceInput source="lessonId" reference="lessons" />
        <NumberInput source="order" validate={[required()]} label="Order" />
      </SimpleForm>

        <ReferenceInput
          source="lessonId"
          reference="lessons"
        />
        <NumberInput
          source="order"
          validate={[required()]}
          label="Order"
        />
      </SimpleForm>
    </Create>
  );
};