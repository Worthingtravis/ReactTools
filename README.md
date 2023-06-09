
# React Tools

This repository serves two purposes:
- set up the copy_to_react_tools.sh script as an external tool in WebStorm or VScode for easy use.
- Access a collection of reusable React components/hooks/HOC's for use in your own projects.
#


https://user-images.githubusercontent.com/11166509/229248974-a0a571cd-80ac-454a-96e5-1b0ced700346.mp4


https://user-images.githubusercontent.com/11166509/229249113-47c3b486-26d2-46d9-b7a3-7de4ae34929d.mp4



---
## Getting Started

### Clone the repository
`git clone https://github.com/worthingtravis/react-tools.git`
### Change into the react-tools directory
`cd react-tools`
### Install dependencies
`npm install`
### Optionally, run tests
`npm test`

#

---

## Usage


### Use in webstorm
Open WebStorm and go to "File" > "Settings".
- In the left sidebar, select `"Tools" > "External Tools"`.
- Click on the `+` icon to add a new tool.
- In the `Name` field, `enter a name for the tool (e.g. "Copy to React Tools")`.
- In the `Program` field, enter the path to the `copy_to_react_tools.sh` script.
- In the `Arguments` field, enter the following:`$FilePath$`
- In the `Working directory` field, enter the path to the `react-tools` directory.
- Click on `OK` to save the tool.

#### Now you can use this tool to quickly copy files to the "react-tools" repository. To use it, right-click on the file you want to copy in the project tree, select "External Tools" > "Copy to React Tools" from the context menu, and the script will be executed.


### Use in vscode
- Open your project in VSCode.
- Open the Command Palette by pressing `Ctrl + Shift + P` on Windows/Linux or `Cmd + Shift + P` on Mac.

- Search for `Tasks: Configure Task` and select it.

- In the task configuration prompt, select `Create tasks.json file from template` and then select` "Others"`.

- This will create a tasks.json file in the .vscode directory.


### Replace the contents of the tasks.json file with the following:

```
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Copy to React Tools",
            "type": "shell",
            "command": "sh ${workspaceFolder}/copy_to_react_tools.sh ${file}",
            "problemMatcher": [],
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}

```

### Save the tasks.json file.
```
Right-click on the file you want to copy in the Explorer pane and select "Run Task" from the context menu.

Select "Copy to React Tools" from the list of tasks.

The script will be executed and the file will be copied to the src directory in the react-tools repo, any imported packages will be added to the package.json file, and the changes will be committed to a new branch.
```

--- 

### Copying files and adding packages

The `copy_to_react_tools.sh` script is used to copy files to the `src` directory in the `react-tools` repo, add any imported packages to the `package.json` file, and commit the changes to a new branch. To use the script, run:

./copy_to_react_tools.sh <source_file_path>


You can also include a test file path:

./copy_to_react_tools.sh <source_file_path> <test_file_path>


### Adding packages only

If you want to add packages to the `package.json` file without copying any files, you can use the `add_packages_script.sh` script:

./add_packages_script.sh <source_file_path>


### Updating package.json only

To update the `package.json` file with any imported packages from a file, use the `update_package_json.py` script:

python3 update_package_json.py <source_file_path>


You can also include a test file path:

python3 update_package_json.py <source_file_path> <test_file_path>


## Contributing

Contributions are welcome! If you find a bug or have a suggestion for a new feature, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
