"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { MoreVertical, Sparkles } from "lucide-react"

export default function UIAdvancedDemo() {
  const [name, setName] = useState("")

  return (
    <main className="min-h-screen w-full p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">UI Advanced Demo</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" onClick={() => toast.success("You're all set!")}>Show toast</Button>
              </TooltipTrigger>
              <TooltipContent>Trigger a success toast</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> CRM Quick Actions</CardTitle>
            <CardDescription>Common interactions using shadcn/ui primitives.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline"><MoreVertical className="mr-2 h-4 w-4" /> Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => toast("Assigned owner")}>Assign owner</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast("Added note")}>Add note</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast("Archived", { description: "Moved to archive" })}>
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Quick edit</Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Update contact name</div>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                    <Button size="sm" onClick={() => toast.success(`Saved ${name || ""}`)}>Save</Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open modal</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create task</DialogTitle>
                    <DialogDescription>Schedule a quick follow-up for this lead.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <Input placeholder="Task title" />
                    <Input placeholder="Due date" type="date" />
                  </div>
                  <DialogFooter>
                    <Button onClick={() => toast.success("Task created")}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Separator />

            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

