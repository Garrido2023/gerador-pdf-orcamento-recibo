import { useState, useRef } from 'react';
import QuoteForm from '@/components/QuoteForm';
import QuotePDF from '@/components/QuotePDF';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import toPDF from 'react-to-pdf';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [currentQuote, setCurrentQuote] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [documentType, setDocumentType] = useState<'orcamento' | 'recibo'>('orcamento');
  const pdfRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleQuoteGenerated = (quote: any) => {
    setCurrentQuote({ ...quote, documentType });
    setIsEditing(false);
  };

  const downloadPDF = async () => {
    if (pdfRef.current) {
      try {
        const filePrefix = documentType === 'recibo' ? 'Recibo' : 'Orcamento';
        await toPDF(() => pdfRef.current, {
          filename: `EKIPHELP_${filePrefix}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`,
        });
        toast({
          title: "PDF Gerado",
          description: "O PDF foi gerado com sucesso!",
        });
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        toast({
          title: "Erro",
          description: "Houve um erro ao gerar o PDF. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  if (isEditing) {
    return <QuoteForm onQuoteGenerated={handleQuoteGenerated} initialData={currentQuote} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {!currentQuote ? (
        <QuoteForm onQuoteGenerated={handleQuoteGenerated} />
      ) : (
        <div className="space-y-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tipo de Documento:</Label>
                <RadioGroup
                  value={documentType}
                  onValueChange={(value: 'orcamento' | 'recibo') => {
                    setDocumentType(value);
                    setCurrentQuote({ ...currentQuote, documentType: value });
                  }}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="orcamento" id="orcamento" />
                    <Label htmlFor="orcamento">Orçamento</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recibo" id="recibo" />
                    <Label htmlFor="recibo">Recibo de Pagamento</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Editar Orçamento
                </Button>
                <Button onClick={() => setCurrentQuote(null)} variant="outline">
                  Criar Novo Orçamento
                </Button>
                <Button onClick={downloadPDF}>
                  Baixar PDF
                </Button>
              </div>
            </div>
          </div>
          <QuotePDF ref={pdfRef} quote={currentQuote} />
        </div>
      )}
    </div>
  );
};

export default Index;