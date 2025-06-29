import { Create, SimpleForm, TextInput, ReferenceInput, required } from "react-admin";

export const StoryCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="unitId" reference="units" />
      <TextInput source="storyTitle" validate={[required()]} />
      <TextInput source="story" validate={[required()]} multiline />
      <TextInput source="translation" validate={[required()]} multiline />
      <TextInput source="audioSrc" />
    </SimpleForm>
  </Create>
);
