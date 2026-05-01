const supabaseUrl = 'https://jgcibolwmwotsymhgtjr.supabase.co';
const supabaseKey = 'sb_publishable_K_DnINBvp73Wf4XrvbTbtw_49N2e20u';

const client = window.supabase.createClient(supabaseUrl, supabaseKey);

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function loadDetail() {
  const container = document.getElementById("detail");

  const { data, error } = await client
    .from('species')
    .select(`
      name_zh,
      name_latin,
      species_compounds (
        compound_name,
        bioactivity
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    container.innerHTML = "加载失败";
    return;
  }

  const compounds = data.species_compounds
    ?.map(c => `<li>${c.compound_name}（${c.bioactivity}）</li>`)
    .join('') || '暂无';

  container.innerHTML = `
    <h2>${data.name_zh}</h2>
    <p>${data.name_latin}</p>
    <h3>成分</h3>
    <ul>${compounds}</ul>
  `;
}

loadDetail();
