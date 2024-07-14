# jira-issue-generator

Generate CSV files for importing issues into Jira from markdown files.

## Usage

1. Create a [Markdown](https://daringfireball.net/projects/markdown/) file.
1. Create a YAML frontmatter section to specify global metadata

    1. At the top of the file, add a snipped of YAML surrounded by horizontal rules.

        ```md
        ---
        parent: 'PAC-21694'
        ---

        # Your 1st issue
        ```

        Check out [the `Frontmatter` type](./src/types.ts) for a list of expected keys.

1. Specify your Jira issues within it using Markdown syntax

    - A leading level-1 heading (`# like this`) specifies the issue summary
    - Optionally add a table underneath to add metadata about the issue

        ```md
        | Key      | Value |
        | -------- | ----- |
        | Type     | story |
        | Priority | 4     |
        ```

        - The table **must** start with the header row "`|Key|Value|`"
        - Check [the `IssueMetadata` type](./src/types.ts) for supported metadata

    - Add your (simple) Markdown-formatted description
    - To create a 2nd issue, separate it from your 1st issue with a horizontal rule (eg: `---`)

    > [!TIP]
    > Check out the [sample issue file below](#sample-issue-file) for a full example.

1. Run `npx jira-issue-generator YOUR_MARKDOWN_FILE.md` to generate your CSV & JSON files for importing in to Jira.
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

## Sample issue file

```yaml
---
parent: 'PAC-21694'
project-name: 'Integrations'
project-key: 'INT'
dev-team-name: 'Integrations'
dev-team-field-id: 10055
---

# Hello world

| Key      | Value |
| -------- | ----- |
| Type     | story |
| Priority | 3     |

Some simple **markdown** to describe the issue.

---

# A 2nd issue

| Key      | Value |
| -------- | ----- |
| Type     | bug   |
| Priority | 1     |

Write a nice descriptive body
```
