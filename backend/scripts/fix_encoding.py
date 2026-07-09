"""Fix garbled UTF-8 mojibake characters across all frontend source files."""
import os, re

# All files to fix
FILES = [
    r"frontend\index.html",
    r"frontend\src\components\IntroLoader.tsx",
    r"frontend\src\components\Sidebar.tsx",
    r"frontend\src\components\ThreeDSphere.tsx",
    r"frontend\src\lib\api.ts",
    r"frontend\src\pages\CustomerList.tsx",
    r"frontend\src\pages\CustomerProfile.tsx",
    r"frontend\src\pages\Dashboard.tsx",
    r"frontend\src\pages\DataUpload.tsx",
    r"frontend\src\pages\LoanManagement.tsx",
    r"frontend\src\pages\RiskAnalytics.tsx",
    r"frontend\src\pages\Settings.tsx",
    r"frontend\src\pages\Login.tsx",
    r"frontend\src\pages\Reports.tsx",
    r"frontend\src\components\Header.tsx",
]

# Mojibake -> clean replacement mapping
# These are UTF-8 bytes read as Latin-1 (common double-encoding issue)
REPLACEMENTS = [
    ("\u00e2\u0080\u0094", "--"),       # em dash —
    ("\u00e2\u0080\u0093", "-"),        # en dash –
    ("\u00e2\u0080\u00a6", "..."),      # ellipsis …
    ("\u00e2\u0080\u0099", "'"),        # right single quote '
    ("\u00e2\u0080\u0098", "'"),        # left single quote '
    ("\u00e2\u0080\u009c", '"'),        # left double quote "
    ("\u00e2\u0080\u009d", '"'),        # right double quote "
    ("\u00e2\u0082\u00b9", "\u20b9"),   # rupee sign ₹ (keep as proper unicode)
    ("\u00c2\u00b7", "\u00b7"),         # middle dot · (keep)
    ("\u00c2\u00a0", " "),              # non-breaking space
    ("\u00e2\u0080\u00a2", "-"),        # bullet •
    ("\u00e2\u0094\u0080", "-"),        # box drawing ─
    ("\u00e2\u0080\u00a8", "\n"),       # line separator
    ("\u00e2\u009c\u0093", "OK"),       # check mark ✓
    ("\u00c2\u00ae", "(R)"),            # registered trademark ®
    ("\u00c2\u00a9", "(c)"),            # copyright ©
]

def fix_file(filepath):
    if not os.path.exists(filepath):
        print(f"  SKIP (not found): {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    original = content
    for bad, good in REPLACEMENTS:
        content = content.replace(bad, good)

    # Extra pass: remove any remaining lone \u00e2, \u00c2 artifacts
    # that look like "â€" or "Â" leftover
    content = re.sub(r'â€[^\s\w]?', '', content)
    content = re.sub(r'Â[^\w\s]?', '', content)
    content = re.sub(r'â[^a-zA-Z0-9\s\-\(\)\[\]\{\}\.\,\;\:\!\?\"\'\n]', '', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  FIXED: {filepath}")
    else:
        print(f"  OK (no changes): {filepath}")

if __name__ == "__main__":
    base = os.path.dirname(os.path.abspath(__file__))
    root = os.path.join(base, "..", "..")  # go up to project root
    root = os.path.normpath(root)
    print(f"Project root: {root}")

    for f in FILES:
        full = os.path.join(root, f)
        fix_file(full)

    print("\nDone! All files checked.")
