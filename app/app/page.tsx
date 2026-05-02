"use client";

import React, { useState } from "react";
import { useConnection, useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import type { Lumina } from "../lumina"; 
import idl from "../lumina.json"; 

export default function Dashboard() {
  // 1. ALL HOOKS MUST BE INSIDE THIS FUNCTION
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { publicKey } = useWallet();

  // State for forms
  const [courseId, setCourseId] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [learnerAddress, setLearnerAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  // 2. HELPER FUNCTION
  const getProgram = () => {
    if (!wallet) return null;
    const provider = new AnchorProvider(connection, wallet, { preflightCommitment: "processed" });
    return new Program(idl as any, provider);
  };

  // 3. INITIALIZE COURSE LOGIC
  const handleInitializeCourse = async () => {
    const program = getProgram();
    if (!program || !publicKey) return alert("Please connect wallet first!");
    
    try {
      setLoading(true);
      const [coursePDA] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("course"), publicKey.toBuffer(), Buffer.from(courseId)],
        program.programId
      );

      const tx = await program.methods
        .initializeCourse(courseId, courseTitle)
        .accounts({
          course: coursePDA,
          instructor: publicKey,
          systemProgram: web3.SystemProgram.programId,
        } as any)
        .rpc();
        
      setTxHash(tx);
      alert(`Course created successfully! TX: ${tx}`);
    } catch (error) {
      console.error(error);
      alert("Failed to initialize course. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // 4. MINT CERTIFICATE LOGIC
  const handleMintCertificate = async () => {
    const program = getProgram();
    if (!program || !publicKey) return alert("Please connect wallet first!");
    if (!learnerAddress) return alert("Please enter a learner address!");

    try {
      setLoading(true);
      const learnerPubkey = new web3.PublicKey(learnerAddress);
      
      const [coursePDA] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("course"), publicKey.toBuffer(), Buffer.from(courseId)],
        program.programId
      );

      const [certificatePDA] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("certificate"), coursePDA.toBuffer(), learnerPubkey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .issueCertificate(learnerPubkey)
        .accounts({
          certificate: certificatePDA,
          course: coursePDA,
          instructor: publicKey,
          systemProgram: web3.SystemProgram.programId,
        } as any)
        .rpc();

      setTxHash(tx);
      alert(`Certificate minted successfully! TX: ${tx}`);
    } catch (error) {
      console.error(error);
      alert("Failed to mint certificate. Make sure you initialized the course first!");
    } finally {
      setLoading(false);
    }
  };

// 5. THE UI
  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen relative overflow-x-hidden selection:bg-[#F0FF42]/30 selection:text-white font-['Inter']">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#deed2e]/10 blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#474746]/30 blur-[150px] mix-blend-screen"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-white/5 backdrop-blur-xl border-b border-white/20 shadow-[0_0_20px_rgba(240,255,66,0.1)]">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-bold tracking-tighter text-white uppercase font-['Space_Grotesk'] flex items-center gap-3">
            ✨ Lumina
          </span>
        </div>
        <div className="flex items-center">
          <WalletMultiButton />
        </div>
      </nav>

      <main className="pt-32 pb-24 min-h-screen flex flex-col items-center gap-20 px-6 relative z-10">
        
        <div className="w-full max-w-xl bg-white/[0.03] backdrop-blur-[20px] border border-white/20 rounded-xl p-10 shadow-2xl relative">
          <header className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F0FF42]/20 border border-[#F0FF42]/30 mb-4 shadow-[0_0_15px_rgba(240,255,66,0.3)] text-xl">
              ➕
            </div>
            <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white">Initialize New Course</h1>
          </header>

          <form className="space-y-8">
            <div className="flex flex-col gap-1 relative group">
              <label className="text-xs font-semibold font-['Space_Grotesk'] text-[#c8c8ad] uppercase tracking-wider">Course ID</label>
              <input 
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-[#929279] text-white py-2 px-0 focus:ring-0 focus:border-[#F0FF42] transition-colors placeholder:text-[#929279]/50" 
                placeholder="e.g. CS-301-WEB3" type="text" 
              />
            </div>
            <div className="flex flex-col gap-1 relative group">
              <label className="text-xs font-semibold font-['Space_Grotesk'] text-[#c8c8ad] uppercase tracking-wider">Course Title</label>
              <input 
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-[#929279] text-white py-2 px-0 focus:ring-0 focus:border-[#F0FF42] transition-colors placeholder:text-[#929279]/50" 
                placeholder="Advanced Smart Contract Security" type="text" 
              />
            </div>
            
            <button 
              onClick={handleInitializeCourse}
              disabled={loading || !publicKey}
              type="button"
              className="w-full relative group overflow-hidden rounded-lg bg-[#F0FF42] text-black py-4 px-10 flex justify-center items-center gap-3 transition-all duration-300 hover:bg-[#deed2e] shadow-[0_0_20px_rgba(240,255,66,0.4)] hover:shadow-[0_0_30px_rgba(240,255,66,0.6)] disabled:opacity-50"
            >
              <span className="relative z-10 uppercase tracking-widest font-semibold font-['Space_Grotesk'] text-xs">
                {loading ? "Processing..." : "Create Course on Solana"}
              </span>
              <span className="relative z-10 text-[18px]">🚀</span>
            </button>
          </form>
        </div>

        <div className="w-full max-w-4xl relative group mt-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#deed2e] via-[#474746] to-[#deed2e] rounded-[1.5rem] blur-xl opacity-20 transition duration-1000"></div>
          
          <div className="relative bg-white/[0.03] backdrop-blur-[40px] border border-white/20 border-t-white/40 border-l-white/40 rounded-[1.5rem] p-12 overflow-hidden flex flex-col md:flex-row gap-12 items-center justify-between shadow-2xl">
            <div className="flex-1 relative z-10 space-y-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#deed2e]/20 flex items-center justify-center border border-[#deed2e]/50 shadow-[0_0_10px_rgba(222,237,46,0.3)] text-lg">
                  🎓
                </div>
                <div>
                  <p className="text-xs font-semibold font-['Space_Grotesk'] text-[#deed2e] uppercase tracking-widest">Lumina Academy</p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-white mb-2 leading-tight">
                  {courseTitle || "Course Title Preview"}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-8 pt-8 border-t border-white/10">
                <div className="flex flex-col gap-1 relative group w-full max-w-md">
                   <label className="text-xs font-semibold font-['Space_Grotesk'] text-[#c8c8ad] uppercase tracking-wider">Student Wallet to Receive NFT</label>
                   <input 
                      value={learnerAddress}
                      onChange={(e) => setLearnerAddress(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-md text-[#deed2e] py-2 px-3 focus:ring-0 focus:border-[#F0FF42] font-mono text-sm" 
                      placeholder="Paste Solana Address Here" type="text" 
                   />
                </div>
              </div>
            </div>

            <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 border-[1px] border-dashed border-[#deed2e]/40 rounded-full animate-[spin_60s_linear_infinite]"></div>
              <div className="absolute inset-4 border border-white/20 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
              <div className="absolute inset-8 bg-gradient-to-br from-[#deed2e]/20 to-transparent rounded-full backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-[inset_0_0_20px_rgba(222,237,46,0.2)] text-5xl">
                🛡️
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            <button 
              onClick={handleMintCertificate}
              disabled={loading || !publicKey}
              className="relative group px-8 py-4 rounded-lg bg-[#deed2e] text-black font-semibold font-['Space_Grotesk'] text-xs uppercase tracking-widest overflow-hidden transition-all shadow-[0_0_20px_rgba(222,237,46,0.4)] disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-2">
                 {loading ? "Minting..." : "Mint Certificate"} 
                <span className="opacity-80 normal-case tracking-normal">(Instructor Only)</span> →
              </span>
            </button>
            {txHash && (
               <p className="text-[#deed2e] font-mono text-xs mt-2">Latest TX: {txHash.slice(0, 4)}...{txHash.slice(-4)}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}