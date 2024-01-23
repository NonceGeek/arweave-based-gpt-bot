import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0'

console.log("Hello from Arweave Handler!");
const key = Deno.env.get('API_KEY');


async function verifyApiKey(context, next) {
    
    const authHeader = context.request.headers.get("authorization");
    console.log(authHeader);
    if (!authHeader) {
      context.response.status = 401;
      context.response.body = { error: "Unauthorized: No Authorization header" };
      return;
    }
  
    const token = authHeader.replace(/^Bearer\s/, "");
    if (token !== key) {
      context.response.status = 403;
      context.response.body = { error: "Forbidden: Invalid API Key" };
      return;
    }
  
    await next();
  }

  
async function streamToString(stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let result = '';
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }
  
    // Decode the final block
    result += decoder.decode();
    console.log(result);
    return result;
  }


const router = new Router();

router
  .post("/", async (context) => {
    const content = await context.request.body().value;
    const tx_id = content.tx_id;
    const response = await fetch('https://arseed.web3infra.dev/' + tx_id, {
        method: 'GET',
    })
    
    const responseText = await streamToString(response.body);
    context.response.body = {content: responseText};
  })
  .get("/policy", async (context) => {
    context.response.body = "# Privacy Policy for ChatGPT Bot with Arweave Query Functionality\n\n1. Introduction:\nThis Privacy Policy applies to the ChatGPT Bot integrated with Arweave Query functionality, hereafter referred to as 'the Bot'. The Bot is designed to provide users with the ability to query public data stored on the Arweave network.\n\n2. Data Collection:\nThe Bot collects data in two primary ways:\n- User-Provided Data: Information that users input directly, including queries and any personal data shared during interaction.\n- Automated Data Collection: Data collected automatically, such as user interaction patterns and usage statistics.\n\n3. Use of Data:\nCollected data is used for:\n- Responding to user queries.\n- Improving the Bot's functionality and user experience.\n- Research and development purposes.\n\n4. Data Sharing and Disclosure:\nPersonal data is not shared with third parties, except:\n- When required by law.\n- For safeguarding the rights and safety of individuals.\n- In an anonymized or aggregated format for research.\n\n5. Data Security:\nWe implement security measures to protect against unauthorized data access or breaches. However, absolute security cannot be guaranteed.\n\n6. User Rights:\nUsers have the right to:\n- Access personal data held by the Bot.\n- Request correction of incorrect data.\n- Request deletion of their data under certain conditions.\n\n7. Changes to This Policy:\nWe reserve the right to modify this policy. Changes will be communicated through the Bot's platform.\n\n8. Contact Information:\nFor queries regarding this policy, please contact [insert contact details].\n\n\n";
  })
  .post("/upload", async (context) => {
    const content = await context.request.body().value;

  })


const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(verifyApiKey);

console.info("CORS-enabled web server listening on port 8000");

await app.listen({ port: 8000 });