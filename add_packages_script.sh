#!/bin/bash

# The source file path and the target directory
SOURCE_FILE_PATH="$1"
TARGET_DIR=~/development/react-tools

if [ -z "$SOURCE_FILE_PATH" ]; then
  echo "No file path provided."
  exit 1
fi

if [ ! -f "$SOURCE_FILE_PATH" ]; then
  echo "Source file not found."
  exit 1
fi

# Extract the imported package names from the source file
IMPORTED_PACKAGES=$(grep -oP "from '\\K[^']+" "$SOURCE_FILE_PATH" | grep -v '\./')

# Change to the target directory
cd "$TARGET_DIR" || {
  echo "Failed to change directory."
  exit 1
}

# Add the imported packages to package.json
for package in $IMPORTED_PACKAGES; do
  echo "Adding $package to package.json..."
  jq ".dependencies[\"$package\"] = \"*\"" package.json > package.tmp.json && mv package.tmp.json package.json
done

echo "All packages added successfully."
