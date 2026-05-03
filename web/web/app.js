const supabaseUrl = 'https://jgcibolwmwotsymhgtjr.supabase.co';
const supabaseKey = 'sb_publishable_K_DnINBvp73Wf4XrvbTbtw_49N2e20u';

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2lib2x3bXdvdHN5bWhndGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNjQxNzMsImV4cCI6MjA5MjY0MDE3M30.-PLwiIxO2_Cq0LjoRmn50_P6Ro-iMk4RqE31Zx0I_CI

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function search(){
  const { data } = await supabase.from("species").select("*");

  document.getElementById("result").innerHTML =
    JSON.stringify(data,null,2);
}

async function stats(){
  const { data } = await supabase.from("metabolites").select("type");

  let count = {};
  data.forEach(d=>{
    if(d.type){
      count[d.type]=(count[d.type]||0)+1;
    }
  });

  document.getElementById("result").innerHTML =
    JSON.stringify(count,null,2);
}
