# Security Policy

## Supported Versions

The table below indicates which versions of MarvelVerse currently receive security updates.

|    Version     | Supported |
| :------------: | :-------: |
| Latest (main)  |    ✅     |
| Older versions |    ❌     |

Only the latest version of the project is actively maintained and supported with security updates.

---

# Reporting a Vulnerability

If you discover a security vulnerability, please **do not create a public GitHub issue**.

Instead, report it responsibly by contacting the project maintainer.

When reporting a vulnerability, please include:

- A clear description of the issue
- Steps to reproduce the vulnerability
- Potential impact
- Suggested mitigation (if known)
- Screenshots or proof-of-concept (if applicable)

Reports will be acknowledged as soon as possible.

---

# Response Process

Once a report is received, the following process will be followed:

1. Confirm receipt of the report.
2. Validate and reproduce the issue.
3. Assess the severity and impact.
4. Develop and test a fix.
5. Release the fix.
6. Publicly disclose the issue after a patch has been made available (when appropriate).

---

# Scope

Security reports may include, but are not limited to:

- Authentication vulnerabilities
- Authorization issues
- SQL Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Remote Code Execution (RCE)
- Dependency vulnerabilities
- Sensitive information disclosure
- Misconfigured security headers
- Server-side vulnerabilities
- API security issues

---

# Out of Scope

The following are generally considered out of scope:

- Issues affecting unsupported versions
- Missing security headers on local development environments
- Denial-of-Service attacks requiring excessive resources
- Social engineering attacks
- Vulnerabilities in third-party services outside the project's control

---

# Security Best Practices

Contributors should:

- Never commit secrets or API keys.
- Never commit production environment variables.
- Keep dependencies up to date.
- Validate all user input.
- Follow the principle of least privilege.
- Use parameterized database queries.
- Report vulnerabilities responsibly.

---

# Disclosure Policy

Security vulnerabilities will be handled responsibly.

Public disclosure will occur only after:

- The issue has been confirmed.
- A fix has been implemented.
- Users have had sufficient time to update.

---

# Questions

For general security questions, please open a GitHub Discussion or Issue.

For sensitive security matters, please contact the project maintainer privately.

Thank you for helping keep MarvelVerse secure.
