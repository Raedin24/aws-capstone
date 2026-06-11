# AWS Capstone Project

A presentation site for the Azubi Africa Cloud Engineering capstone — documenting the deployment of a highly available web application on AWS.

## Architecture

![AWS Cloud Architecture Diagram](https://d9dnabjvkvhfn.cloudfront.net/images/aws_cloud_architecture_project_diagram.png)

## Stack

- **Amazon EC2** — Ubuntu 22.04 + Apache web server
- **Application Load Balancer** — traffic distribution and health checks
- **Amazon S3** — static assets and deployment artifacts
- **ACM** — SSL/TLS certificates
- **CloudWatch** — monitoring and alerting
- **AWS Budgets** — cost tracking
- **IAM** — access control and MFA
- **GitHub Actions** — CI/CD pipeline

## Files

| File | Purpose |
|---|---|
| `index.html` | Single-page presentation site |
| `styles.css` | Styling (AWS brand colors, responsive) |
| `script.js` | Mobile nav, scroll-reveal, active nav |

## Team

| Name | Role |
|---|---|
| Rowyn Oheneafrewo Konadu | Project Lead |
| Annabel Buachie | Cloud Engineer |
| Matey Corletey | DevOps Engineer |
| Dennis Antwi | DevOps Engineer |
| Grace Adjekum | Documentation & Testing |
