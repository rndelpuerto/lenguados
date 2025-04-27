#!/usr/bin/env python3
"""
Pre-generation hook to validate package_name against npm naming rules.
Ensures name is well-formed and not reserved.
Exits with status 1 on validation failure.
"""

import re
import sys

# List of Node.js core modules to forbid
CORE_MODULES = {
    "assert","buffer","child_process","cluster","console","constants","crypto",
    "dgram","dns","domain","events","fs","http","https","module","net",
    "os","path","perf_hooks","process","punycode","querystring","readline",
    "stream","string_decoder","timers","tls","tty","url","util","v8","vm","zlib"
}

def is_valid_name(name: str) -> bool:
    """
    Validate name with:
    - lowercase letters, digits and single hyphens
    - cannot start or end with hyphen
    - length 1-214
    - no consecutive hyphens
    """
    if not (1 <= len(name) <= 214):
        return False
    regex = r'^[a-z0-9]+(?:-[a-z0-9]+)*$'
    return re.match(regex, name) is not None

def is_not_reserved(name: str) -> bool:
    """
    Reject core modules and names with reserved prefixes.
    """
    if name in CORE_MODULES:
        return False
    if name.startswith("node-") or name.startswith("npm-"):
        return False
    # Prevent names ending in a version-like suffix
    if re.search(r'-\d+\.\d+\.\d+$', name):
        return False
    return True

def pre_gen_project():
    pkg = '{{ cookiecutter.package_name }}'
    desc = '{{ cookiecutter.package_description }}'

    # Validate package_name
    if not is_valid_name(pkg):
        print(f"ERROR: '{pkg}' is not a valid npm package name.")
        print("It must be 1–214 chars, lowercase, digits or hyphens,")
        print("no leading/trailing hyphens, and no consecutive hyphens.")
        sys.exit(1)

    if not is_not_reserved(pkg):
        print(f"ERROR: '{pkg}' is reserved or forbidden (core module or reserved prefix).")
        sys.exit(1)

    # Validate description length
    if len(desc.strip()) < 10:
        print("ERROR: The description must be at least 10 characters long.")
        sys.exit(1)

if __name__ == '__main__':
    pre_gen_project()
