import { NextResponse } from "next/server";
import { getSingleOrder } from "../../libs/product";

export async function POST(req){
    let body=await req.json()
    const res=await getSingleOrder(body)
    const data=await res
    return NextResponse.json({status:200,data})
}