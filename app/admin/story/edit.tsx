import { Edit, SimpleForm, TextInput, NumberInput, required, ReferenceInput } from "react-admin";

export const StoryEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="id" disabled />      
      <ReferenceInput source="unitId" reference="units"/>
      <TextInput source="storyTitle" validate={[required()]} />
      <TextInput source="story" validate={[required()]} />
      <TextInput source="translation" validate={[required()]} />
      <TextInput source="audioSrc" validate={[required()]} />
    </SimpleForm>
  </Edit>
);
