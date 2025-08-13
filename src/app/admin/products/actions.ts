"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  CreateProductSchema,
  UpdateProductSchema,
  CreateVariantSchema,
  UpdateVariantSchema,
} from "@/lib/validation/product";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export async function createProduct(prevState: any, formData: FormData) {
  const parsed = CreateProductSchema.pick({ slug: true, title: true }).safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed.",
    };
  }

  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    return { message: "Failed to create product." };
  }

  revalidatePath("/admin/products");
  return { message: "Product created successfully." };
}

export async function updateProduct(id: string, prevState: any, formData: FormData) {
  const parsed = UpdateProductSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    description: formData.get("description"),
    seoTitle: formData.get("seoTitle"),
    seoDesc: formData.get("seoDesc"),
    // Transform comma-separated tags into array if provided
    tags:
      (formData.get("tags") as string | null)
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? undefined,
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed.",
    };
  }

  await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  revalidatePath(`/admin/products/${id}`);
  return { message: "Product updated successfully." };
}

export async function deleteProduct(id: string) {
  await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE" });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function createVariant(
  productId: string,
  prevState: any,
  formData: FormData,
) {
  const parsed = CreateVariantSchema.safeParse({
    sku: formData.get("sku"),
    optionSize: formData.get("optionSize"),
    optionColor: formData.get("optionColor"),
    price: formData.get("price"),
    compareAt: formData.get("compareAt"),
    salePrice: formData.get("salePrice"),
    saleStart: formData.get("saleStart"),
    saleEnd: formData.get("saleEnd"),
    stock: formData.get("stock"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed.",
    };
  }

  const res = await fetch(`${BASE_URL}/api/products/${productId}/variants`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    return { message: "Failed to create variant." };
  }

  revalidatePath(`/admin/products/${productId}`);
  return { message: "Variant created successfully." };
}

export async function updateVariant(
  productId: string,
  variantId: string,
  prevState: any,
  formData: FormData,
) {
  const parsed = UpdateVariantSchema.safeParse({
    sku: formData.get("sku"),
    optionSize: formData.get("optionSize"),
    optionColor: formData.get("optionColor"),
    price: formData.get("price"),
    compareAt: formData.get("compareAt"),
    salePrice: formData.get("salePrice"),
    saleStart: formData.get("saleStart"),
    saleEnd: formData.get("saleEnd"),
    stock: formData.get("stock"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed.",
      success: false,
    };
  }

  const res = await fetch(`${BASE_URL}/api/variants/${variantId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    return { message: "Failed to update variant.", success: false };
  }

  revalidatePath(`/admin/products/${productId}`);
  return { message: "Variant updated successfully.", success: true };
}

export async function deleteVariant(productId: string, variantId: string) {
  await fetch(`${BASE_URL}/api/variants/${variantId}`, { method: "DELETE" });
  revalidatePath(`/admin/products/${productId}`);
}

export async function updateMedia(
  productId: string,
  mediaId: string,
  isPrimary: boolean,
) {
  await fetch(`${BASE_URL}/api/media/${mediaId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ isPrimary }),
  });
  revalidatePath(`/admin/products/${productId}`);
}

export async function deleteMedia(productId: string, mediaId: string) {
  await fetch(`${BASE_URL}/api/media/${mediaId}`, { method: "DELETE" });
  revalidatePath(`/admin/products/${productId}`);
}
