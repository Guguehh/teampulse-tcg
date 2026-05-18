import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProduct, upsertProduct } from "@/lib/admin/db";

export const Route = createFileRoute("/admin/products/edit/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    return { product };
  },
  component: EditProduct,
  head: () => ({ meta: [{ title: "Edit Product — Admin" }] }),
});

function EditProduct() {
  const navigate = useNavigate();
  const { product } = Route.useLoaderData();

  if (!product) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="font-display text-xl font-bold">Product not found</div>
      </div>
    );
  }

  return (
    <ProductForm
      mode="edit"
      initial={product}
      onCancel={() => navigate({ to: "/admin/products" })}
      onSave={(next) => {
        upsertProduct(next);
        navigate({ to: "/admin/products" });
      }}
    />
  );
}
