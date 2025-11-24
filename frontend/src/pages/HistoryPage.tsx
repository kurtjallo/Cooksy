import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Camera, Type, AlertCircle, Loader2, Calendar } from 'lucide-react';
import { useGetHistory } from '@/hooks/useQueries';

export default function HistoryPage() {
  const { data: history, isLoading } = useGetHistory();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Ingredient History</h1>
        <p className="text-muted-foreground">
          Track your past ingredient entries and recipe generations
        </p>
      </div>

      {!history || history.length === 0 ? (
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            No history yet. Start adding ingredients to see your history here!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {formatDate(entry.timestamp)}
                  </CardTitle>
                  <Badge variant="outline">
                    {entry.ingredientList.length} ingredient{entry.ingredientList.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {entry.ingredientList.map((ingredient) => (
                    <Badge
                      key={ingredient.id}
                      variant={ingredient.source === 'photo' ? 'default' : 'secondary'}
                      className="text-sm py-2 px-3 gap-2"
                    >
                      {ingredient.source === 'photo' ? (
                        <Camera className="w-3 h-3" />
                      ) : (
                        <Type className="w-3 h-3" />
                      )}
                      {ingredient.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
