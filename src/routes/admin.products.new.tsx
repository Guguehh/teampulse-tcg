import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";
import { upsertProduct } from "@/lib/admin/db";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProduct,
  head: () => ({ meta: [{ title: "New Product — Admin" }] }),
});

function NewProduct() {
  const navigate = useNavigate();
  return (
    <ProductForm
      mode="new"
      onCancel={() => navigate({ to: "/admin/products" })}
      onSave={(next) => {
        upsertProduct(next);
        navigate({ to: "/admin/products" });
      }}
    />
  );
}
