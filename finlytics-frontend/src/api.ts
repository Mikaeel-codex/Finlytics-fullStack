const API_BASE = "http://127.0.0.1:8000";

export async function uploadStatement(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status}`);
  }

  const data = await res.json();
  return data as {
    count: number;
    moneyIn: any[];
    moneyOut: any[];
    other: any[];
    raw: any[];
    ocrEnabled?: boolean;
  };
}
