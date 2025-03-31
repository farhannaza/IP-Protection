"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, FileText, Music, ImageIcon, File, Video, Package } from "lucide-react"
import { FileUploader } from "@/components/file-uploader"
import { AssetList } from "@/components/asset-list"
import { Web3Service } from "@/lib/web3"
import { generateFileHash } from "@/lib/hash"
import { toast, Toaster } from "sonner"

type Asset = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: "processing" | "verified" | "error";
  txHash?: string;
  timestamp?: string;
};

type BlockchainAsset = {
  hash: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  timestamp: number;
};

export default function Dashboard() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [web3Service, setWeb3Service] = useState<Web3Service | null>(null);
  const [networkInfo, setNetworkInfo] = useState<{ name: string; contractAddress: string } | null>(null);

  useEffect(() => {
    const initializeWeb3AndLoadAssets = async () => {
      try {
        const service = new Web3Service();
        await service.initialize();

        // Get network information
        const networkName = await service.getNetworkName();
        const contractAddress = await service.getContractAddress();
        setNetworkInfo({ name: networkName, contractAddress });

        setWeb3Service(service);

        // Load assets from blockchain
        const blockchainAssets: BlockchainAsset[] = await service.getAllProtectedAssets();
        const formattedAssets: Asset[] = blockchainAssets.map((asset) => ({
          id: asset.hash,
          name: asset.fileName,
          type: asset.fileType,
          size: asset.fileSize,
          uploadDate: new Date(asset.timestamp * 1000).toISOString().split("T")[0],
          status: "verified",
          txHash: asset.hash,
          timestamp: new Date(asset.timestamp * 1000).toLocaleString(),
        }));

        setAssets(formattedAssets);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    };

    initializeWeb3AndLoadAssets();
  }, []);

  const handleFileUpload = async (files: File[]) => {
    if (!web3Service) {
      toast.error("Web3 not initialized");
      return;
    }

    // Add new files to UI immediately with processing status
    const newAssets: Asset[] = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "processing",
    }));

    setAssets((prev) => [...newAssets, ...prev]);

    for (const [index, file] of files.entries()) {
      try {
        const hash = await generateFileHash(file);
        const txHash = await web3Service.storeHash(
          hash,
          file.name,
          file.type,
          `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        );

        setAssets((prev) =>
          prev.map((asset) =>
            asset.id === newAssets[index].id
              ? { ...asset, status: "verified", txHash, timestamp: new Date().toLocaleString() }
              : asset
          )
        );

        toast.success(`File "${file.name}" has been protected`);

        const blockchainAssets: BlockchainAsset[] = await web3Service.getAllProtectedAssets();
        const formattedAssets: Asset[] = blockchainAssets.map((asset) => ({
          id: asset.hash,
          name: asset.fileName,
          type: asset.fileType,
          size: asset.fileSize,
          uploadDate: new Date(asset.timestamp * 1000).toISOString().split("T")[0],
          status: "verified",
          txHash: asset.hash,
          timestamp: new Date(asset.timestamp * 1000).toLocaleString(),
        }));

        setAssets(formattedAssets);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
          toast.error(error.message);
        } else {
          console.error("Unknown error occurred");
          toast.error("Failed to protect file");
        }

        setAssets((prev) =>
          prev.map((asset) =>
            asset.id === newAssets[index].id ? { ...asset, status: "error" } : asset
          )
        );
      }
    }
  };

  const getCategoryCounts = () => ({
    documents: assets.filter((a) => a.type.includes("pdf") || a.type.includes("document") || a.type.includes("txt") || a.type.includes("doc")).length,
    music: assets.filter((a) => a.type.includes("audio") || a.type.includes("mp3") || a.type.includes("wav")).length,
    images: assets.filter((a) => a.type.includes("image") || a.type.includes("png") || a.type.includes("jpg") || a.type.includes("jpeg") || a.type.includes("gif")).length,
    videos: assets.filter((a) => a.type.includes("video") || a.type.includes("mp4") || a.type.includes("mov") || a.type.includes("avi")).length,
    others: assets.filter((a) => !["pdf", "document", "txt", "doc", "audio", "mp3", "wav", "image", "png", "jpg", "jpeg", "gif", "video", "mp4", "mov", "avi"].some((ext) => a.type.includes(ext))).length,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Shield className="h-6 w-6" />
          <span>IP Shield</span>
        </Link>
        {networkInfo && (
          <div className="ml-4 text-sm text-muted-foreground">
            <span className="font-medium">{networkInfo.name}</span>
            <span className="mx-2">|</span>
            <span className="font-mono text-xs truncate" title={networkInfo.contractAddress}>
              Contract: {networkInfo.contractAddress.slice(0, 6)}...{networkInfo.contractAddress.slice(-4)}
            </span>
          </div>
        )}
      </header>
      <main className="flex-1 container max-w-7xl mx-auto py-6 px-4">
        <div className="grid gap-6">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <FileUploader onFilesSelected={handleFileUpload} />
          <AssetList assets={assets} />
        </div>
      </main>
      <footer className="border-t py-4 px-6">
        <div className="container flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">IP Shield.</p>
          <p className="text-xs text-muted-foreground">Powered by Blockchain Technology</p>
        </div>
      </footer>
    </div>
  );
}
