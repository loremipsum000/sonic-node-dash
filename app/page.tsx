"use client";

import { useSFC } from "@/app/hooks/useSFC";
import { weiToToken } from "@/app/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, ExternalLink, Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

function hexToDecimal(hex: string | number): number {
  if (typeof hex === 'number') return hex;
  return parseInt(hex.replace('0x', ''), 16);
}

export default function Home() {
  const { data, loading, error } = useSFC();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCopied, setShowCopied] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc' | null;
  }>({ key: '', direction: null });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  const totalStaked = weiToToken(BigInt(data.validators.reduce((acc, v) => acc + BigInt(v.totalStake), BigInt(0))));
  const validatorStake = weiToToken(BigInt(data.validators.reduce((acc, v) => acc + BigInt(v.stake), BigInt(0))));
  const totalDelegated = weiToToken(BigInt(data.validators.reduce((acc, v) => acc + BigInt(v.delegatedMe), BigInt(0))));

  const chartData = [
    { name: "Validator Stake", value: validatorStake },
    { name: "Delegator Stake", value: totalDelegated },
  ];

  const handleCopy = (address: string) => {
    copyToClipboard(address);
    setShowCopied(address);
    setTimeout(() => setShowCopied(null), 2000);
  };

  const filteredValidators = data.validators.filter(validator => {
    const searchLower = searchTerm.toLowerCase();
    return (
      hexToDecimal(validator.id).toString().includes(searchTerm) ||
      validator.name?.toLowerCase().includes(searchLower) ||
      validator.address.toLowerCase().includes(searchLower)
    );
  });

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current.key === key) {
        if (current.direction === 'asc') {
          return { key, direction: 'desc' };
        }
        if (current.direction === 'desc') {
          return { key: '', direction: null };
        }
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedValidators = [...filteredValidators].sort((a, b) => {
    if (sortConfig.direction === null) return 0;
    
    let aValue, bValue;
    switch (sortConfig.key) {
      case 'id':
        aValue = hexToDecimal(a.id);
        bValue = hexToDecimal(b.id);
        break;
      case 'totalStake':
        aValue = Number(weiToToken(BigInt(a.totalStake)));
        bValue = Number(weiToToken(BigInt(b.totalStake)));
        break;
      case 'createdTime':
        aValue = Number(a.createdTime);
        bValue = Number(b.createdTime);
        break;
      default:
        return 0;
    }
    
    return sortConfig.direction === 'asc' 
      ? aValue - bValue 
      : bValue - aValue;
  });

  return (
    <TooltipProvider>
      <main className="p-8">
        <div className="grid gap-4 grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Current APR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.86%</div>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Stake Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Stake</p>
                    <p className="text-2xl font-bold">{Math.floor(totalStaked).toLocaleString()} S</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(24, 99%, 65%)" }} />
                        <p className="text-sm font-medium text-muted-foreground">Validator Stake</p>
                      </div>
                      <p className="text-base font-bold">{Math.floor(validatorStake).toLocaleString()} S</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(181, 52%, 61%)" }} />
                        <p className="text-sm font-medium text-muted-foreground">Delegator Stake</p>
                      </div>
                      <p className="text-base font-bold">{Math.floor(totalDelegated).toLocaleString()} S</p>
                    </div>
                  </div>
                </div>
                <div className="h-[150px] w-[150px]">
                  <PieChart width={150} height={150}>
                    <Pie
                      data={[
                        { name: "Validator Stake", value: validatorStake },
                        { name: "Delegator Stake", value: totalDelegated },
                      ]}
                      cx={75}
                      cy={75}
                      innerRadius={45}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="hsl(24, 99%, 65%)" />
                      <Cell fill="hsl(181, 52%, 61%)" />
                    </Pie>
                  </PieChart>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Epoch Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Epoch</p>
                    <p className="text-xl font-bold">{data.currentEpoch}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">End Time</p>
                    <p className="text-base font-bold">
                      {new Date(hexToDecimal(data.epochData?.endTime || '0') * 1000).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p className="text-base font-bold">
                      {Math.floor(hexToDecimal(data.epochData?.duration || '0') / 60)}m {hexToDecimal(data.epochData?.duration || '0') % 60}s
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fee</p>
                    <p className="text-base font-bold">
                      {weiToToken(BigInt(data.epochData?.epochFee || '0')).toLocaleString()} S
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Validators</CardTitle>
              <div className="relative w-[300px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, Name, or Address"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('id')}
                      className="h-8 flex items-center gap-2 justify-start w-full"
                    >
                      ID
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-left">Validator</TableHead>
                  <TableHead className="text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('totalStake')}
                      className="h-8 flex items-center gap-2 justify-start w-full"
                    >
                      Total Stake
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-left">Status</TableHead>
                  <TableHead className="text-left">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('createdTime')}
                      className="h-8 flex items-center gap-2 justify-start w-full"
                    >
                      Created Time
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Downtime</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedValidators.map((validator) => {
                  const validatorTotalStake = weiToToken(BigInt(validator.totalStake));
                  const validatorStakedAmount = weiToToken(BigInt(validator.stake));
                  const validatorDelegatedAmount = weiToToken(BigInt(validator.delegatedMe));
                  
                  return (
                    <TableRow key={validator.id}>
                      <TableCell className="text-left">{hexToDecimal(validator.id)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted">
                            {validator.logoUrl ? (
                              <Image
                                src={validator.logoUrl}
                                alt={validator.name || "Validator"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-secondary">
                                <div className="text-secondary-foreground font-medium">
                                  {validator.name ? validator.name[0].toUpperCase() : 'V'}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            {validator.name && (
                              <span className="font-medium">{validator.name}</span>
                            )}
                            <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
                              <span>{truncateAddress(validator.address)}</span>
                              <Tooltip open={showCopied === validator.address}>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleCopy(validator.address)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Copied!
                                </TooltipContent>
                              </Tooltip>
                              <a
                                href={`https://sonicscan.org/address/${validator.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </a>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        <Tooltip>
                          <TooltipTrigger>
                            {validatorTotalStake.toLocaleString()} S
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <div>Validator Stake: {validatorStakedAmount.toLocaleString()} S</div>
                              <div>Delegator Stake: {validatorDelegatedAmount.toLocaleString()} S</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Badge variant={validator.isActive ? "success" : "destructive"}>
                          {validator.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(Number(validator.createdTime) * 1000).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">{Number(validator.downtime).toFixed(2)}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </TooltipProvider>
  );
}