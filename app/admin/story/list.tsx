import { List, Datagrid, TextField, NumberField, ReferenceField, TextInput } from "react-admin";

export const StoryList = () => (
  <List>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <ReferenceField source="unitId" reference="units" />
      <TextField source="storyTitle" />
      <TextField source="story" />
      <TextField source="storyTranslation" />
      <TextField source="audioSrc" />
    </Datagrid>
  </List>
);
