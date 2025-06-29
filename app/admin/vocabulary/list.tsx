import { List, Datagrid, TextField, NumberField, ReferenceField } from "react-admin";

export const VocabularyList = () => (
  <List>
    <Datagrid rowClick="edit">
      <NumberField source="id" />
      <ReferenceField source="unitId" reference="units" />
      <TextField source="word" />
      <TextField source="translation" />
      <TextField source="audioSrc" />
      <TextField source="slowAudioSrc" />
    </Datagrid>
  </List>
);
