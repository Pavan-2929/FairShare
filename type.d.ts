import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    previousAutoTable: { finalY: number } | null;
  }
}