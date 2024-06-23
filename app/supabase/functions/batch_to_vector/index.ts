// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
console.log("Hello from batch_to_new_column!")

Deno.serve(async (req) => {
  const { name } = await req.json()
  const supabase = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    // { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  const { data, error } = await supabase
  .from('bodhi_text_assets_k_v')
  .select()
  .is('uuid', null);
  // console.log(data);

  let idx;
  for(idx in data){
    let raw_data = data[idx].data;
    if (raw_data.length <=1000){
      let metadata = data[idx].metadata;
      // call faas to insert data
      await fetch('https://faas.movespace.xyz/api/v1/run?name=VectorAPI&func_name=insert_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // TODO: fetch pwd from env
        body: JSON.stringify({"params": [Deno.env.get('MOVESPACE_API_KEY'), "bodhi-text-contents", raw_data, metadata]}),
        // body: JSON.stringify({"params": ["qwerty", "bodhi-text-contents", raw_data, metadata]}),

      })
      .then(response => 
        response.json()
      )
      .then(async result => {
          let uuid = result.result.payload.id;
          let embedding = result.result.payload.embedding;
          const { error } = await supabase
          .from('bodhi_text_assets_k_v')
          .update({ uuid: uuid, embedding: embedding, if_vectored: true})
          .eq('id', data[idx].id);
          console.log(error);
      })
    }
  }

  return new Response(
    JSON.stringify({"hello": "worldd"}),
    { headers: { "Content-Type": "application/json" } },
  )


})

// To invoke:
// curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
