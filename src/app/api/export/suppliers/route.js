import { NextResponse } from "next/server";
import { getSuppliers } from "../../../libs/suppliers"; // You should have this helper function

// CSV Helper
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
    const suppliers = await getSuppliers(); // Fetch all suppliers

    // Format supplier data for CSV
    const simplified = suppliers.map((supplier) => ({
      id: supplier.id,
      name: supplier.name,
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
      notes: supplier.notes || "",
      totalProducts: supplier.products?.length || 0,
      createdAt: supplier.createdAt.toISOString(),
      updatedAt: supplier.updatedAt.toISOString(),
    }));

    const csv = convertToCSV(simplified);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=suppliers_export.csv",
      },
    });
  } catch (error) {
    console.error("Failed to export suppliers:", error);
    return NextResponse.json({ error: "Failed to export suppliers" }, { status: 500 });
  }
}
