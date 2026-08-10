import sys

with open(r'd:\Antigravity\AI_Sandbox\api\_handlers\toeic\questions.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Normalize all weird variations to a clean one
text = text.replace("our team\\\\\\'s ability", "our team\\'s ability")
text = text.replace("our team\\\\'s ability", "our team\\'s ability")
text = text.replace("our team\\'s ability", "our team\\'s ability")
text = text.replace("our team's ability", "our team\\'s ability")

with open(r'd:\Antigravity\AI_Sandbox\api\_handlers\toeic\questions.js', 'w', encoding='utf-8', newline='') as f:
    f.write(text)

print("Done")
