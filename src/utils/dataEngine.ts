import {
  DatasetInfo,
  ColumnMetadata,
  FieldType,
  DescriptiveStats,
  NumericStats,
  CategoricalStats,
  DataQualityReport,
  AnomalyRecord,
  ChartRecommendation,
} from '../types';

/**
 * Checks if a string can be reasonably parsed as a date.
 */
function isDateString(val: any): boolean {
  if (val === null || val === undefined) return false;
  if (typeof val === 'number') {
    // Large timestamps or years could confuse us; ignore plain numbers
    return false;
  }
  const str = String(val).trim();
  if (str.length < 6 || str.length > 30) return false;

  // Reject plain numeric blocks
  if (/^\d+$/.test(str)) return false;

  const timestamp = Date.parse(str);
  if (isNaN(timestamp)) return false;

  // Check if year is reasonable (e.g. 1900 to 2100)
  const d = new Date(timestamp);
  const yr = d.getFullYear();
  return yr > 1900 && yr < 2100;
}

/**
 * Detect the likely field type of a column based on its values.
 */
function inferFieldType(colName: string, values: any[]): FieldType {
  const normName = colName.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Identifiers check
  if (
    normName === 'id' ||
    normName.endsWith('id') ||
    normName === 'uuid' ||
    normName === 'code' ||
    normName.endsWith('code') ||
    normName === 'pk' ||
    normName === 'key'
  ) {
    return 'identifier';
  }

  // Sample non-null values
  const nonNulls = values.filter((v) => v !== null && v !== undefined && v !== '');
  if (nonNulls.length === 0) return 'text';

  // 2. Check for dates
  const dateScore = nonNulls.filter((v) => isDateString(v)).length / nonNulls.length;
  if (dateScore > 0.75) {
    return 'date';
  }

  // 3. Check for numeric
  const numericCount = nonNulls.filter((v) => {
    if (typeof v === 'number' && !isNaN(v)) return true;
    const s = String(v).replace(/[\$,%]/g, '').trim();
    if (s === '') return false;
    return !isNaN(Number(s));
  }).length;

  const numericScore = numericCount / nonNulls.length;
  if (numericScore > 0.85) {
    // If it's all unique serial integers, it could be an identifier rather than numeric
    const uniques = new Set(nonNulls.map(v => Number(String(v).replace(/[\$,%]/g, ''))));
    if (uniques.size === nonNulls.length && nonNulls.every(v => Number.isInteger(Number(String(v).replace(/[\$,%]/g, ''))))) {
      // If numbers span narrow sequential values, e.g., index
      if (Math.max(...Array.from(uniques)) - Math.min(...Array.from(uniques)) === nonNulls.length - 1) {
        return 'identifier';
      }
    }
    return 'numeric';
  }

  // 4. Categorical vs Text check
  const uniqueVals = new Set(nonNulls.map((v) => String(v).trim()));
  const uniqueRatio = uniqueVals.size / nonNulls.length;

  // Low unique counts indicate categories
  if (uniqueRatio < 0.2 || uniqueVals.size <= 20) {
    return 'categorical';
  }

  // Text length check
  const avgLength = nonNulls.reduce((sum, v) => sum + String(v).length, 0) / nonNulls.length;
  if (avgLength > 50) {
    return 'text';
  }

  return 'categorical';
}

/**
 * Extracts schema and basic size statistics.
 */
export function profileDataset(filename: string, rawRows: any[], sizeBytes: number): { dataset: DatasetInfo; rows: any[] } {
  const rowCount = rawRows.length;
  if (rowCount === 0) {
    throw new Error('Dataset is empty');
  }

  // Collect all unique column names
  const allKeys = new Set<string>();
  rawRows.forEach((row) => {
    if (row && typeof row === 'object') {
      Object.keys(row).forEach((k) => allKeys.add(k));
    }
  });
  const columnNames = Array.from(allKeys);

  const columns: ColumnMetadata[] = columnNames.map((colName) => {
    const colValues = rawRows.map((row) => row[colName]);
    const missingCount = colValues.filter((v) => v === null || v === undefined || String(v).trim() === '').length;
    const uniqueValues = Array.from(new Set(colValues.filter((v) => v !== null && v !== undefined && String(v).trim() !== '').map(v => String(v).trim())));

    const sampleValues = colValues
      .filter((v) => v !== null && v !== undefined && String(v).trim() !== '')
      .slice(0, 10);

    const type = inferFieldType(colName, colValues);

    return {
      name: colName,
      type,
      missingCount,
      missingPercentage: (missingCount / rowCount) * 100,
      uniqueCount: uniqueValues.length,
      sampleValues,
    };
  });

  // Clean data records typed cleanly
  const typedRows = rawRows.map((row) => {
    const cleanRow: any = {};
    columns.forEach((col) => {
      const rawVal = row[col.name];
      if (rawVal === null || rawVal === undefined || String(rawVal).trim() === '') {
        cleanRow[col.name] = null;
      } else if (col.type === 'numeric') {
        const cleanedStr = String(rawVal).replace(/[\$,%]/g, '').trim();
        cleanRow[col.name] = isNaN(Number(cleanedStr)) ? null : Number(cleanedStr);
      } else if (col.type === 'date') {
        try {
          const parsedDate = new Date(rawVal);
          if (!isNaN(parsedDate.getTime())) {
            cleanRow[col.name] = parsedDate.toISOString();
          } else {
            cleanRow[col.name] = String(rawVal).trim();
          }
        } catch {
          cleanRow[col.name] = String(rawVal).trim();
        }
      } else {
        cleanRow[col.name] = String(rawVal).trim();
      }
    });
    return cleanRow;
  });

  return {
    dataset: {
      filename,
      rowCount,
      columnCount: columns.length,
      sizeBytes,
      columns,
    },
    rows: typedRows,
  };
}

/**
 * Computes math and statistical summaries for all columns.
 */
export function computeStats(dataset: DatasetInfo, rows: any[]): DescriptiveStats {
  const numeric: NumericStats[] = [];
  const categorical: CategoricalStats[] = [];

  dataset.columns.forEach((col) => {
    const vals = rows.map((r) => r[col.name]).filter((v) => v !== null && v !== undefined);

    if (col.type === 'numeric') {
      const numVals = vals as number[];
      if (numVals.length === 0) return;

      const sorted = [...numVals].sort((a, b) => a - b);
      const sum = sorted.reduce((a, b) => a + b, 0);
      const mean = sum / sorted.length;
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const median = sorted[Math.floor(sorted.length / 2)];

      // IQR components
      const q1Index = Math.floor(sorted.length * 0.25);
      const q3Index = Math.floor(sorted.length * 0.75);
      const q1 = sorted[q1Index];
      const q3 = sorted[q3Index];

      // Variance & StdDev
      const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sorted.length;
      const stdDev = Math.sqrt(variance);

      numeric.push({
        name: col.name,
        mean,
        median,
        min,
        max,
        stdDev,
        q1,
        q3,
      });
    } else {
      // Categorical / Textile / Identifiers
      const stringVals = vals.map((v) => String(v));
      const freqMap: { [key: string]: number } = {};
      stringVals.forEach((v) => {
        freqMap[v] = (freqMap[v] || 0) + 1;
      });

      const total = stringVals.length;
      const frequencies = Object.keys(freqMap)
        .map((k) => ({
          value: k,
          count: freqMap[k],
          percentage: total > 0 ? (freqMap[k] / total) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15); // Top 15 categories

      categorical.push({
        name: col.name,
        uniqueCount: col.uniqueCount,
        frequencies,
      });
    }
  });

  return { numeric, categorical };
}

/**
 * Calculates a complete Pearson correlation matrix for numerical attributes.
 */
export function calculateCorrelation(numericCols: string[], rows: any[]): { [key: string]: { [key: string]: number } } {
  const matrix: { [key: string]: { [key: string]: number } } = {};

  numericCols.forEach((colA) => {
    matrix[colA] = {};
    numericCols.forEach((colB) => {
      // Compute pairs where both exist
      const pairs = rows
        .map((r) => [r[colA], r[colB]])
        .filter(([a, b]) => a !== null && b !== null && a !== undefined && b !== undefined) as [number, number][];

      if (colA === colB) {
        matrix[colA][colB] = 1;
        return;
      }

      if (pairs.length < 2) {
        matrix[colA][colB] = 0;
        return;
      }

      const meanA = pairs.reduce((sum, [a, b]) => sum + a, 0) / pairs.length;
      const meanB = pairs.reduce((sum, [a, b]) => sum + b, 0) / pairs.length;

      let num = 0;
      let denA = 0;
      let denB = 0;

      pairs.forEach(([a, b]) => {
        const diffA = a - meanA;
        const diffB = b - meanB;
        num += diffA * diffB;
        denA += diffA * diffA;
        denB += diffB * diffB;
      });

      const denominator = Math.sqrt(denA * denB);
      matrix[colA][colB] = denominator === 0 ? 0 : Number((num / denominator).toFixed(4));
    });
  });

  return matrix;
}

/**
 * Determines the Data Quality Report and calculates an objective health score (0-100).
 */
export function auditDataQuality(dataset: DatasetInfo, rows: any[], numericStats: NumericStats[]): DataQualityReport {
  const qualityIssues: DataQualityReport['qualityIssues'] = [];
  const totalRows = dataset.rowCount;

  let totalCells = totalRows * dataset.columnCount;
  let totalMissingCells = 0;
  let duplicateCount = 0;

  // 1. Missing Values check
  dataset.columns.forEach((col) => {
    totalMissingCells += col.missingCount;
    if (col.missingPercentage > 15) {
      qualityIssues.push({
        column: col.name,
        type: 'warning',
        message: `Column is missing ${col.missingPercentage.toFixed(1)}% of values.`,
        recommendation: `Impute missing rows using the media/mode cleaner or consider omitting if it exceeds 40%.`,
      });
    } else if (col.missingPercentage > 0) {
      qualityIssues.push({
        column: col.name,
        type: 'info',
        message: `Column has some missing values (${col.missingPercentage.toFixed(1)}%).`,
        recommendation: `Run cleaning to auto-fill with the median or categorical mode.`,
      });
    }
  });

  // 2. Duplicate rows check
  const stringifiedRows = rows.map((r) => JSON.stringify(r));
  const seenRows = new Set<string>();
  stringifiedRows.forEach((r) => {
    if (seenRows.has(r)) {
      duplicateCount++;
    } else {
      seenRows.add(r);
    }
  });

  if (duplicateCount > 0) {
    qualityIssues.push({
      type: 'critical',
      message: `Found ${duplicateCount} duplicate records inside the dataset.`,
      recommendation: `Execute "Remove Duplicates" to keep unique transaction data only.`,
    });
  }

  // 3. Outliers check (univariate Z-score)
  let outlierTotalCount = 0;
  numericStats.forEach((stat) => {
    const colVals = rows.map((r) => r[stat.name]).filter((v) => v !== null) as number[];
    const colOutliers = colVals.filter((v) => {
      const z = Math.abs((v - stat.mean) / (stat.stdDev || 1));
      return z > 2.8;
    }).length;

    outlierTotalCount += colOutliers;
    if (colOutliers > 0) {
      const percentage = (colOutliers / totalRows) * 100;
      if (percentage > 5) {
        qualityIssues.push({
          column: stat.name,
          type: 'warning',
          message: `Variable "${stat.name}" contains ${colOutliers} extreme records (${percentage.toFixed(1)}% outliers).`,
          recommendation: `Use standard clipping (clamp to bounds) or drop extreme outliers to stabilize regression models.`,
        });
      }
    }
  });

  // 4. Inconsistent schema/types checks (e.g. numeric columns storing string text)
  let mismatchedTypesCount = 0;

  // Let's compute Health Score
  // Base 100. Deduct for missing values, duplicates, outliers, and issues.
  const missingPenalty = (totalMissingCells / (totalCells || 1)) * 100;
  const duplicatePenalty = (duplicateCount / totalRows) * 50;
  const outlierPenalty = Math.min((outlierTotalCount / totalRows) * 15, 15);

  let healthScore = Math.round(100 - missingPenalty - duplicatePenalty - outlierPenalty);
  healthScore = Math.max(0, Math.min(100, healthScore));

  if (healthScore > 85 && qualityIssues.length === 0) {
    qualityIssues.push({
      type: 'info',
      message: 'Dataset looks highly consistent and clinically healthy!',
      recommendation: 'Perfect condition. Proceed directly to insights or modeling.',
    });
  }

  return {
    healthScore,
    missingValuePercentage: totalCells > 0 ? (totalMissingCells / totalCells) * 100 : 0,
    duplicateCount,
    outlierCount: outlierTotalCount,
    mismatchedTypesCount,
    qualityIssues,
  };
}

/**
 * Perform one-click custom statistical data cleaning.
 */
export function cleanData(
  dataset: DatasetInfo,
  rows: any[],
  settings: {
    handleMissing: 'median' | 'mode' | 'remove' | 'none';
    removeDuplicates: boolean;
    handleOutliers: 'clip' | 'remove' | 'none';
  }
): { cleanedRows: any[]; actionsApplied: string[] } {
  let cleaned = [...rows];
  const actionsApplied: string[] = [];

  // Calculate statistics first to find medians and modes safely
  const numeric: { [col: string]: number } = {};
  const modes: { [col: string]: string } = {};

  // Compute stats lookup
  dataset.columns.forEach((col) => {
    const validVals = rows.map((r) => r[col.name]).filter((v) => v !== null && v !== undefined);
    if (col.type === 'numeric') {
      const sorted = [...(validVals as number[])].sort((a, b) => a - b);
      numeric[col.name] = sorted.length > 0 ? sorted[Math.floor(sorted.length / 2)] : 0;
    } else {
      const counts: { [k: string]: number } = {};
      let maxCount = 0;
      let modeVal = '';
      validVals.forEach((v) => {
        const key = String(v);
        counts[key] = (counts[key] || 0) + 1;
        if (counts[key] > maxCount) {
          maxCount = counts[key];
          modeVal = key;
        }
      });
      modes[col.name] = modeVal || 'Unknown';
    }
  });

  // 1. Remove duplicate lines
  if (settings.removeDuplicates) {
    const stringified = new Set<string>();
    const prevCount = cleaned.length;
    cleaned = cleaned.filter((row) => {
      const str = JSON.stringify(row);
      if (stringified.has(str)) return false;
      stringified.add(str);
      return true;
    });
    const removedNum = prevCount - cleaned.length;
    if (removedNum > 0) {
      actionsApplied.push(`Removed ${removedNum} duplicate rows.`);
    }
  }

  // 2. Handle missing details
  if (settings.handleMissing !== 'none') {
    if (settings.handleMissing === 'remove') {
      const prevCount = cleaned.length;
      cleaned = cleaned.filter((row) => {
        return !Object.values(row).some((val) => val === null || val === undefined || val === '');
      });
      const removedNum = prevCount - cleaned.length;
      if (removedNum > 0) {
        actionsApplied.push(`Dropped ${removedNum} rows with missing cells.`);
      }
    } else {
      let imputedCount = 0;
      cleaned = cleaned.map((row) => {
        const cleanRow = { ...row };
        dataset.columns.forEach((col) => {
          if (cleanRow[col.name] === null || cleanRow[col.name] === undefined || cleanRow[col.name] === '') {
            imputedCount++;
            if (col.type === 'numeric') {
              cleanRow[col.name] = numeric[col.name];
            } else {
              cleanRow[col.name] = modes[col.name];
            }
          }
        });
        return cleanRow;
      });
      if (imputedCount > 0) {
        actionsApplied.push(`Imputed ${imputedCount} missing cells using Median / Mode.`);
      }
    }
  }

  // 3. Handle outliers
  if (settings.handleOutliers !== 'none') {
    // Collect numeric stdDev and IQR boundaries
    const columnStats: { [col: string]: { mean: number; stdDev: number; q1: number; q3: number; iqr: number } } = {};
    dataset.columns.filter((c) => c.type === 'numeric').forEach((col) => {
      const list = cleaned.map((r) => r[col.name]).filter((v) => typeof v === 'number') as number[];
      if (list.length === 0) return;
      const sorted = [...list].sort((a, b) => a - b);
      const mean = sorted.reduce((a, b) => a + b, 0) / sorted.length;
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const iqr = q3 - q1;
      const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sorted.length;
      const stdDev = Math.sqrt(variance);
      columnStats[col.name] = { mean, stdDev, q1, q3, iqr };
    });

    if (settings.handleOutliers === 'remove') {
      const prevCount = cleaned.length;
      cleaned = cleaned.filter((row) => {
        return !Object.keys(columnStats).some((col) => {
          const val = row[col];
          if (val === null || val === undefined) return false;
          const stat = columnStats[col];
          const z = Math.abs((val - stat.mean) / (stat.stdDev || 1));
          return z > 3.0; // Filter rows with Z-score outlier > 3
        });
      });
      const removedNum = prevCount - cleaned.length;
      if (removedNum > 0) {
        actionsApplied.push(`Dropped ${removedNum} rows containing extreme univariate statistical outliers.`);
      }
    } else if (settings.handleOutliers === 'clip') {
      let clippedCount = 0;
      cleaned = cleaned.map((row) => {
        const cleanRow = { ...row };
        Object.keys(columnStats).forEach((col) => {
          const val = cleanRow[col];
          if (val === null || val === undefined) return;
          const stat = columnStats[col];
          const lowerLimit = stat.q1 - 1.5 * stat.iqr;
          const upperLimit = stat.q3 + 1.5 * stat.iqr;

          if (val < lowerLimit) {
            cleanRow[col] = Number(lowerLimit.toFixed(4));
            clippedCount++;
          } else if (val > upperLimit) {
            cleanRow[col] = Number(upperLimit.toFixed(4));
            clippedCount++;
          }
        });
        return cleanRow;
      });
      if (clippedCount > 0) {
        actionsApplied.push(`Clamped/Clipped ${clippedCount} numerical outliers using Interquartile Range (IQR) fence boundaries.`);
      }
    }
  }

  if (actionsApplied.length === 0) {
    actionsApplied.push('No cleaning changes were applied.');
  }

  return { cleanedRows: cleaned, actionsApplied };
}

/**
 * Automate visualization recommendation engine.
 * Generates exact charts for the dataset depending on dimensions.
 */
export function recommendCharts(dataset: DatasetInfo, numericColNames: string[]): ChartRecommendation[] {
  const recommendations: ChartRecommendation[] = [];

  const categoricals = dataset.columns.filter((c) => c.type === 'categorical' && c.uniqueCount > 1);
  const numerics = dataset.columns.filter((c) => c.type === 'numeric');
  const dates = dataset.columns.filter((c) => c.type === 'date');

  // Rule 1: Category + Numeric -> Bar Chart
  if (categoricals.length > 0 && numerics.length > 0) {
    const cat = categoricals[0].name;
    const num = numerics[0].name;
    recommendations.push({
      title: `Distribution of Average ${num} across ${cat}`,
      type: 'bar',
      xAxis: cat,
      yAxis: num,
      description: `Compares numerical value aggregates across key text categories to explore top performance values.`,
    });
  }

  // Rule 2: Date + Numeric -> Line Chart
  if (dates.length > 0 && numerics.length > 0) {
    const date = dates[0].name;
    const num = numerics[0].name;
    recommendations.push({
      title: `Temporal Trend of ${num} over ${date}`,
      type: 'line',
      xAxis: date,
      yAxis: num,
      description: `Illustrates historical fluctuations, seasonal cycles, or progression indicators across chronological indices.`,
    });
  }

  // Rule 3: Numeric + Numeric -> Scatter Plot
  if (numerics.length >= 2) {
    const numX = numerics[0].name;
    const numY = numerics[1].name;
    recommendations.push({
      title: `${numY} vs ${numX} Relationship Mapping`,
      type: 'scatter',
      xAxis: numX,
      yAxis: numY,
      description: `Examines statistical linear correlation, clustered densities, or independent distribution scatter patterns.`,
    });
  }

  // Rule 4: Single Numeric -> Histogram / Distribution
  if (numerics.length > 0) {
    const num = numerics[0].name;
    recommendations.push({
      title: `${num} Frequency Density Histogram`,
      type: 'histogram',
      xAxis: num,
      description: `Reveals the underlying probability distribution shape, skewness, and natural spread of data observations.`,
    });
  }

  // Rule 5: Correlation Mapping -> Heatmap
  if (numerics.length >= 3) {
    recommendations.push({
      title: `Pearson Correlation Heatmap Matrix`,
      type: 'heatmap',
      xAxis: 'Columns',
      yAxis: 'Columns',
      description: `Displays linear coefficient factors ranging from -1 to 1 between all numeric variables to reveal collinearity.`,
    });
  }

  // Ensure fallback
  if (recommendations.length === 0 && dataset.columns.length >= 2) {
    recommendations.push({
      title: `${dataset.columns[0].name} Frequency Map`,
      type: 'bar',
      xAxis: dataset.columns[0].name,
      description: `Summarized frequency metrics of unique occurrence codes.`,
    });
  }

  return recommendations;
}

/**
 * Computes direct local multi-attribute outlier anomalies.
 */
export function detectLocally(dataset: DatasetInfo, rows: any[], numericStats: NumericStats[]): AnomalyRecord[] {
  if (numericStats.length === 0) return [];

  // Calculate rows with highest combined absolute element-wise relative deviations.
  const anomalies: AnomalyRecord[] = [];

  rows.forEach((row, idx) => {
    let sumZScore = 0;
    let counted = 0;
    const features: { [key: string]: any } = {};

    numericStats.forEach((stat) => {
      const val = row[stat.name];
      if (val !== null && val !== undefined) {
        const z = Math.abs((val - stat.mean) / (stat.stdDev || 1));
        sumZScore += z;
        counted++;
      }
    });

    const finalScore = counted > 0 ? sumZScore / counted : 0;

    // Capture feature descriptors
    dataset.columns.forEach((col) => {
      features[col.name] = row[col.name];
    });

    if (finalScore > 2.2) {
      anomalies.push({
        rowIndex: idx + 1,
        features,
        score: Number(finalScore.toFixed(2)),
        explanation: `Index contains variable values that deviate significantly from average dataset behaviors, scoring Z-score ratio of ${finalScore.toFixed(2)}.`,
      });
    }
  });

  return anomalies.sort((a, b) => b.score - a.score).slice(0, 30); // Top 30 anomalies
}
