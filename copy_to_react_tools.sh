#!/bin/bash

# The source file path and the target directory
SOURCE_FILE_PATH="$1"
TARGET_DIR=~/development/react-tools/src

if [ -z "$SOURCE_FILE_PATH" ]; then
  echo "No file path provided."
  exit 1
fi

if [ ! -f "$SOURCE_FILE_PATH" ]; then
  echo "Source file not found."
  exit 1
fi

# Extract the filename without extension and the file extension
FILENAME_WITH_EXT=$(basename "$SOURCE_FILE_PATH")
FILENAME_NO_EXT="${FILENAME_WITH_EXT%.*}"
FILE_EXT="${FILENAME_WITH_EXT##*.}"

# Define the source and target paths for the test file
SOURCE_TEST_FILE_PATH="${SOURCE_FILE_PATH%.*}.test.${FILE_EXT}"
TARGET_TEST_FILE_PATH="$TARGET_DIR/${FILENAME_NO_EXT}.test.${FILE_EXT}"

# Copy the main file to the target directory
cp "$SOURCE_FILE_PATH" "$TARGET_DIR/$FILENAME_WITH_EXT" || {
  echo "Failed to copy the main file."
  exit 1
}

# Copy the test file to the target directory if it exists
if [ -f "$SOURCE_TEST_FILE_PATH" ]; then
  cp "$SOURCE_TEST_FILE_PATH" "$TARGET_TEST_FILE_PATH" || {
    echo "Failed to copy the test file."
    exit 1
  }
fi

python3 /home/laughingwhales/development/react-tools/update_package_json.py "$TARGET_DIR/$FILENAME_WITH_EXT" "$TARGET_TEST_FILE_PATH"


# Change to the target directory
cd ~/development/react-tools || {
  echo "Failed to change directory."
  exit 1
}

# Check if the current branch is clean
if ! git diff-index --quiet HEAD --; then
  echo "The current branch has uncommitted changes. Please commit or stash them before running this script."
  exit 1
fi

# Create and switch to a new branch named after the file without the file extension
git checkout -b "$FILENAME_NO_EXT" || {
  echo "Failed to create and switch to a new branch."
  exit 1
}

# Add and commit the main file
git add "src/$FILENAME_WITH_EXT" || {
  echo "Failed to add the main file to git."
  exit 1
}
git commit -m "Add $FILENAME_WITH_EXT" || {
  echo "Failed to commit the main file."
  exit 1
}

# Add and commit the test file if it was copied
if [ -f "$TARGET_TEST_FILE_PATH" ]; then
  git add "$TARGET_TEST_FILE_PATH" || {
    echo "Failed to add the test file to git."
    exit 1
  }
  git commit -m "Add test for $FILENAME_WITH_EXT" || {
    echo "Failed to commit the test file."
    exit 1
  }
fi

# Push the branch to the remote repository
git push --set-upstream origin "$FILENAME_NO_EXT" || {
  echo "Failed to push the branch to the remote repository."
  exit 1
}
