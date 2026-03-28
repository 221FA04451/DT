export interface Simulation {
  id: string;
  patientId: string;
  drug: string;
  dose: string;
  duration: string;
  status: "Pending" | "Processing" | "Complete";
}
