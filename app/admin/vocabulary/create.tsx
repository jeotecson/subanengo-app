import { Create, SimpleForm, TextInput, NumberInput, required, ReferenceInput } from "react-admin";

export const VocabularyCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="unitId" reference="units"/>
      <TextInput source="word" validate={[required()]} />
      <TextInput source="translation" validate={[required()]} />
      <TextInput source="audioSrc" validate={[required()]} />
      <TextInput source="slowAudioSrc" validate={[required()]} />
    </SimpleForm>
  </Create>
);
