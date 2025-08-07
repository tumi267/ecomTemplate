import { NextResponse } from "next/server";
import {  getOrdersbetween } from "../../../libs/product";

// Flatten orders and productJSON into individual sale line items
function flattenOrdersToCSVRows(orders) {
  const rows=[];

  for (const order of orders) {
    const productItems = JSON.parse(order.productJSON || "[]");

    for (const item of productItems) {
      const product = item.product || {};
      const options = item.options || {};

      rows.push({
        orderId: order.id,
        orderDate: new Date(order.createdAt).toISOString(),
        customerName: order.customerName || "",
        customerEmail: order.customerEmail || "",
        productName: product.name || "",
        variantSize: options.size || "",
        variantColor: options.color || "",
        quantity: item.quantity || 0,
        unitPrice: item.price || 0,
        totalPrice: (item.quantity || 0) * (item.price || 0),
        paymentStatus: order.paymentStatus || "",
        status: order.status || "",
      });
    }
  }

  return rows;
}

// Convert JSON rows to CSV string
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

export async function GET(req) {
    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from"); // expected format: '2024-01-01'
    const to = searchParams.get("to");  
  try {
    const orders = await getOrdersbetween(from,to); // Load all orders from DB
    const csvRows = flattenOrdersToCSVRows(orders);
    const csv = convertToCSV(csvRows);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=sales_export.csv",
      },
    });
  } catch (error) {
    console.error("CSV export failed:", error);
    return NextResponse.json({ error: "Failed to export sales" }, { status: 500 });
  }
}
