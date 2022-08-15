import * as Excel from "exceljs";
import { readFileSync } from "fs";
import { pathExistsSync, mkdir } from "fs-extra";

export interface IExcelHeader {
  key: string;
  header: string;
  width?: number;
}

export const CreateExcel = async <T extends Object[]>(
  items: T,
  headers: IExcelHeader[],
  filename?: string,
  sheetName: string = "P1",
  autoWidth: boolean = true
) => {
  const book = new Excel.Workbook();
  book.creator = "Octopy";
  let fileName = filename;
  const dt = new Date();
  if (!fileName) {
    fileName = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDay()}`;
  }
  book.created = dt;
  book.title = fileName;
  const sheet = book.addWorksheet(sheetName);
  sheet.pageSetup = {
    horizontalCentered: true,
    verticalCentered: true,
  };
  sheet.columns = headers;

  sheet.eachColumnKey((column, key) => {
    column.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    column.font = { bold: true };
  });

  items.forEach((item) => {
    const row = sheet.addRow(item);
    row.eachCell({ includeEmpty: true }, (cell, index) => {
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.font = { bold: false };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  if (autoWidth) {
    sheet.columns.forEach((column) => {
      if (column?.values) {
        const lengths = column.values.map((v) => {
          v = v ? v : "";
          return v.toString().length;
        });
        const maxLength = Math.max(...lengths.filter((v) => typeof v === "number"));
        column.width = maxLength;
      }
    });
  }

  const rootDir = "/tmp/";

  if (!pathExistsSync(rootDir)) {
    mkdir(rootDir);
  }
  const outputPath = rootDir + fileName! + ".xlsx";

  await book.xlsx.writeFile(outputPath);
  return readFileSync(outputPath);
};
