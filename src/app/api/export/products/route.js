import { NextResponse } from "next/server";
import { getProducts } from "../../../libs/product";

// Helper to convert products into CSV
function convertToCSV(data) {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvRows = data.map(row =>
    headers.map(field => {
      const value = row[field] ?? "";
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(",")
  );

  return [headers.join(","), ...csvRows].join("\n");
}

export async function GET() {
  try {
    const products = await getProducts();

    // Optional: transform data here if needed
    const simplified = products.map((product) => ({
      id: product.id,
      sku: product.sku || "",
      name: product.name,
      description: product.description,
      category: product.category?.name || "",
      price: product.price,
      cost: product.cost,
      qty: product.qty,
      discount: product.discount,
      bestSeller: product.bestSeller,
      weekSale: product.weekSale,
      availableToPublic: product.availableToPublic,
      currency: product.currency,
      isAvailableForPurchase: product.isAvailableForPurchase,
      unitsSold: product.unitsSold,
      imagePath: product.imagePath,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    const csv = convertToCSV(simplified);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=products_export.csv",
      },
    });
  } catch (error) {
    console.error("Failed to export products:", error);
    return NextResponse.json({ error: "Failed to export products" }, { status: 500 });
  }
}
