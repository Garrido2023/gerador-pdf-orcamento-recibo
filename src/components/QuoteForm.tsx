import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { ref, push, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface QuoteFormProps {
  onQuoteGenerated: (quote: any) => void;
  initialData?: {
    clientName: string;
    clientPhone: string;
    items: QuoteItem[];
    notes: string;
    companyData: CompanyData;
  };
}

const QuoteForm = ({ onQuoteGenerated, initialData }: QuoteFormProps) => {
  const { toast } = useToast();
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([{ description: '', quantity: 1, price: 0 }]);
  const [notes, setNotes] = useState('');
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    phone: '',
    address: '',
    cnpj: '',
  });

  useEffect(() => {
    if (initialData) {
      setClientName(initialData.clientName);
      setClientPhone(initialData.clientPhone);
      setItems(initialData.items);
      setNotes(initialData.notes);
      setCompanyData(initialData.companyData);
    }
  }, [initialData]);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const quoteData = {
      clientName,
      clientPhone,
      items,
      notes,
      total: calculateTotal(),
      date: new Date().toISOString(),
      companyData,
    };

    try {
      const quoteRef = ref(db, 'quotes');
      await push(quoteRef, quoteData);
      onQuoteGenerated(quoteData);
      toast({
        title: "Orçamento Salvo",
        description: initialData ? "Orçamento atualizado com sucesso!" : "Orçamento foi salvo com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar orçamento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full mx-auto quote-form-appear">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Criar Novo Orçamento</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="client">Dados do Cliente</TabsTrigger>
            <TabsTrigger value="company">Dados da Empresa</TabsTrigger>
          </TabsList>

          <TabsContent value="client">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nome do Cliente</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Celular</Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    required
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Itens</h3>
                  <Button type="button" onClick={addItem} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>
                
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                      <Label>Descrição</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label>Preço</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                          required
                        />
                      </div>
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="mt-6"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-semibold">
                  Total: R$ {calculateTotal().toFixed(2)}
                </div>
                <Button type="submit" size="lg">
                  Gerar Orçamento
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="company">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Telefone</Label>
                  <Input
                    id="companyPhone"
                    type="tel"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                    required
                    placeholder="(00) 0000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Endereço</Label>
                  <Input
                    id="companyAddress"
                    value={companyData.address}
                    onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyCNPJ">CNPJ</Label>
                  <Input
                    id="companyCNPJ"
                    value={companyData.cnpj}
                    onChange={(e) => setCompanyData({...companyData, cnpj: e.target.value})}
                    required
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default QuoteForm;
