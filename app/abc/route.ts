//import { getCloudflareContext } from "@opennextjs/cloudflare";
import { readCache } from "../lib/cache";
export async function GET() {
  
  const me = await readCache("me");
  //const db = getDb();

  //const allProduct = await db.select().from(schema.allProduct);
  //const result = JSON.stringify(allProduct)
  return Response.json({ code: 200, data: {}, message: "success", me: me });

}
