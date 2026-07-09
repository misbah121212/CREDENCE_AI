"""Replaces superscript 1 character (¹) with Indian Rupee symbol (₹) across the codebase."""
import os

FILES_TO_CHECK = [
    r"frontend\src\pages\CustomerList.tsx",
    r"frontend\src\pages\CustomerProfile.tsx",
    r"frontend\src\pages\Dashboard.tsx",
    r"frontend\src\pages\LoanManagement.tsx",
    r"frontend\src\pages\RiskAnalytics.tsx",
]

def replace_symbol(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace all superscript 1 characters with rupee symbol
    new_content = content.replace('¹', '₹')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Replaced symbol in {filepath}")
    else:
        print(f"No superscript symbol found in {filepath}")

if __name__ == "__main__":
    base = os.path.dirname(os.path.abspath(__file__))
    root = os.path.join(base, "..", "..")  # project root
    root = os.path.normpath(root)
    
    for f in FILES_TO_CHECK:
        full_path = os.path.join(root, f)
        replace_symbol(full_path)
    print("Replacement finished.")
