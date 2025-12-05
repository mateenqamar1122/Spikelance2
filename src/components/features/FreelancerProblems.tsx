import React from 'react';

interface ProblemSolutionProps {
  problem: string;
  solution: string;
  icon: React.ReactNode;
}

const ProblemSolutionCard: React.FC<ProblemSolutionProps> = ({ problem, solution, icon }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
      <div className="flex flex-col h-full">
        <div className="mb-4 text-primary">{icon}</div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">The Problem</h3>
          <p className="text-muted-foreground">{problem}</p>
          <div className="h-px w-full bg-gradient-to-r from-primary/30 via-brand-blue/30 to-transparent my-4"></div>
          <h3 className="text-xl font-semibold text-brand-blue">Our Solution</h3>
          <p className="text-muted-foreground">{solution}</p>
        </div>
      </div>
    </div>
  );
};

export const FreelancerProblems: React.FC = () => {
  const problemSolutions = [
    {
      problem: "Inconsistent income and cash flow challenges make financial planning difficult for freelancers.",
      solution: "Spikelance provides invoicing tools with payment tracking and financial dashboards to help you maintain steady cash flow and plan ahead.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
          <path d="M12 4v16"></path>
        </svg>
      ),
    },
    {
      problem: "Managing multiple clients and projects simultaneously leads to disorganization and missed deadlines.",
      solution: "Our centralized client and project management system helps you track all your work in one place, with automated reminders and milestone tracking.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
          <path d="M7 7h10"></path>
          <path d="M7 12h10"></path>
          <path d="M7 17h10"></path>
        </svg>
      ),
    },
    {
      problem: "Administrative tasks like contracts, invoicing, and expense tracking consume valuable time that could be spent on billable work.",
      solution: "Spikelance automates administrative workflows with templates for contracts, recurring invoices, and expense categorization to free up your time.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="M12 18v-6"></path>
          <path d="M8 18v-1"></path>
          <path d="M16 18v-3"></path>
        </svg>
      ),
    },
    {
      problem: "Finding new clients and maintaining a steady pipeline of work is challenging and time-consuming.",
      solution: "Our portfolio tools and client management features help you showcase your work professionally and nurture client relationships for repeat business.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
          <path d="M17 18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v9Z"></path>
          <path d="M17 9V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4"></path>
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-background to-primary/5" data-animation="fade-in-up">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white">Freelancer Challenges</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Common Problems, Powerful Solutions</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We understand the unique challenges freelancers face. Here's how Spikelance helps you overcome them.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {problemSolutions.map((item, index) => (
            <ProblemSolutionCard
              key={index}
              problem={item.problem}
              solution={item.solution}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};