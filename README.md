# jira-issue-generator

Generate CSV files for importing issues into Jira from markdown files.

## Usage

1. Create a [Markdown](https://daringfireball.net/projects/markdown/) file.
1. Specify your Jira issues within it using Markdown syntax

    - Level-1 headings (`# like this`) will create a new issue
    - Add a table underneath to add metadata about the issue

        ```md
        | Key      | Value |
        | -------- | ----- |
        | Type     | story |
        | Priority | 4     |
        ```

        - The table **must** start with the header row "`|Key|Value|`"
        - Check [the types](./src/types.ts) for supported metadata

    - Add your (simple) Markdown-formatted description

1. Run `tsx src/index.ts YOUR_MARKDOWN_FILE.md` to generate your CSV & JSON files for importing in to Jira.
1. Open the Jira importer

    1. Go to Jira
    1. Select "Filters" in the top nav bar
    1. Click "View all issues"
    1. Click the overflow ("•••") in the top right
    1. Click "Import issues from CSV"

    or

    https://paciolan.atlassian.net/secure/BulkCreateSetupPage!default.jspa?externalSystem=com.atlassian.jira.plugins.jim-plugin%3AbulkCreateCsv&new=true

1. Add the generated CSV to "CSV Source File"
1. Check "Use an existing configuration file"
1. Select the generate JSON configuration
1. Hit "Next" until you're done!
