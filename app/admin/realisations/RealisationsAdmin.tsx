"use client";

import { useEffect, useState } from "react";
import { Realisation } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { GenericTable } from "@/components/common/genericTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModalForm } from "@/components/common/modalForm";
import { FieldType } from "@/types/formTypes";

// TODO: Ajouter un field Localisation pour les Realisations, modifier tout le reste en conséquence.

export default function RealisationsAdmin() {
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRealisation, setEditingRealisation] = useState<Realisation | null>(null);

  const fields = [
    { name: "title", label: "Titre", type: FieldType.Text },
    { name: "description", label: "Description", type: FieldType.Textarea },
    { name: "imageUrl", label: "Image", type: FieldType.Image },
  ];

  const columns = [
    { key: "title" as const, label: "Titre" },
    { key: "description" as const, label: "Description" },
    { key: "createdAt" as const, label: "Créé le" },
    { key: "imageUrl" as const, label: "Image" },
  ];

  useEffect(() => {
    const fetchRealisations = async () => {
      try {
        const response = await fetch("/api/realisations");
        const data = await response.json();
        setRealisations(data);
      } catch (error) {
        console.error("Erreur lors du fetch des réalisations :", error);
      }
    };

    void fetchRealisations();
  }, []);

 const handleSave = async (form: Record<string, string>) => {
  const isEditing = Boolean(editingRealisation);
  const url = isEditing ? `/api/realisations/${editingRealisation!.id}` : "/api/realisations";
  const method = isEditing ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  if (!response.ok) return;

  const realisation = await response.json();

  setRealisations((prev) =>
    isEditing ? prev.map((r) => (r.id === realisation.id ? realisation : r)) : [realisation, ...prev]
  );

  setModalOpen(false);
  setEditingRealisation(null);
};


  const handleDelete = async (realisation: Realisation) => {
    const response = await fetch(`/api/realisations/${realisation.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setRealisations((prev) => prev.filter((r) => r.id !== realisation.id));
    }
  };

  const openCreateModal = () => {
    setEditingRealisation(null);
    setModalOpen(true);
  };

  const openEditModal = (realisation: Realisation) => {
    setEditingRealisation(realisation);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Réalisations</CardTitle>
          <Button className="h-12 w-12 rounded-full font-bold text-xl" onClick={openCreateModal}>+</Button>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={realisations}
            columns={columns}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <ModalForm
        title={editingRealisation ? "Modifier la réalisation" : "Créer une réalisation"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        fields={fields}
        uploadType="realisation"
        initialData={
          editingRealisation
            ? {
                title: editingRealisation.title,
                description: editingRealisation.description,
                image: editingRealisation.imageUrl ?? "",
              } : undefined
        }
      />
    </div>
  );
}
