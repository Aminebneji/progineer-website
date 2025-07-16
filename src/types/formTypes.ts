export enum FieldType {
  Text = "text",
  Textarea = "textarea",
  Image = "image",
}

export type Field = {
  name: string;
  label: string;
  type: FieldType;
};