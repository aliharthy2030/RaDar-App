import { GoogleGenAI, Type } from "@google/genai";
import { AiAnalysisResult, DriverProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the logistics compliance bot
const SYSTEM_INSTRUCTION = `
You are an expert AI auditor for the Saudi Arabia National Logistics Platform (LogistiKSA). 
Your role is to analyze shipment data, detect tax evasion (ZATCA compliance), 
ensure adherence to Transport General Authority (TGA) regulations, and identify security risks.
You strictly enforce rules: Visit visas cannot drive trucks. Criminal records ban drivers. 
Unfit health bans drivers.
Always answer in JSON format when requested.
`;

export const analyzeShipmentCompliance = async (
  goodsDescription: string,
  origin: string,
  destination: string,
  declaredValue: number
): Promise<AiAnalysisResult> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Analyze this shipment for compliance risks in Saudi Arabia.
      Goods: ${goodsDescription}
      Origin: ${origin}
      Destination: ${destination}
      Declared Value: ${declaredValue} SAR
      
      Check for:
      1. Logic of route vs origin/destination.
      2. Potential undervaluation for tax evasion.
      3. Restricted goods check.
      
      Return JSON only.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            complianceIssues: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            estimatedTax: { type: Type.NUMBER, description: "Estimated VAT (15%) + Customs in SAR" }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AiAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      riskLevel: "High",
      complianceIssues: ["AI Service Unavailable - Manual Check Required"],
      recommendations: ["Verify documents manually"],
      estimatedTax: 0
    };
  }
};

export const verifyDriverEligibility = async (
  visaType: string,
  healthStatus: string,
  criminalRecord: string
): Promise<{ status: 'Eligible' | 'Banned', reason: string }> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Evaluate driver eligibility for commercial freight in Saudi Arabia based on TGA and Ministry of Interior rules.
      Visa Type: ${visaType}
      Health: ${healthStatus}
      Criminal Record: ${criminalRecord}
      
      STRICT RULES:
      1. Visit Visa (تأشيرة زيارة) is STRICTLY PROHIBITED for commercial driving. Immediate BAN.
      2. Transit Visa (عبور) is restricted to single trip transit only.
      3. Criminal Record (سوابق) leads to immediate BAN.
      4. Unfit Health (غير لائق) leads to immediate BAN.
      5. Only 'Resident' (Iqama) or 'Citizen' with 'Fit' health and 'Clean' record are ELIGIBLE.

      Return JSON with 'status' (Eligible/Banned) and 'reason' (Arabic text explaining the specific law violation).
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["Eligible", "Banned"] },
            reason: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text!) as { status: 'Eligible' | 'Banned', reason: string };
  } catch (e) {
    return { status: 'Banned', reason: 'Error connecting to verification system' };
  }
};

export const evaluateGateAccess = async (
  truckPlate: string,
  driverName: string,
  visaType: string
): Promise<{ allowed: boolean; message: string }> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      A truck is trying to enter a restricted logistics facility (Port/Factory).
      Truck Plate: ${truckPlate}
      Driver: ${driverName}
      Visa: ${visaType}

      Decide strictly:
      If Visa is 'Visit' -> DENY.
      If Truck Plate format is invalid (simulate logic) -> DENY.
      Otherwise -> ALLOW.

      Return JSON: { allowed: boolean, message: string (Arabic) }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            allowed: { type: Type.BOOLEAN },
            message: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text!) as { allowed: boolean; message: string };
  } catch (e) {
    return { allowed: false, message: "فشل الاتصال بالنظام المركزي" };
  }
};

export const verifyTruckCompliance = async (
  plate: string,
  chassis: string,
  insuranceExpiry: string,
  fahasExpiry: string,
  istimaraExpiry: string
): Promise<{ status: 'Active' | 'Banned', violation: string }> => {
  try {
    const model = "gemini-2.5-flash";
    const currentDate = new Date().toISOString().split('T')[0];
    const prompt = `
      Act as the Saudi Traffic Department (Muroor) API.
      Verify this truck for operational legality.
      Current Date: ${currentDate}
      
      Truck Data:
      - Plate: ${plate}
      - Chassis: ${chassis}
      - Insurance Expiry: ${insuranceExpiry}
      - Periodic Inspection (Fahas) Expiry: ${fahasExpiry}
      - Registration (Istimara) Expiry: ${istimaraExpiry}

      Rules:
      1. If ANY date is in the past (before ${currentDate}) -> BANNED.
      2. If Insurance is expired -> Reason: "تأمين منتهي"
      3. If Fahas is expired -> Reason: "فحص دوري منتهي"
      4. If Istimara is expired -> Reason: "استمارة منتهية"
      5. If all dates are valid -> ACTIVE.

      Return JSON: { status: "Active" | "Banned", violation: string (Arabic reason or "None") }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["Active", "Banned"] },
            violation: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text!) as { status: 'Active' | 'Banned', violation: string };
  } catch (e) {
    return { status: 'Banned', violation: "فشل الاتصال بمركز المعلومات الوطني" };
  }
};