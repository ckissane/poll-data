import {parse} from "@vanillaes/csv/index.js";
/**
 * Copyright (C) 2020 Center for Computer Research in Music and Acoustics
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 **/

/**
 * @typedef {object} M15NCSVData
 * @property {object} metadata
 * @property {object} metadata.skipped The number of skipped rows while sanitizing
 * @property {object} metadata.columns The number of columns in payload
 * @property {object} metadata.rows The number of rows in payload
 * @property {array} metadata.maxValues Max values for each column
 * @property {array} metadata.minValues Min values for each column
 * @property {array} payload Data array (1D or 2D)
 */

/**
 * Loads a CSV file and returns a JS object with sanitized numeric data.
 * @param {string} url An URL for a CSV file
 * @param {object} formatOptions Various options for data parsing/sanitizing
 * @param {number!} formatOptions.columns The number of columns
 * @param {boolean} formatOptions.normalize Flag for normalization. (0.0 ~ 1.0)
 * @param {array<any>} formatOptions.ignore Values to ignore.
 * @returns {M15NCSVData}
 */
const loadCSV = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  return parse(text);
  // const rows = text.split("\n");

  // for (let i = 0; i < rows.length; ++i) {
  //   const row = rows[i].split(",");

  //   if (row.length != formatOptions.columns) {
  //     console.log(
  //       `[loadCSV] The number of columns mismatches. ` +
  //         `Got ${row.length} when ${formatOptions.columns} is expected. (row ${i})`
  //     );
  //     metadata.skipped++;
  //     continue;
  //   }

  //   let isRowValid = true;
  //   for (let column = 0; column < row.length; ++column) {
  //     // Checks if a value is Number or Date. A row will be skipped
  //     // if any invalid value is found.
  //     let value = Number(row[column]);
  //     if (isNaN(value)) {
  //       value = new Date(row[column]).getTime();
  //     }
  //     if (isNaN(value)) {
  //       value = row[column];
  //     }
  //     // if (isNaN(value)) {
  //     //   isRowValid = false;
  //     //   console.log(
  //     //     `[loadCSV] The row data ("${row[column]}") ` +
  //     //       `is neither Number or Date. (row ${i})`
  //     //   );
  //     //   break;
  //     // }
  //     if (ignore.includes(value)) {
  //       isRowValid = false;
  //       console.log(
  //         `[loadCSV] The row data ("${row[column]}") ` +
  //           `is ignored per format option. (row ${i})`
  //       );
  //       break;
  //     }
  //     row[column] = value;
  //   }
  //   if (isRowValid) {
  //     payload.push(row);
  //     for (let column = 0; column < row.length; ++column) {
  //       const value = row[column];
  //       metadata.maxValues[column] =
  //         metadata.maxValues[column] === null
  //           ? value
  //           : Math.max(value, metadata.maxValues[column]);
  //       metadata.minValues[column] =
  //         metadata.minValues[column] === null
  //           ? value
  //           : Math.min(value, metadata.minValues[column]);
  //     }
  //   } else {
  //     metadata.skipped++;
  //   }
  // }

  // metadata.rows = payload.length;

  // if (formatOptions.normalize) {
  //   for (let column = 0; column < formatOptions.columns; ++column) {
  //     let max = metadata.maxValues[column];
  //     let min = metadata.minValues[column];
  //     let range = max - min;
  //     for (let row = 0; row < payload.length; ++row) {
  //       let value = payload[row][column];
  //       payload[row][column] = (value - min) / range;
  //     }
  //   }
  // }

  // return { payload, metadata };
};

export default loadCSV;
