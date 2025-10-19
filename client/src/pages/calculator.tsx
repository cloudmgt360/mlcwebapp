import { useState } from "react";
import { Calculator as CalcIcon, DollarSign, Percent, Calendar, RotateCcw, ChevronDown, ChevronUp, PieChart as PieChartIcon, PlusCircle, Trash2, GitCompare, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

interface LoanResults {
  monthlyPayment: string;
  totalPayment: string;
  totalInterest: string;
  principal: string;
}

interface LoanScenario {
  id: string;
  name: string;
  amount: string;
  rate: string;
  years: string;
  monthlyPayment: string;
  totalPayment: string;
  totalInterest: string;
}

interface AmortizationPayment {
  paymentNumber: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function Calculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [results, setResults] = useState<LoanResults | null>(null);
  const [schedule, setSchedule] = useState<AmortizationPayment[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [extraPayment, setExtraPayment] = useState("");
  const [extraPaymentType, setExtraPaymentType] = useState<"monthly" | "onetime">("monthly");
  const [showExtraPayment, setShowExtraPayment] = useState(false);
  const [scenarios, setScenarios] = useState<LoanScenario[]>([]);
  const [scenarioName, setScenarioName] = useState("");
  const { toast } = useToast();

  const calculateAmortizationSchedule = (
    principal: number,
    monthlyRate: number,
    months: number,
    monthlyPayment: number,
    extraPaymentAmount: number = 0,
    isOneTime: boolean = false
  ): AmortizationPayment[] => {
    const schedule: AmortizationPayment[] = [];
    let remainingBalance = principal;
    let paymentNumber = 1;

    while (remainingBalance > 0.01 && paymentNumber <= months * 2) {
      const interestPayment = remainingBalance * monthlyRate;
      let scheduledPayment = monthlyPayment;
      
      if (extraPaymentAmount > 0) {
        if (isOneTime && paymentNumber === 1) {
          scheduledPayment += extraPaymentAmount;
        } else if (!isOneTime) {
          scheduledPayment += extraPaymentAmount;
        }
      }

      const actualPayment = Math.min(scheduledPayment, interestPayment + remainingBalance);
      const principalPayment = actualPayment - interestPayment;
      remainingBalance -= principalPayment;

      schedule.push({
        paymentNumber: paymentNumber,
        payment: actualPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance),
      });

      paymentNumber++;
    }

    return schedule;
  };

  const calculateLoan = () => {
    const P = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const Y = parseFloat(years);

    if (!P || !annualRate || !Y || P <= 0 || annualRate <= 0 || Y <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid positive numbers for all fields.",
        variant: "destructive",
      });
      return;
    }

    const r = annualRate / 100 / 12;
    const n = Y * 12;

    const monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - P;

    setResults({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      principal: P.toFixed(2),
    });

    const amortizationSchedule = calculateAmortizationSchedule(P, r, n, monthlyPayment);
    setSchedule(amortizationSchedule);
    setShowSchedule(false);
    setShowExtraPayment(false);
  };

  const calculateWithExtraPayment = () => {
    if (!results) return;

    const extraAmount = parseFloat(extraPayment);
    if (!extraAmount || extraAmount <= 0) {
      toast({
        title: "Invalid Extra Payment",
        description: "Please enter a valid positive number for extra payment.",
        variant: "destructive",
      });
      return;
    }

    const P = parseFloat(results.principal);
    const annualRate = parseFloat(rate);
    const r = annualRate / 100 / 12;
    const monthlyPayment = parseFloat(results.monthlyPayment);

    const newSchedule = calculateAmortizationSchedule(
      P,
      r,
      parseFloat(years) * 12,
      monthlyPayment,
      extraAmount,
      extraPaymentType === "onetime"
    );

    setSchedule(newSchedule);
    setShowSchedule(false);
    setShowExtraPayment(true);

    const totalPaid = newSchedule.reduce((sum, payment) => sum + payment.payment, 0);
    const totalInterestPaid = totalPaid - P;
    const monthsSaved = (parseFloat(years) * 12) - newSchedule.length;
    const interestSaved = parseFloat(results.totalInterest) - totalInterestPaid;

    toast({
      title: "Extra Payment Impact",
      description: `You'll pay off your loan ${monthsSaved} months early and save ${formatCurrency(interestSaved)} in interest!`,
    });
  };

  const addToComparison = () => {
    if (!results) return;

    const name = scenarioName.trim() || `Scenario ${scenarios.length + 1}`;
    const newScenario: LoanScenario = {
      id: Date.now().toString(),
      name,
      amount,
      rate,
      years,
      monthlyPayment: results.monthlyPayment,
      totalPayment: results.totalPayment,
      totalInterest: results.totalInterest,
    };

    setScenarios([...scenarios, newScenario]);
    setScenarioName("");
    
    toast({
      title: "Scenario Added",
      description: `"${name}" has been added to comparison.`,
    });
  };

  const removeScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  const clearComparison = () => {
    setScenarios([]);
    toast({
      title: "Comparison Cleared",
      description: "All scenarios have been removed.",
    });
  };

  const exportScheduleToCSV = () => {
    if (schedule.length === 0) return;

    const headers = ['Month', 'Payment', 'Principal', 'Interest', 'Balance'];
    const rows = schedule.map(payment => [
      payment.paymentNumber,
      payment.payment.toFixed(2),
      payment.principal.toFixed(2),
      payment.interest.toFixed(2),
      payment.balance.toFixed(2),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'amortization_schedule.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Amortization schedule has been downloaded.",
    });
  };

  const exportComparisonToCSV = () => {
    if (scenarios.length === 0) return;

    const headers = ['Scenario', 'Loan Amount', 'Rate (%)', 'Term (years)', 'Monthly Payment', 'Total Payment', 'Total Interest'];
    const rows = scenarios.map(scenario => [
      `"${scenario.name.replace(/"/g, '""')}"`,
      parseFloat(scenario.amount).toFixed(2),
      parseFloat(scenario.rate).toFixed(2),
      parseFloat(scenario.years).toFixed(2),
      parseFloat(scenario.monthlyPayment).toFixed(2),
      parseFloat(scenario.totalPayment).toFixed(2),
      parseFloat(scenario.totalInterest).toFixed(2),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'loan_comparison.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Comparison data has been downloaded.",
    });
  };

  const resetForm = () => {
    setAmount("");
    setRate("");
    setYears("");
    setResults(null);
    setSchedule([]);
    setShowSchedule(false);
    setExtraPayment("");
    setShowExtraPayment(false);
  };

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  const formatCompactCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  };

  const CHART_COLORS = {
    principal: 'hsl(var(--primary))',
    interest: 'hsl(var(--chart-2))',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CalcIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Loan & Mortgage Calculator
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Calculate your monthly payments and see the total cost of your loan
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Loan Details</CardTitle>
            <CardDescription>
              Enter your loan information to calculate payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Loan Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100,000"
                  className="pl-9 h-12"
                  min="0"
                  step="1000"
                  data-testid="input-loan-amount"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate" className="text-sm font-medium">
                Annual Interest Rate
              </Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="5.0"
                  className="pl-9 h-12"
                  min="0"
                  step="0.1"
                  data-testid="input-interest-rate"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="years" className="text-sm font-medium">
                Loan Term (Years)
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="30"
                  className="pl-9 h-12"
                  min="0"
                  step="1"
                  data-testid="input-loan-term"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                onClick={calculateLoan}
                className="h-12 flex-1 font-semibold bg-red-600 hover:bg-red-600 text-white border-red-700"
                data-testid="button-calculate"
              >
                <CalcIcon className="w-4 h-4 mr-2" />
                Calculate
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="h-12 sm:w-32 font-semibold"
                data-testid="button-reset"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {results && (
              <div className="mt-8 pt-8 border-t space-y-6">
                <h3 className="text-lg font-semibold mb-4">Your Results</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Monthly Payment
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-primary" data-testid="text-monthly-payment">
                        {formatCurrency(results.monthlyPayment)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-accent/50">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Total Payment
                      </p>
                      <p className="text-xl font-semibold" data-testid="text-total-payment">
                        {formatCurrency(results.totalPayment)}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/50">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Total Interest
                      </p>
                      <p className="text-xl font-semibold text-chart-2" data-testid="text-total-interest">
                        {formatCurrency(results.totalInterest)}
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="mt-6">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-primary" />
                      <CardTitle className="text-base">Extra Payment Calculator</CardTitle>
                    </div>
                    <CardDescription>
                      See how extra payments can reduce your loan term and save interest
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Extra Payment Type</Label>
                      <RadioGroup
                        value={extraPaymentType}
                        onValueChange={(value) => setExtraPaymentType(value as "monthly" | "onetime")}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" data-testid="radio-monthly" />
                          <Label htmlFor="monthly" className="font-normal cursor-pointer">
                            Monthly Recurring
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="onetime" id="onetime" data-testid="radio-onetime" />
                          <Label htmlFor="onetime" className="font-normal cursor-pointer">
                            One-Time Payment
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="extraPayment" className="text-sm font-medium">
                        Extra Payment Amount
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="extraPayment"
                          type="number"
                          value={extraPayment}
                          onChange={(e) => setExtraPayment(e.target.value)}
                          placeholder="100"
                          className="pl-9 h-12"
                          min="0"
                          step="10"
                          data-testid="input-extra-payment"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={calculateWithExtraPayment}
                      variant="secondary"
                      className="w-full h-12 font-semibold"
                      data-testid="button-calculate-extra"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Calculate with Extra Payment
                    </Button>

                    {showExtraPayment && schedule.length > 0 && (
                      <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-2">
                        <p className="text-sm font-semibold text-primary">
                          Impact Summary
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">New Payoff Time</p>
                            <p className="font-semibold" data-testid="text-new-payoff-time">
                              {schedule.length} months ({Math.floor(schedule.length / 12)} years {schedule.length % 12} months)
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Months Saved</p>
                            <p className="font-semibold text-chart-2" data-testid="text-months-saved">
                              {(parseFloat(years) * 12) - schedule.length} months
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GitCompare className="w-5 h-5 text-primary" />
                        <CardTitle className="text-base">Add to Comparison</CardTitle>
                      </div>
                    </div>
                    <CardDescription>
                      Save this scenario to compare with other loan options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="scenarioName" className="text-sm font-medium">
                        Scenario Name (Optional)
                      </Label>
                      <Input
                        id="scenarioName"
                        value={scenarioName}
                        onChange={(e) => setScenarioName(e.target.value)}
                        placeholder={`Scenario ${scenarios.length + 1}`}
                        className="h-12"
                        data-testid="input-scenario-name"
                      />
                    </div>
                    <Button
                      onClick={addToComparison}
                      variant="secondary"
                      className="w-full h-12 font-semibold"
                      data-testid="button-add-to-comparison"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add to Comparison
                    </Button>
                  </CardContent>
                </Card>

                {schedule.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <PieChartIcon className="w-5 h-5 text-primary" />
                          <CardTitle className="text-base">Payment Visualization</CardTitle>
                        </div>
                        <CardDescription>
                          Visual breakdown of your loan over time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="breakdown" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="breakdown" data-testid="tab-breakdown">
                              Cost Breakdown
                            </TabsTrigger>
                            <TabsTrigger value="overtime" data-testid="tab-overtime">
                              Balance Over Time
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="breakdown" className="mt-6">
                            <div className="h-[300px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: 'Principal', value: parseFloat(results.principal), fill: CHART_COLORS.principal },
                                      { name: 'Interest', value: parseFloat(results.totalInterest), fill: CHART_COLORS.interest },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${formatCompactCurrency(value)}`}
                                    outerRadius={80}
                                    dataKey="value"
                                  >
                                  </Pie>
                                  <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{
                                      backgroundColor: 'hsl(var(--popover))',
                                      border: '1px solid hsl(var(--border))',
                                      borderRadius: '6px',
                                    }}
                                  />
                                  <Legend />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </TabsContent>
                          <TabsContent value="overtime" className="mt-6">
                            <div className="h-[300px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                  data={schedule.filter((_, idx) => idx % Math.ceil(schedule.length / 60) === 0 || idx === schedule.length - 1)}
                                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                >
                                  <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={CHART_COLORS.principal} stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor={CHART_COLORS.principal} stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                  <XAxis
                                    dataKey="paymentNumber"
                                    label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                                    tick={{ fontSize: 12 }}
                                    stroke="hsl(var(--muted-foreground))"
                                  />
                                  <YAxis
                                    tickFormatter={(value) => formatCompactCurrency(value)}
                                    tick={{ fontSize: 12 }}
                                    stroke="hsl(var(--muted-foreground))"
                                  />
                                  <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    labelFormatter={(label) => `Month ${label}`}
                                    contentStyle={{
                                      backgroundColor: 'hsl(var(--popover))',
                                      border: '1px solid hsl(var(--border))',
                                      borderRadius: '6px',
                                    }}
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="balance"
                                    stroke={CHART_COLORS.principal}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorBalance)"
                                    name="Remaining Balance"
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>

                    <Collapsible open={showSchedule} onOpenChange={setShowSchedule}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between h-12 font-semibold"
                          data-testid="button-toggle-schedule"
                        >
                          <span>View Detailed Amortization Schedule</span>
                          {showSchedule ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-base">Payment Breakdown</CardTitle>
                                <CardDescription>
                                  Month-by-month details of your loan payments
                                </CardDescription>
                              </div>
                              <Button
                                onClick={exportScheduleToCSV}
                                variant="outline"
                                size="sm"
                                data-testid="button-export-schedule"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Export CSV
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-0">
                            <ScrollArea className="h-[400px]">
                              <div className="px-6">
                                <table className="w-full">
                                  <thead className="sticky top-0 bg-card z-10">
                                    <tr className="border-b">
                                      <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground">
                                        Month
                                      </th>
                                      <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground">
                                        Payment
                                      </th>
                                      <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground">
                                        Principal
                                      </th>
                                      <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground">
                                        Interest
                                      </th>
                                      <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground">
                                        Balance
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {schedule.map((payment) => (
                                      <tr
                                        key={payment.paymentNumber}
                                        className="border-b last:border-b-0 hover-elevate"
                                        data-testid={`schedule-row-${payment.paymentNumber}`}
                                      >
                                        <td className="py-3 px-2 text-sm font-medium">
                                          {payment.paymentNumber}
                                        </td>
                                        <td className="py-3 px-2 text-sm text-right">
                                          {formatCurrency(payment.payment)}
                                        </td>
                                        <td className="py-3 px-2 text-sm text-right text-primary">
                                          {formatCurrency(payment.principal)}
                                        </td>
                                        <td className="py-3 px-2 text-sm text-right text-chart-2">
                                          {formatCurrency(payment.interest)}
                                        </td>
                                        <td className="py-3 px-2 text-sm text-right font-medium">
                                          {formatCurrency(payment.balance)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {scenarios.length > 0 && (
          <Card className="mt-8">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-primary" />
                  <CardTitle>Loan Comparison</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={exportComparisonToCSV}
                    variant="outline"
                    size="sm"
                    data-testid="button-export-comparison"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    onClick={clearComparison}
                    variant="ghost"
                    size="sm"
                    data-testid="button-clear-comparison"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
              <CardDescription>
                Compare different loan scenarios side-by-side
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-3 text-xs font-semibold text-muted-foreground">
                        Scenario
                      </th>
                      <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground">
                        Loan Amount
                      </th>
                      <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground">
                        Rate
                      </th>
                      <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground">
                        Term
                      </th>
                      <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground">
                        Monthly Payment
                      </th>
                      <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground">
                        Total Payment
                      </th>
                      <th className="text-right py-3 px-3 text-xs font-semibold text-muted-foreground">
                        Total Interest
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map((scenario) => (
                      <tr
                        key={scenario.id}
                        className="border-b last:border-b-0 hover-elevate"
                        data-testid={`comparison-row-${scenario.id}`}
                      >
                        <td className="py-3 px-3 font-medium" data-testid={`scenario-name-${scenario.id}`}>
                          {scenario.name}
                        </td>
                        <td className="py-3 px-3 text-right" data-testid={`scenario-amount-${scenario.id}`}>
                          {formatCurrency(scenario.amount)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {scenario.rate}%
                        </td>
                        <td className="py-3 px-3 text-right">
                          {scenario.years} years
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-primary" data-testid={`scenario-monthly-${scenario.id}`}>
                          {formatCurrency(scenario.monthlyPayment)}
                        </td>
                        <td className="py-3 px-3 text-right" data-testid={`scenario-total-${scenario.id}`}>
                          {formatCurrency(scenario.totalPayment)}
                        </td>
                        <td className="py-3 px-3 text-right text-chart-2" data-testid={`scenario-interest-${scenario.id}`}>
                          {formatCurrency(scenario.totalInterest)}
                        </td>
                        <td className="py-3 px-3">
                          <Button
                            onClick={() => removeScenario(scenario.id)}
                            variant="ghost"
                            size="icon"
                            data-testid={`button-remove-${scenario.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-muted-foreground mt-8">
          This calculator provides estimates based on the information you provide. 
          Actual loan terms may vary.
        </p>
      </div>
    </div>
  );
}
