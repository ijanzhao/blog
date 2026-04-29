<input id="name" placeholder="输入药材">
<button onclick="analyze()">AI分析</button>
<pre id="result"></pre>

<script>
async function analyze(){
  const name=document.getElementById("name").value;

  document.getElementById("result").innerText=
  "正在分析："+name+"（这里可接OpenAI API）";
}
</script>
