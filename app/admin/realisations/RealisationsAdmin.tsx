"use client";

import { useEffect, useState } from "react";
import { Realisation } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { GenericTable } from "@/components/common/genericTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModalForm } from "@/components/common/modalForm";
import { FieldType } from "@/types/formTypes";


//TODO: oublie pas de te servir des params que t'as mis dans ton schema pour le SEO bg, tu verras c'est simple. 
// toutes tes entités ont a peut pres les mêmes champs, donc tu peux faire un truc générique pour le SEO,


type RealisationWithPrestation = Realisation & {
  prestation?: {
    id: string;
    categorie: string;
  };
};
type RealisationWithFormatted = RealisationWithPrestation & { createdAtFormatted: string, prestationFormatted: string };

export default function RealisationsAdmin() {
  const [realisations, setRealisations] = useState<RealisationWithFormatted[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRealisation, setEditingRealisation] = useState<RealisationWithPrestation | null>(null);
  const [prestations, setPrestations] = useState<{ id: string; categorie: string }[]>([]);

  const fields = [
    { name: "title", label: "Titre", type: FieldType.Text },
    { name: "description", label: "Description", type: FieldType.Textarea },
    { name: "imageUrl", label: "Image", type: FieldType.Image },
    { name: "localisation", label: "Localisation", type: FieldType.Text },
    prestations.length > 0
      ? {
        name: "prestation",
        label: "Prestation",
        type: FieldType.Select,
        options: prestations.map((p) => ({ label: p.categorie, value: p.categorie })),
      } : {
        name: "prestation",
        label: "Prestation (chargement... ou texte libre)",
        type: FieldType.Text,
      },
    { name: "seoTitle", label: "Titre SEO", type: FieldType.Text },
    { name: "seoDescription", label: "Description SEO", type: FieldType.Textarea },
    { name: "seoKeywords", label: "Mots-clés SEO (séparés par des virgules)", type: FieldType.Textarea },
  ];

  const columns = [
    { key: "title" as const, label: "Titre" },
    { key: "description" as const, label: "Description" },
    { key: "localisation" as const, label: "Localisation" },
    { key: "prestationFormatted" as const, label: "Prestation" },
    { key: "seoTitle" as const, label: "Titre SEO" },
    { key: "seoKeywords" as const, label: "Mots-clés SEO" },
    { key: "createdAtFormatted" as const, label: "Créé le" },
  ];

  useEffect(() => {
    const fetchPrestations = async () => {
      const response = await fetch("/api/prestations");
      const data = await response.json();
      setPrestations(data);
    };

    fetchPrestations();
  }, []);

  useEffect(() => {
    const fetchRealisations = async () => {
      try {
        const response = await fetch("/api/realisations");
        const data = await response.json();
        const formattedRealisation = data.map((realisations: RealisationWithPrestation) => ({
          ...realisations,
          createdAtFormatted: new Date(realisations.createdAt).toLocaleDateString("fr-FR"),
          prestationFormatted: realisations.prestation?.categorie.toString() ?? "",
        }));

        setRealisations(formattedRealisation);
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

    const preparedForm = {
      ...form,
      seoKeywords: Array.isArray(form.seoKeywords) ? form.seoKeywords :
        typeof form.seoKeywords === "string" ? form.seoKeywords.split(",").map((kw) => kw.trim()) :
          [],
    };

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preparedForm),
    });

    if (!response.ok) return;

    const realisation = await response.json();

    setRealisations((prev) =>
      isEditing
        ? prev.map((r) => (r.id === realisation.id ? realisation : r))
        : [realisation, ...prev]
    );

    setModalOpen(false);
    setEditingRealisation(null);
  };

  const handleDelete = async (realisation: RealisationWithPrestation) => {
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

  const openEditModal = (realisation: RealisationWithPrestation) => {
    setEditingRealisation(realisation);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Réalisations</CardTitle>
          <Button className="h-12 w-12 rounded-full font-bold text-xl" onClick={openCreateModal}>
            +
          </Button>
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
        onClose={() => {
          setModalOpen(false)
        }}
        onSave={handleSave}
        fields={fields}
        uploadType="realisation"
        initialData={
          editingRealisation
            ? {
              title: editingRealisation.title,
              description: editingRealisation.description,
              imageUrl: editingRealisation.imageUrl ?? "",
              localisation: editingRealisation.localisation ?? "",
              prestation: editingRealisation.prestation?.categorie ?? "",
              seoTitle: editingRealisation.seoTitle,
              seoDescription: editingRealisation.seoDescription,
              seoKeywords: editingRealisation.seoKeywords?.join(", ") ?? "",
            }
            : undefined
        }
      />
    </div>
  );
}
