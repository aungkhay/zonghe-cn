import pandas as pd

def save_ts_file(file_path, translations_dict):
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write("export default {\n")
        for key, value in translations_dict.items():
            escaped_value = value.replace('"', r'\"')  # 转义双引号
            f.write(f'  "{key}": "{escaped_value}",\n')
        f.write("}\n")

# 读取 Excel 表格
df = pd.read_excel('strings.xlsx')

# 按照 key 顺序构建语言包
en_dict = {}
zh_dict = {}
pt_dict = {}

for _, row in df.iterrows():
    key = str(row['key'])
    en_dict[key] = str(row.get('en', '') or '')
    zh_dict[key] = str(row.get('zh', '') or '')
    pt_dict[key] = str(row.get('pt', '') or '')

# 保存到 ts 文件
save_ts_file('../src/lang/en.ts', en_dict)
save_ts_file('../src/lang/zh.ts', zh_dict)
save_ts_file('../src/lang/portugal.ts', pt_dict)

print("✅ 语言包已导出为 en_export.ts、zh_export.ts 和 portugal_export.ts")
