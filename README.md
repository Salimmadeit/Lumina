# ✨ Lumina | Verifiable On-Chain Education

> **Built for the Sol H3ckers Ecosystem Hackathon**
> **Theme:** Building the future of education onchain.

Lumina is a decentralized education and credentialing platform built on Solana. It shifts the focus of educational platforms from centralized, manipulable databases to an immutable, cryptographic trust layer. 

Traditional certificates are easily forged PDFs. Lumina solves this by allowing educators to initialize verifiable courses and mint Non-Fungible Certifications (via Program Derived Addresses) directly to a learner's wallet. Employers can verify a student's mastery with 100% on-chain certainty.

## 🚀 MVP Features (Current Release)
*   **Educator Portal:** Instructors can securely initialize new academic courses on the Solana Devnet.
*   **Immutable Credentialing:** Instructors can mint verifiable, non-transferable course completion certificates directly to a student's Solana wallet address.
*   **Cryptographic Verification:** Every certificate includes an on-chain transaction hash for instant, trustless verification via the Solana Explorer.
*   **Wallet Integration:** Seamless connection using the Solana Wallet Adapter.

## 🗺️ Future Roadmap
The blockchain is an immutable ledger, not a hard drive. Our roadmap expands Lumina into a full-scale decentralized academy:
*   **Decentralized Hosting:** Storing heavy course materials (videos, PDFs) on Arweave or IPFS.
*   **Token-Gated Access:** Using Solana Token Extensions to grant access to course materials only if a user holds a specific subscription token.
*   **Learner Incentives:** Automatically rewarding top-performing students with SPL tokens upon successful on-chain assessment completion.

## 🛠️ Tech Stack
*   **Blockchain:** Solana, Anchor Framework (Rust)
*   **Frontend:** Next.js 16 (App Router), React, TypeScript
*   **Styling:** Tailwind CSS, Glassmorphism UI
*   **Web3 Integration:** `@solana/web3.js`, `@solana/wallet-adapter`

## 💻 Local Development
1. Clone the repository: `git clone <repo-url>`
2. Install dependencies: `cd app && npm install --legacy-peer-deps`
3. Run the development server: `npm run dev`
4. Open `http://localhost:3000` in your browser.
*(Note: Requires a Solana wallet like Phantom set to Devnet)*
