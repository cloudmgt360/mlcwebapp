import { useState } from "react";
import { Calculator as CalcIcon, DollarSign, Percent, Calendar, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface LoanResults {
  monthlyPayment: string;
  totalPayment: string;
  totalInterest: string;
}

export default function Calculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [results, setResults] = useState<LoanResults | null>(null);
  const { toast } = useToast();

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
    });
  };

  const resetForm = () => {
    setAmount("");
    setRate("");
    setYears("");
    setResults(null);
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(value));
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
              <div className="mt-8 pt-8 border-t space-y-4">
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
