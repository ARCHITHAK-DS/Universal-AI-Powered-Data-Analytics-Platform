export type FieldType = 'numeric' | 'categorical' | 'date' | 'identifier' | 'text';

export interface ColumnMetadata {
  name: string;
  type: FieldType;
  missingCount: number;
  missingPercentage: number;
  uniqueCount: number;
  sampleValues: any[];
}

export interface DatasetInfo {
  filename: string;
  rowCount: number;
  columnCount: number;
  sizeBytes: number;
  columns: ColumnMetadata[];
}

export interface NumericStats {
  name: string;
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
  q1: number;
  q3: number;
}

export interface CategoricalStats {
  name: string;
  uniqueCount: number;
  frequencies: { value: string; count: number; percentage: number }[];
}

export interface DescriptiveStats {
  numeric: NumericStats[];
  categorical: CategoricalStats[];
}

export interface DataQualityReport {
  healthScore: number;
  missingValuePercentage: number;
  duplicateCount: number;
  outlierCount: number;
  mismatchedTypesCount: number;
  qualityIssues: {
    column?: string;
    type: 'critical' | 'warning' | 'info';
    message: string;
    recommendation: string;
  }[];
}

export type DatasetDomain =
  | 'Retail'
  | 'Healthcare'
  | 'Banking'
  | 'Finance'
  | 'Education'
  | 'HR'
  | 'Manufacturing'
  | 'Insurance'
  | 'Generic';

export interface DomainDetection {
  domain: DatasetDomain;
  confidence: number;
  reasoning: string;
}

export interface DomainKPI {
  id: string;
  title: string;
  description: string;
  value: string | number;
  change?: string;
  type: 'numeric' | 'currency' | 'percentage' | 'text';
}

export interface AIInsight {
  id: string;
  insight: string;
  reasoning: string;
  confidenceScore: number; // 0 to 100
  impact: 'high' | 'medium' | 'low';
}

export interface AnomalyRecord {
  rowIndex: number;
  features: { [key: string]: any };
  score: number; // outlier rating
  explanation: string;
}

export interface MLRecommendation {
  task: string;
  recommendedModel: string;
  targetColumn?: string;
  reason: string;
  expectedOutput: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ChartRecommendation {
  title: string;
  type: 'bar' | 'line' | 'scatter' | 'histogram' | 'heatmap';
  xAxis: string;
  yAxis?: string;
  description: string;
  options?: any;
}

export interface ClientWorkspace {
  id: string;
  name: string;
  ownerId: string;
  members: string[];
  membersDetails?: {
    id: string;
    fullName: string;
    username: string;
    role: string;
  }[];
  createdDate: string;
}

export interface ClientNotification {
  id: string;
  userId: string;
  type: 'dataset_upload' | 'report_generation' | 'workspace_invite' | 'dashboard_share' | 'user_activity';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ClientActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  activityType: string;
  description: string;
}
