import { useState } from "react";
import { Calculator as CalcIcon, DollarSign, Percent, Calendar, RotateCcw, ChevronDown, ChevronUp, PieChart as PieChartIcon } from "lucide-react";
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
  const { toast } = useToast();

  const calculateAmortizationSchedule = (
    principal: number,
    monthlyRate: number,
    months: number,
    monthlyPayment: number
  ): AmortizationPayment[] => {
    const schedule: AmortizationPayment[] = [];
    let remainingBalance = principal;

    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      schedule.push({
        paymentNumber: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance),
      });
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
  };

  const resetForm = () => {
    setAmount("");
    setRate("");
    setYears("");
    setResults(null);
    setSchedule([]);
    setShowSchedule(false);
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
                className="h-12 flex-1 font-semibold"
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
                            <CardTitle className="text-base">Payment Breakdown</CardTitle>
                            <CardDescription>
                              Month-by-month details of your loan payments
                            </CardDescription>
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

        <p className="text-center text-sm text-muted-foreground mt-8">
          This calculator provides estimates based on the information you provide. 
          Actual loan terms may vary.
        </p>
      </div>
    </div>
  );
}
