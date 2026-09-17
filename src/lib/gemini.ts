export interface ParsedReceipt {
  amount: number;
  merchant: string;
  date: string;
  category: string;
  items: string;
}

export async function analyzeReceipt(base64Image: string, mimeType: string): Promise<ParsedReceipt> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key Gemini tidak ditemukan.");

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
    Analisis struk belanja ini dan ekstrak datanya ke dalam JSON murni.
    Format JSON:
    {
      "amount": number (total akhir),
      "merchant": "nama toko",
      "date": "YYYY-MM-DD",
      "category": "pilih satu: Makanan & Minuman, Transportasi, Belanja & Kebutuhan, Hiburan, Kesehatan, Lainnya",
      "items": "ringkasan 2-3 barang utama"
    }
    Hasilkan HANYA JSON, jangan ada teks penjelasan lain.
  `;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: base64Image.split(',')[1] } }
        ]
      }]
    })
  });

  const result = await response.json();
  const rawText = result.candidates[0].content.parts[0].text;
  return JSON.parse(rawText.replace(/```json|```/g, '')) as ParsedReceipt;
}