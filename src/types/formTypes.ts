export enum FieldType {
  Text = "text",
  Textarea = "textarea",
  Image = "image",
  Checkbox = "checkbox",
  Number = "number",
  Select = "select",
  Password = "password",
}

export type Field = {
  name: string;
  label: string;
  type: FieldType;
};