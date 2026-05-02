import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Lumina } from "../target/types/lumina";
import { assert } from "chai";

describe("lumina", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Lumina as Program<Lumina>;

  // We'll use the provider's wallet as the instructor
  const instructor = provider.wallet;
  
  // Generate a random keypair to act as our learner/student
  const learner = anchor.web3.Keypair.generate();

  const courseId = "SOL101";
  const courseTitle = "Intro to Solana Web3";

  it("Initializes a course", async () => {
    // 1. Find the PDA (Program Derived Address) for the course
    const [coursePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("course"),
        instructor.publicKey.toBuffer(),
        Buffer.from(courseId),
      ],
      program.programId
    );

    // 2. Call the initialize_course instruction
    await program.methods
      .initializeCourse(courseId, courseTitle)
      .accounts({
        course: coursePDA,
        instructor: instructor.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // 3. Fetch the account and assert the data is correct
    const courseAccount = await program.account.course.fetch(coursePDA);
    assert.equal(courseAccount.courseId, courseId);
    assert.equal(courseAccount.title, courseTitle);
    assert.equal(courseAccount.instructor.toBase58(), instructor.publicKey.toBase58());
  });

  it("Issues a certificate", async () => {
    // 1. Derive the same course PDA
    const [coursePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("course"),
        instructor.publicKey.toBuffer(),
        Buffer.from(courseId),
      ],
      program.programId
    );

    // 2. Derive the certificate PDA
    const [certificatePDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("certificate"),
        coursePDA.toBuffer(),
        learner.publicKey.toBuffer(),
      ],
      program.programId
    );

    // 3. Call the issue_certificate instruction
    await program.methods
      .issueCertificate(learner.publicKey)
      .accounts({
        certificate: certificatePDA,
        course: coursePDA,
        instructor: instructor.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // 4. Fetch and verify
    const certAccount = await program.account.certificate.fetch(certificatePDA);
    assert.equal(certAccount.learner.toBase58(), learner.publicKey.toBase58());
    assert.equal(certAccount.course.toBase58(), coursePDA.toBase58());
    assert.isTrue(certAccount.issueDate.toNumber() > 0);
  });
});