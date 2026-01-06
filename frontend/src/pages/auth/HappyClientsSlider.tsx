import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

// ✅ YOUR WORKING LINK IS HERE
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQSWCjbQBxauMm3Tg_CLIXBOdAUPktEzsB_ibDrhPN6vlXEor4e0TR5bAfWlPantY-L_BpZlea8e2Ki/pub?output=csv";

// OPTIONAL: Add your Google Form link here if you want a "Partner with Us" button
const GOOGLE_FORM_URL = "https://forms.google.com/your-form-id-here"; 

interface ClientData {
  id: string;
  name: string;
  city: string;
  logoUrl: string;
  website?: string;
}

const HappyClientsSlider: React.FC = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        const csvText = await response.text();
        console.log('[HappyClientsSlider] fetched CSV length:', csvText.length);

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            const parsedClients: ClientData[] = [];

            console.log('[HappyClientsSlider] parsed rows:', results?.data?.length);
            console.log('[HappyClientsSlider] csv headers:', Object.keys(results.data[0] || {}));

            // Robust key detection for fields (handle header case/name variations)
            const firstRowKeys = Object.keys(results.data[0] || {});
            const logoKey = firstRowKeys.find(k => k.toLowerCase().includes('logo')) || 'Upload School Logo';
            const nameKey = firstRowKeys.find(k => k.toLowerCase().includes('school') || k.toLowerCase().includes('institution')) || 'School / Institution Name';
            const cityKey = firstRowKeys.find(k => k.toLowerCase().includes('city')) || 'City';
            const websiteKey = firstRowKeys.find(k => k.toLowerCase().includes('web') || k.toLowerCase().includes('site')) || 'Official Website';

            results.data.forEach((row: any, index: number) => {
              // 1. Include any row that has an uploaded logo link
              const driveLinkRaw = (row[logoKey] ?? row['Upload School Logo'] ?? '').toString();
              console.log(`[HappyClientsSlider] row ${index} driveLinkRaw:`, driveLinkRaw);
              // Support both query id=... and /d/<id>/ formats
              const idMatch = driveLinkRaw.match(/id=([a-zA-Z0-9_-]+)/) || driveLinkRaw.match(/\/d\/([a-zA-Z0-9_-]+)\//);
              console.log(`[HappyClientsSlider] row ${index} idMatch:`, idMatch);

              if (idMatch && idMatch[1]) {
                const directImageUrl = `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w400`;

                parsedClients.push({
                  id: `client-${index}`,
                  name: (row[nameKey] ?? row['School / Institution Name'] ?? '').toString(),
                  city: (row[cityKey] ?? row['City'] ?? '').toString(),
                  logoUrl: directImageUrl,
                  website: (row[websiteKey] ?? row['Official Website'] ?? '').toString()
                });
              }
            });

            console.log('[HappyClientsSlider] clients found:', parsedClients.length);
            console.log('[HappyClientsSlider] sample clients:', parsedClients.slice(0,5));
            setClients(parsedClients);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error fetching happy clients:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return null; 
  if (clients.length === 0) return null;

  return (
    <section className="w-full bg-slate-50 py-16 overflow-hidden">
      <div className="container mx-auto px-6 mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Our Happy Clients</h2>
        <p className="text-slate-500 mt-2 mb-6">Trusted by {clients.length}+ future-ready institutions</p>
        
      </div>

      {/* Slider Container */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />

        <div className="flex items-center gap-12 animate-infinite-scroll hover:paused group w-max">
          {/* Original List */}
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
          {/* Duplicate List for Loop */}
          {clients.map((client) => (
            <ClientCard key={`${client.id}-duplicate`} client={client} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ClientCard = ({ client }: { client: ClientData }) => (
  <div 
    className="
      flex flex-col items-center justify-center 
      w-40 h-40 md:w-48 md:h-48 
      bg-white rounded-xl shadow-sm border border-slate-100 
      p-4 transition-all duration-300
      grayscale hover:grayscale-0 hover:scale-105 hover:shadow-md
      flex-shrink-0 cursor-pointer
    "
    title={`${client.name} - ${client.city}`}
  >
    <img 
      src={client.logoUrl} 
      alt={client.name} 
      className="max-w-full max-h-24 object-contain mb-3"
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Client'; 
      }}
    />
    <div className="text-center">
      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{client.name}</h4>
      <p className="text-[10px] text-slate-500 uppercase">{client.city}</p>
    </div>
  </div>
);

export default HappyClientsSlider;