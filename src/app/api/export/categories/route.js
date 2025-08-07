import { NextResponse } from "next/server";
import { getCategory } from "../../../libs/category";

// Helper: Convert JSON to CSV
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
    const categories = await getCategory();

    // Transform category data for CSV
    const simplified = categories.map((category) => ({
      id: category.id,
      name: category.name || "",
      description: category.description || "",
      imagePath: category.imagePath || "",
      totalProducts: category.products?.length || 0,
    }));

    const csv = convertToCSV(simplified);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=categories_export.csv",
      },
    });
  } catch (error) {
    console.error("Failed to export categories:", error);
    return NextResponse.json({ error: "Failed to export categories" }, { status: 500 });
  }
}
