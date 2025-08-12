import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface QuoteItem {
  description: string;
  quantity: number;
  price: number;
}

interface CompanyData {
  name: string;
  phone: string;
  address: string;
  cnpj: string;
}

interface QuoteData {
  clientName: string;
  clientPhone: string;
  items: QuoteItem[];
  notes: string;
  total: number;
  date: string;
  companyData: CompanyData;
  documentType?: 'orcamento' | 'recibo';
}

const QuotePDF = React.forwardRef<HTMLDivElement, { quote: QuoteData }>(({ quote }, ref) => {
  const documentTitle = quote.documentType === 'recibo' ? 'RECIBO DE PAGAMENTO' : 'ORÇAMENTO';
  return (
    <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">EKIPHELP</h1>
        <p className="text-gray-600">{documentTitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Dados do Cliente:</h2>
          <p className="text-gray-700">{quote.clientName}</p>
          <p className="text-gray-700">{quote.clientPhone}</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold mb-2">Data:</h2>
          <p className="text-gray-700">
            {new Date(quote.date).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Dados da Empresa:</h2>
        <p className="text-gray-700">{quote.companyData.name}</p>
        <p className="text-gray-700">{quote.companyData.phone}</p>
        <p className="text-gray-700">{quote.companyData.address}</p>
        <p className="text-gray-700">CNPJ: {quote.companyData.cnpj}</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left">Descrição</th>
                <th className="px-4 py-2 text-right">Quantidade</th>
                <th className="px-4 py-2 text-right">Preço</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2 text-right">{item.quantity}</td>
                  <td className="px-4 py-2 text-right">R$ {item.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">
                    R$ {(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="flex justify-end mb-8">
        <div className="text-right">
          <p className="text-lg font-semibold">
            Total: R$ {quote.total.toFixed(2)}
          </p>
        </div>
      </div>

      {quote.notes && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Observações:</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
        </div>
      )}

      <div className="text-center text-sm text-gray-600 mt-16">
        <p>Agradecemos a preferência!</p>
        <p>EKIPHELP - Serviços Profissionais</p>
      </div>
    </div>
  );
});

QuotePDF.displayName = 'QuotePDF';

export default QuotePDF;