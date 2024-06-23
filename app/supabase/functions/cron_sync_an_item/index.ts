// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
console.log("Hello from Functions!")

Deno.serve(async (req) => {
  // Create a Supabase client with the Auth context of the logged in user.
  const supabase = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    // { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  // const { res } = await supabase
  // .from('bodhi_text_assets')
  // .insert({ 
  //   id_on_chain: 1000001,
  //   content: "test",
  //   creator: "0x0",
  // })

  // if the index is not the same, update 1 data
  // index_now + 1
  
  // 1. get the index now.
  const { data, _error } = await supabase
    .from('bodhi_indexer')
    .select('index')
    .eq('id', 1)
  
  // await fetch('https://webhook.site/b6badf85-a897-4342-ab5d-a3bb2efb565b?from=indexer', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({"params": data.index}),
  // })

  let index_now = data[0].index;

  // 2. get the index remote.
  await fetch('https://faas.movespace.xyz/api/v1/run?name=Contracts.Bodhi&func_name=get_asset_index', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({"params": []}),
  })
  .then(response => 
      response.json()
  )
  .then(
    async (data) => {
      const index_on_chain = data.result
      // await fetch('https://webhook.site/b6badf85-a897-4342-ab5d-a3bb2efb565b?from=indexer_2', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({"params": data.result}),
      // })

      if (index_on_chain > index_now){
        //3. if the index is not the same, update 10 data

        await fetch('https://faas.movespace.xyz/api/v1/run?name=Contracts.Bodhi&func_name=supabase_get_assets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"params": [index_now, index_now]}),
        })
        .then(response => 
            response.json()
        )
        .then(
          async (data) => {
            let i;
            for(i in data.result){
                
                // await fetch('https://webhook.site/b6badf85-a897-4342-ab5d-a3bb2efb565b?from=cron', {
                //   method: 'POST',
                //   headers: {
                //     'Content-Type': 'application/json',
                //   },
                //   body: JSON.stringify({"params": data.result[i]}),
                // })
                const item = data.result[i];
              const { _error } = await supabase
              .from('bodhi_raw_assets')
              .insert({ 
                id_on_chain: item.id_on_chain,
                creator: item.creator,
                ar_tx_id: item.ar_tx_id,
              })
            }


          //   await fetch('https://webhook.site/b6badf85-a897-4342-ab5d-a3bb2efb565b?from=indexer_8', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({"params": error}),
          // })
        })
        //4. index_now + 1
        index_now += 1;
        const { error } = await supabase
          .from('bodhi_indexer')
          .update({index: index_now})
          .eq('id', 1)

        // await fetch('https://webhook.site/b6badf85-a897-4342-ab5d-a3bb2efb565b?from=indexer_3', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({"params": index_now}),
        // })
      }
      
})
  return new Response(
    JSON.stringify({"hello": "world"}),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
