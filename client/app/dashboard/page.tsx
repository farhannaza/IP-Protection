"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, FileText, Music, ImageIcon, File } from "lucide-react"
import { FileUploader } from "@/components/file-uploader"
import { AssetList } from "@/components/asset-list"

export default function Dashboard() {
  const [assets, setAssets] = useState<
    Array<{
      id: string
      name: string
      type: string
      size: string
      uploadDate: string
      status: "processing" | "verified"
      txHash?: string
      timestamp?: string
    }>
  >([
    {
      id: "1",
      name: "song-demo.mp3",
      type: "audio/mp3",
      size: "4.2 MB",
      uploadDate: "2025-03-15",
      status: "verified",
      txHash: "0x1a2b3c4d5e6f...",
      timestamp: "2025-03-15 14:30:22",
    },
    {
      id: "2",
      name: "manuscript.pdf",
      type: "application/pdf",
      size: "1.8 MB",
      uploadDate: "2025-03-20",
      status: "verified",
      txHash: "0x7e8f9a0b1c2d...",
      timestamp: "2025-03-20 09:15:47",
    },
  ])

  const handleFileUpload = (files: File[]) => {
    // In a real app, we would process the files and send them to the server
    // For demo purposes, we'll just add them to the state
    const newAssets = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "processing" as const,
    }))

    setAssets([...newAssets, ...assets])

    // Simulate processing and verification
    setTimeout(() => {
      setAssets((prev) =>
        prev.map((asset) =>
          asset.status === "processing"
            ? {
                ...asset,
                status: "verified",
                txHash: `0x${Math.random().toString(16).substring(2, 14)}...`,
                timestamp: new Date().toLocaleString(),
              }
            : asset,
        ),
      )
    }, 3000)
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
        <div className="grid gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage and protect your intellectual property</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assets.length}</div>
                <p className="text-xs text-muted-foreground">Protected items</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <File className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assets.filter((a) => a.type.includes("pdf") || a.type.includes("document")).length}
                </div>
                <p className="text-xs text-muted-foreground">Protected documents</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Music</CardTitle>
                <Music className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assets.filter((a) => a.type.includes("audio")).length}</div>
                <p className="text-xs text-muted-foreground">Protected audio files</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Images</CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assets.filter((a) => a.type.includes("image")).length}</div>
                <p className="text-xs text-muted-foreground">Protected images</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload New Asset</CardTitle>
              <CardDescription>Upload your intellectual property to secure it on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader onFilesSelected={handleFileUpload} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Protected Assets</CardTitle>
              <CardDescription>View and manage your intellectual property</CardDescription>
            </CardHeader>
            <CardContent>
              <AssetList assets={assets} />
            </CardContent>
          </Card>
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

