import sys
import os
import json

main_file_path = sys.argv[1]

# If the second argument (test file path) is provided and the file exists, add it to the list of files to process
if len(sys.argv) > 2 and os.path.isfile(sys.argv[2]):
    test_file_path = sys.argv[2]
else:
    test_file_path = None


def extract_imported_packages(file_path):
    with open(file_path) as file:
        content = file.read()

    # Extract the imported package names from the source file
    imported_packages = set()
    for line in content.splitlines():
        if "from" in line:
            try:
                package_name = line.split("from")[1].strip().strip("'").strip('"').split()[0]
                if not package_name.startswith('.'):
                    imported_packages.add(package_name)
            except IndexError:
                pass

    return imported_packages


def update_package_json(imported_packages, package_json_path):
    with open(package_json_path) as file:
        package_json = json.load(file)

    for package in imported_packages:
        package_json["dependencies"][package] = "*"

    with open(package_json_path, "w") as file:
        json.dump(package_json, file, indent=2)


def process_files(file_paths, package_json_path):
    imported_packages = set()
    for file_path in file_paths:
        if os.path.isfile(file_path):
            imported_packages.update(extract_imported_packages(file_path))

    update_package_json(imported_packages, package_json_path)


if test_file_path:
    process_files([main_file_path, test_file_path], "package.json")
else:
    process_files([main_file_path], "package.json")
