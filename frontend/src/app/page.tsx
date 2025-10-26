"use client";

import React, { useState } from "react";
import { Button, Card, CardContent, Typography, Collapse } from "@mui/material";
import { TransitionGroup } from "react-transition-group";

export default function HomePage() {
  const [items, setItems] = useState<string[]>([]);

  const handleAddItem = () => {
    const newItem = `Item ${items.length + 1}`;
    setItems([...items, newItem]);
  };

  const handleRemoveItem = () => {
    setItems(items.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-blue-100 to-blue-300 p-4">
      <Typography variant="h1" gutterBottom className="text-center text-black uppercase font-extrabold mb-8">
        Pharmachiano
      </Typography>
      <Typography variant="h3" gutterBottom className="text-center mb-8">
        MUI + React Transition Group Demo
      </Typography>

      <div className="flex gap-4 mb-6">
        <Button variant="contained" color="primary" onClick={handleAddItem}>
          Add Item
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleRemoveItem}>
          Remove Item
        </Button>
      </div>

      <TransitionGroup className="space-y-4 w-full max-w-md">
        {items.map((item, index) => (
          <Collapse key={index}>
            <Card elevation={6}>
              <CardContent className="flex justify-between items-center">
                <Typography variant="h6">{item}</Typography>
              </CardContent>
            </Card>
          </Collapse>
        ))}
      </TransitionGroup>
    </div>
  );
}