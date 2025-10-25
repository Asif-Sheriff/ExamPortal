# Trustless Exam App

A **trustless exam platform** built with **TypeScript**, leveraging **Shamir’s Secret Sharing** and **Public Key Cryptography** to ensure exam integrity, secure question distribution, and verifiable results.

---

## Motivation

Traditional online exams rely heavily on central authorities for question access, grading, and validation — creating single points of failure and trust.  
This app removes that dependency using cryptographic primitives, ensuring **confidentiality**, **verifiability**, and **decentralization** in the exam process.

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/trustless-exam-app.git

# Navigate to project folder
cd trustless-exam-app

# Install dependencies
npm install

# Run development server
npm run dev

## Usage

1. **Instructor** encrypts exam questions using public-key cryptography.  
2. **Exam keys** are split using **Shamir’s Secret Sharing** among multiple verifiers.  
3. **Students** decrypt questions and submit answers using their private keys.  
4. **Verifiers** reconstruct the secret to validate results without relying on a central authority.

```


## Contributing

Contributions are welcome!  
Fork the repository, create a new branch, and submit a pull request.

```bash
git checkout -b feature/your-feature
git commit -m "Add: your feature"
git push origin feature/your-feature
```
