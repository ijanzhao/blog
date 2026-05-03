import requests
import matplotlib.pyplot as plt

URL = "https://你的项目ID.supabase.co/rest/v1/metabolites"
KEY = "你的anon key"

headers = {
    "apikey": KEY,
    "Authorization": f"Bearer {KEY}"
}

data = requests.get(URL, headers=headers).json()

# 统计类型
counts = {}
for m in data:
    t = m.get("type")
    if t:
        counts[t] = counts.get(t, 0) + 1

# 绘图
plt.figure()
plt.bar(counts.keys(), counts.values())
plt.title("Metabolite Type Distribution")
plt.xticks(rotation=30)
plt.savefig("metabolite_distribution.png")
plt.show()
