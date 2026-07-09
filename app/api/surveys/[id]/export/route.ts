import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { getSession } from "@/lib/auth";
import { getResponses, getSurvey } from "@/lib/surveys";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function safeFilename(title: string) {
  return title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  const result = await getSurvey(id);
  if (!result || result.survey.userId !== user.id) {
    return NextResponse.json({ error: "Survey not found." }, { status: 404 });
  }

  const format = request.nextUrl.searchParams.get("format") ?? "csv";
  const responses = await getResponses(id);
  const header = ["Submitted at", ...result.questions.map((q) => q.text)];
  const rows = responses.map((response) => {
    const answerByQuestion = new Map(response.answers.map((a) => [a.questionId, a.value]));
    return [response.createdAt, ...result.questions.map((q) => answerByQuestion.get(q.id) ?? "")];
  });
  const filename = safeFilename(result.survey.title);

  if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Responses");
    sheet.addRow(header).font = { bold: true };
    rows.forEach((row) => sheet.addRow(row));
    sheet.columns.forEach((column) => {
      column.width = 28;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}-responses.xlsx"`,
      },
    });
  }

  if (format === "pdf") {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({ margin: 50 });
    doc.on("data", (chunk) => chunks.push(chunk));
    const done = new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    doc.fontSize(20).text(result.survey.title, { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor("#555").text(result.survey.description || "Survey report");
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor("#000").text(`Total responses: ${responses.length}`);
    doc.moveDown();

    responses.forEach((response, index) => {
      doc
        .fontSize(13)
        .fillColor("#111")
        .text(`Response ${index + 1} — ${new Date(response.createdAt).toLocaleString()}`);
      doc.moveDown(0.2);

      const answerByQuestion = new Map(response.answers.map((a) => [a.questionId, a.value]));
      result.questions.forEach((question) => {
        doc.fontSize(10).fillColor("#444").text(question.text);
        doc
          .fontSize(11)
          .fillColor("#000")
          .text(answerByQuestion.get(question.id) ?? "(no answer)", { indent: 10 });
        doc.moveDown(0.3);
      });

      doc.moveDown(0.5);
      if (index < responses.length - 1) doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#ddd").stroke();
      doc.moveDown(0.5);
    });

    doc.end();
    const pdfBuffer = await done;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}-report.pdf"`,
      },
    });
  }

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}-responses.csv"`,
    },
  });
}
