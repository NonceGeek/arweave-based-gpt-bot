// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// export to deno.
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts'
import 'https://deno.land/x/xhr@0.2.1/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

console.log("Hello from Embedding!")

Deno.serve(async (req) => {
  const content = await req.json();
  const txt = content.text;
  const supabase = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    // { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  // 1. create a item in bodhi_user_search.
  const {data, error} = await supabase.
  from('bodhi_user_search')
  .insert({search_data: txt})
  .select()

  const the_id = data[0].id;
  console.log(the_id);

  await fetch('https://faas.movespace.xyz/api/v1/run?name=VectorAPI&func_name=get_embedding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({"params": [Deno.env.get('MOVESPACE_API_KEY'), txt]}),
      })
      .then(response => 
        response.json()
      )
      .then(async result => {
        console.log("calling faas result:" + result);
      const embedding = JSON.parse(result.result.data.vector);
      // In production we should handle possible errors
      // const { data: resp } = 
      await supabase.rpc('match_full_dataset', {
        query_embedding: embedding,
        match_threshold: 0.78, // Choose an appropriate threshold for your data
        match_count: 5, // Choose the number of matches
      })
      .then(async (resp: any) =>{
        await supabase
        .from('bodhi_user_search')
        .update({
          embedding: embedding,
          resp: resp
        })
        .eq('id', the_id)
        .then(result => {
          console.log("update result: "+ JSON.stringify(result));
        })

      })
    })

  return new Response(
    JSON.stringify({"item_id": the_id}),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
