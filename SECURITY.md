# Security Policy

Open Money Tracker processes financial data locally in your browser. While no data is transmitted to any server, we take security seriously. This document outlines our approach to security and how to report vulnerabilities.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest stable release | ✅ |
| Previous stable release | ⚠️ Critical fixes only |
| Development builds   | ❌ |

We recommend always running the latest release. The application is distributed as a static site — updates are delivered when you refresh the page after a new deployment.

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately — do not file a public issue.

**How to report:**

1. Open a **private security advisory** on GitHub:
   - Go to https://github.com/your-username/open-money-tracker/security/advisories
   - Click "New draft security advisory"
   - Fill in the details

2. If you cannot use GitHub advisories, email [INSERT EMAIL ADDRESS] with:
   - **Subject:** "Security vulnerability in Open Money Tracker"
   - **Description:** A clear description of the issue
   - **Steps to reproduce:** Detailed steps to reproduce the vulnerability
   - **Impact:** What an attacker could achieve
   - **Suggested fix:** (optional) A proposed patch or mitigation

## Responsible Disclosure

We ask that you:

- **Do not** disclose the vulnerability publicly until we have had a reasonable opportunity to address it.
- **Do not** exploit the vulnerability beyond what is necessary to demonstrate it.
- **Do not** access, modify, or exfiltrate data that is not your own.

In return, we will:

- Acknowledge receipt of your report within **72 hours**.
- Provide an initial assessment within **5 business days**.
- Keep you informed of progress toward a fix.
- Credit you in the release notes (if you wish) once the vulnerability is resolved.

## Expected Response Timeline

| Event | Expected timeframe |
| ----- | ------------------ |
| Acknowledgment | Within 72 hours |
| Initial assessment | Within 5 business days |
| Fix for critical issues | Within 14 days |
| Fix for moderate issues | Within 30 days |
| Public disclosure | After a fix is released |

## Scope

The following are **in scope** for security reports:

- Cross-site scripting (XSS) vulnerabilities
- Local storage or IndexedDB data leakage between origins
- Prototype pollution or other client-side injection attacks
- Dependency vulnerabilities in the runtime bundle
- Inadequate validation that could lead to data corruption

The following are **out of scope**:

- Attacks requiring physical access to the user's machine
- Social engineering attacks against project maintainers
- Theoretical vulnerabilities without a practical attack vector
- Issues in dependencies that are already patched in newer versions
- Features intentionally designed as client-only (e.g., localStorage persistence)

## Safe Harbor

We will not pursue legal action against anyone who:

- Reports a vulnerability in accordance with this policy
- Engages in good-faith security research within the scope defined above
- Does not cause harm or violate applicable law

## Acknowledgments

Because this application processes financial data locally — transaction histories, balances, spending patterns — we treat security vulnerabilities with the same seriousness as server-side financial applications. We appreciate the community's help in keeping Open Money Tracker safe.
