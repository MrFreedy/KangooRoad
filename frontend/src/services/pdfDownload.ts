import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from "@assets/logo-dark.svg"

const ratingToStars = (v: number) => {
  const n = Math.max(0, Math.min(5, Math.floor(v)));
  return "★★★★★☆☆☆☆☆".slice(5 - n, 10 - n);
};

const valToText = (val: unknown) => {
  if (Array.isArray(val)) return val.join(", ");
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return val ? "Oui" : "Non";
  return (val ?? "-").toString();
};

export const downloadFeedbackPdf = (fb: any) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  let y = 52;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`Feedback #${fb.id}`, marginX, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const quickInfos = [
    fb.lastname || fb.firstname ? `Nom : ${fb.lastname ?? "-"}  |  Prénom : ${fb.firstname ?? "-"}` : "",
    fb.email ? `Email : ${fb.email}` : "",
    fb.user_type ? `Statut : ${fb.user_type}` : "",
    (fb.city || fb.country) ? `Lieu : ${fb.city ?? "-"}, ${fb.country ?? "-"}` : "",
    fb.school ? `École : ${fb.school}` : "",
    fb.year ? `Année : ${fb.year}` : "",
    typeof fb.is_contact === "boolean" ? `Contactable : ${fb.is_contact ? "Oui" : "Non"}` : "",
    fb.submissionDate ? `Date de soumission : ${fb.submissionDate}` : "",
  ].filter(Boolean);

  quickInfos.forEach((line) => {
    doc.text(line, marginX, y);
    y += 16;
  });

  doc.setDrawColor(200);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 16;

    fb.form_data.forEach((step: any, stepIndex: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    const title = `${step.stepLabel}`;
    const splitTitle = doc.splitTextToSize(title, pageWidth - marginX * 2);
    doc.text(splitTitle, marginX, y);

    y += splitTitle.length * 14;

    const rows: any[] = [];

    step.questions.forEach((q: any) => {
      if (q.type === "dynamic") {
        rows.push([{ content: q.label, styles: { fontStyle: "bold" } }, { content: "" }]);
        if (!q.value || q.value.length === 0) {
          rows.push(["—", "Aucune entrée"]);
        } else {
          q.value.forEach((entry: any, idx: number) => {
            rows.push([{ content: `Entrée #${idx + 1}`, styles: { fontStyle: "italic" } }, { content: "" }]);
            Object.entries(entry).forEach(([subLabel, field]: any) => {
              const v = field.type === "rating"
                ? `${ratingToStars(Number(field.value))} (${field.value})`
                : valToText(field.value);
              rows.push([subLabel, v]);
            });
          });
        }
      } else {
        let answer: string;
        if (q.type === "rating") {
          const num = typeof q.value === "number" ? q.value : parseInt(String(q.value || 0), 10);
          answer = `${ratingToStars(num)} (${num})`;
          if (q.ratingOption) answer += ` — ${q.ratingOption}`;
        } else if (q.type === "checkbox" || q.type === "select-one") {
          answer = q.option ? `${valToText(q.value)} — ${q.option}` : valToText(q.value);
        } else {
          answer = valToText(q.value);
        }
        rows.push([q.label, answer]);
        if (q.details) {
          rows.push(["Détails", valToText(q.details)]);
        }
      }
    });

    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      styles: { fontSize: 10, cellPadding: 6, overflow: "linebreak" },
      headStyles: { fillColor: [245, 245, 245], textColor: 20, lineWidth: 0.3 },
      bodyStyles: { lineWidth: 0.3 },
      theme: "grid",
      head: [["Question", "Réponse"]],
      body: rows,
      didDrawPage: () => {
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(`Feedback #${fb.id}`, marginX, 24);
        doc.text(String(doc.getCurrentPageInfo().pageNumber), pageWidth - marginX, 24, { align: "right" });
      },
    });

    y = (doc as any).lastAutoTable.finalY + 18;

    if (stepIndex !== fb.form_data.length - 1) {
      doc.setDrawColor(230);
      doc.line(marginX, y - 8, pageWidth - marginX, y - 8);
    }
  });

  doc.save(`feedback_${fb.school}_${fb.year}.pdf`);
};