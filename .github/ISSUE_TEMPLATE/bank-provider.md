---
name: Bank provider request
about: Request or offer support for a new bank CSV format
title: "Bank provider: [Bank Name] ([Country])"
labels: bank-provider
assignees: ""
---

**Country**
Which country is this bank based in?

**Bank name**
Full legal name of the bank as it appears on statements.

**Website**
Link to the bank's official website.

**Sample CSV**
Please attach an anonymized sample CSV export from this bank. Replace any personal data (name, address, account number, exact balances) with fictional values. If you're unsure what to anonymize, err on the side of caution and replace all strings.

**Required columns**
List the columns present in the CSV export and describe what each one contains:

| Column name | Description | Example |
| ----------- | ----------- | ------- |
|             |             |         |

**Date format**
What date format does the CSV use? (e.g., DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)

**Currency**
What currency does the CSV report? (e.g., USD, EUR, GBP, BRL)

**Delimiter**
What delimiter does the file use? (comma `,`, semicolon `;`, tab `\t`, or other)

**Special cases**
Does the CSV have any unusual characteristics? For example:

- Multi-row transactions (split across multiple lines)
- Encoding issues (BOM, non-UTF-8)
- Header/footer rows before or after the data
- Amounts in different formats (parentheses for negatives, currency symbols within values)
- Transactions in multiple currencies in the same file

**Documentation links**
If the bank provides documentation about their CSV export format, please include links here.

**Are you willing to implement this provider?**
Let us know if you'd like to contribute the parser yourself. See [CONTRIBUTING.md](../blob/main/CONTRIBUTING.md) for a step-by-step guide.

**Additional context**
Anything else that might help someone implement this provider.
