"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateSlug } from "@/lib/utils";
import { FieldType } from "@/types/formTypes";

type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
};

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
  onSave: (data: Record<string, string>) => void;
  fields: Field[];
  initialData?: Record<string, string>;
  uploadType?: "article" | "realisation" | "prestation";
};

export function ModalForm({ title, open, onClose, onSave, fields, initialData, uploadType }: Props) {
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialState: Record<string, string> = {};
    fields.forEach((field) => {
      initialState[field.name] = initialData?.[field.name] ?? "";
    });
    setForm(initialState);
  }, [initialData, fields]);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (
        name === "title" &&
        "slug" in prev &&
        (!prev.slug || prev.slug === generateSlug(prev.title))
      ) {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    if (uploadType) {
      formData.append("type", uploadType);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        handleChange("imageUrl", url);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              {field.type === "text" && (
                <Input
                  placeholder={field.label}
                  value={form[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  placeholder={field.label}
                  value={form[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="h-32 resize-none whitespace-pre-wrap"
                />
              )}

              {field.type === "image" && (
                <div className="space-y-2">
                  <Input
                    placeholder="URL de l’image"
                    value={form[field.name] ?? ""}
                    onChange={(e) => handleChange("imageUrl", e.target.value)}
                    type="url"
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </div>
              )}

              {field.type === "number" && (
                <Input
                  type="number"
                  placeholder={field.label}
                  value={form[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {field.type === "checkbox" && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form[field.name] === "true"}
                    onChange={(e) =>
                      handleChange(field.name, e.target.checked.toString())
                    }
                  />
                  <label>{field.label}</label>
                </div>
              )}
              {field.type === "select" && field.options && (
                <Select
                  value={form[field.name] ?? ""}
                  onValueChange={(value) => handleChange(field.name, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
          <Button onClick={handleSubmit}>Valider</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
