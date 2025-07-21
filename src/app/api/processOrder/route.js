import { NextResponse } from "next/server";
import { proccessOrder } from "../../libs/product";

export async function POST(req){
    let body=await req.json()
    let {id,updatedProductJSON,OrderStatus}=body
    let parseddata=JSON.stringify(updatedProductJSON)
    const res=await proccessOrder(id,parseddata,OrderStatus)
    const data= res
    return NextResponse.json({status:200,data})
}