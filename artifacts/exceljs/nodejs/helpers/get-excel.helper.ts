import * as Excel from "exceljs";
import { downloadFile } from "@octopy/serverless-core";

export interface IReadExcel {
  key: string;
  title: string;
  index?: string;
}

export const GetExcel = async (
  filePath: string,
  headers: IReadExcel[],
  worksheet_number: number = 1
) => {
  let workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(worksheet_number);
  const head = headers.map((items) => {
    return items.title;
  });
  const items: any[] = [];
  worksheet.getRow(1).eachCell((c) => {
    const index = head.findIndex((title) => title === c.value?.toString());
    if (index >= 0) headers[index].index = c.col;
  });
  worksheet.getRows(2, worksheet.rowCount)?.map((row) => {
    let line = "{";
    headers.map((item) => {
      if (item.index) {
        const c_val = row.getCell(item.index).hyperlink
          ? row.getCell(item.index).hyperlink.split(":")[1]
          : row.getCell(item.index).value?.toString();
        if (c_val) {
          line += `"${item.key}":"${c_val}",`;
        }
      }
    });
    if (line.length > 1) {
      line = line.slice(0, -1) + "}";
      items.push(JSON.parse(line));
    }
  });
  return items;
};
