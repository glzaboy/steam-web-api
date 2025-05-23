//import { getCloudflareContext } from "@opennextjs/cloudflare";

import { getDb } from "../lib/db"
import * as schema from "@/db/schema";
export async function GET() {
  // In the edge runtime you can use Bindings that are available in your application
  // (for more details see:
  //    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
  //    - https://developers.cloudflare.com/pages/functions/bindings/
  // )
  //
  // KV Example:
  // const myKv = getRequestContext().env.MY_KV_NAMESPACE
  // await myKv.put('suffix', ' from a KV store!')
  // const suffix = await myKv.get('suffix')
  // return new Response(responseText + suffix)
  //getCloudflareContext().env.api;
  const db = getDb();

  const allProduct = await db.select().from(schema.allProduct);
  //const result = JSON.stringify(allProduct)
  return Response.json({ code: 200, data: { allProducts: allProduct } });
}
