import re
import json
import pandas as pd
import os
from collections import OrderedDict

def extract_translations(file_path):
    translations = OrderedDict()
    current_key = None

    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('//') or line.startswith('export') or line in ('{', '}'):
                continue

            # 情况1： key: "value",
            match = re.match(r'"?([a-zA-Z0-9_.-]+)"?\s*:\s*"([^"]*)"\s*,?', line)
            if match:
                key, value = match.groups()
                translations[key] = value
                current_key = None
                continue

            # 情况2：key 在当前行，value 在下一行
            key_only_match = re.match(r'"?([a-zA-Z0-9_.-]+)"?\s*:\s*$', line)
            if key_only_match:
                current_key = key_only_match.group(1)
                continue

            # 情况3：当前是上一行 key 的 value
            if current_key:
                value_match = re.match(r'"([^"]*)"\s*,?', line)
                if value_match:
                    translations[current_key] = value_match.group(1)
                    current_key = None

    return translations

# 读取每个语言文件
en = extract_translations('../src/lang/en.ts')
zh = extract_translations('../src/lang/zh.ts')
pt = extract_translations('../src/lang/portugal.ts')

# 所有 key 的合集
all_keys = set(en) | set(zh) | set(pt)

# 合并为表格数据
rows = []
for key in zh.keys():
    row = {
        'key': key,
        'desc': zh.get(key, ''),
        'zh': zh.get(key, ''),
        'en': en.get(key, ''),
        'pt': pt.get(key, ''),
    }
    rows.append(row)

df = pd.DataFrame(rows)
df.to_excel('merged_translations.xlsx', index=False)

print("✅ Excel 文件已生成：merged_translations.xlsx")
