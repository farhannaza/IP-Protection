"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Search, CheckCircle, XCircle } from "lucide-react"
import { FileUploader } from "@/components/file-uploader"

export default function VerifyPage() {
  const [verificationMethod, setVerificationMethod] = useState<"file" | "hash">("file")
  const [hashInput, setHashInput] = useState("")
  const [verificationResult, setVerificationResult] = useState<{
    status: "success" | "error" | null
    message: string
    details?: {
      originalOwner: string
      timestamp: string
      txHash: string
    }
  }>({ status: null, message: "" })

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return

    // In a real app, we would calculate the hash of the file and check it against the blockchain
    // For demo purposes, we'll just simulate a verification process
    setVerificationResult({ status: null, message: "Verifying file..." })

    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      const isVerified = Math.random() > 0.3

      if (isVerified) {
        setVerificationResult({
          status: "success",
          message: "File verified successfully!",
          details: {
            originalOwner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            timestamp: "2025-03-15 14:30:22",
            txHash: "0x1a2b3c4d5e6f7g8h9i0j...",
          },
        })
      } else {
        setVerificationResult({
          status: "error",
          message: "File not found in our records.",
        })
      }
    }, 2000)
  }

  const handleHashVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hashInput) return

    setVerificationResult({ status: null, message: "Verifying hash..." })

    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      const isVerified = Math.random() > 0.3

      if (isVerified) {
        setVerificationResult({
          status: "success",
          message: "Hash verified successfully!",
          details: {
            originalOwner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            timestamp: "2025-03-20 09:15:47",
            txHash: "0x7e8f9a0b1c2d3e4f5g6h7i...",
          },
        })
      } else {
        setVerificationResult({
          status: "error",
          message: "Hash not found in our records.",
        })
      }
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Shield className="h-6 w-6" />
          <span>IP Shield</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard/verify">
            Verify
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/profile">
            Profile
          </Link>
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </nav>
      </header>
      <main className="flex-1 container py-6">
        <div className="grid gap-6 max-w-2xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Verify Intellectual Property</h1>
            <p className="text-muted-foreground">Check if a file or hash exists on the blockchain</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Verification Method</CardTitle>
              <CardDescription>Choose how you want to verify intellectual property</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={verificationMethod === "file" ? "default" : "outline"}
                  onClick={() => setVerificationMethod("file")}
                >
                  Upload File
                </Button>
                <Button
                  variant={verificationMethod === "hash" ? "default" : "outline"}
                  onClick={() => setVerificationMethod("hash")}
                >
                  Enter Hash
                </Button>
              </div>
            </CardContent>
          </Card>

          {verificationMethod === "file" ? (
            <Card>
              <CardHeader>
                <CardTitle>Upload File to Verify</CardTitle>
                <CardDescription>
                  We'll calculate the hash of your file and check if it exists on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader onFilesSelected={handleFileUpload} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Enter File Hash</CardTitle>
                <CardDescription>
                  Enter the SHA-256 hash of your file to verify its existence on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHashVerify}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="hash">File Hash</Label>
                      <Input
                        id="hash"
                        placeholder="e.g., 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
                        value={hashInput}
                        onChange={(e) => setHashInput(e.target.value)}
                      />
                    </div>
                    <Button type="submit">
                      <Search className="w-4 h-4 mr-2" />
                      Verify Hash
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {verificationResult.status !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {verificationResult.status === "success" ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Verification Successful
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      Verification Failed
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{verificationResult.message}</p>

                {verificationResult.details && (
                  <div className="grid gap-2 text-sm">
                    <div className="grid grid-cols-3 gap-1 py-1 border-b">
                      <span className="font-medium">Original Owner:</span>
                      <span className="col-span-2 truncate">{verificationResult.details.originalOwner}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 py-1 border-b">
                      <span className="font-medium">Timestamp:</span>
                      <span className="col-span-2">{verificationResult.details.timestamp}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 py-1">
                      <span className="font-medium">Transaction:</span>
                      <span className="col-span-2 truncate">{verificationResult.details.txHash}</span>
                    </div>
                  </div>
                )}
              </CardContent>
              {verificationResult.status === "success" && (
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View on Blockchain Explorer
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </main>
      <footer className="border-t py-4 px-6">
        <div className="container flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">© 2025 IP Shield. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Powered by Blockchain Technology</p>
        </div>
      </footer>
    </div>
  )
}

