import re
text = open(".env").read()
text = re.sub(r'GOOGLE_APPLICATION_CREDENTIALS_JSON=\'.*?\'', '', text, flags=re.DOTALL)
text = text.replace('AFLEWO_SUPABASE_ACCESS_TOKEN=', 'SUPABASE_ACCESS_TOKEN=')
open(".env", "w").write(text)
