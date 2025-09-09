"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function UIDemoPage() {
  const [value, setValue] = useState("")

  return (
    <main className="min-h-screen w-full p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">shadcn/ui Demo</h1>
        <p className="text-muted-foreground">Button, Card, and Input using Tailwind v4 tokens.</p>

        <Card>
          <CardHeader>
            <CardTitle>Quick Form</CardTitle>
            <CardDescription>Type something and click submit.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Your text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="max-w-sm"
              />
              <Button onClick={() => alert(value || "Nothing entered yet!")}>Submit</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>
    </main>
  )
}

