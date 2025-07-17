export enum FieldType {
  Text = "text",
  Textarea = "textarea",
  Image = "image",
  Checkbox = "checkbox",
  Number = "number",
  Select = "select",
}

export type Field = {
  name: string;
  label: string;
  type: FieldType;
};