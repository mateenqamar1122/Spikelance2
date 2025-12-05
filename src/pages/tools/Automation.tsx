import React from "react";
import { motion } from "framer-motion";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Automation = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Automation
            </h2>
            <p className="text-muted-foreground">
              Create and manage automated workflows to streamline your processes
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <Card className="w-full max-w-3xl border border-border/50 shadow-sm text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
            <CardDescription className="text-lg">
              We're working on powerful automation features to help you save time and streamline your workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-left">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Workflow Automation</h3>
                    <p className="text-sm text-muted-foreground">Create custom workflows to automate repetitive tasks and processes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 text-left">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Scheduled Triggers</h3>
                    <p className="text-sm text-muted-foreground">Set up time-based triggers to run workflows automatically on schedule</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 text-left">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Conditional Logic</h3>
                    <p className="text-sm text-muted-foreground">Build complex workflows with if-then conditions and branching paths</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" disabled>
                  <Clock className="mr-2 h-4 w-4" />
                  Stay tuned for updates
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Automation;