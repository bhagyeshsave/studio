import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueReportForm } from "@/components/features/issue-report-form";

export default function ReportPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Report a New Issue</CardTitle>
          <CardDescription>
            Help us improve your community by reporting problems. Please provide as much detail as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IssueReportForm />
        </CardContent>
      </Card>
    </div>
  );
}
