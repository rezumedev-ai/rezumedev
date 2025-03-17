
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface ResponsibilityInputProps {
  value: string;
  index: number;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

export function ResponsibilityInput({
  value,
  index,
  onChange,
  onRemove
}: ResponsibilityInputProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <Input
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder="Describe a key responsibility or achievement"
        className="flex-1"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        className="text-gray-400 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
