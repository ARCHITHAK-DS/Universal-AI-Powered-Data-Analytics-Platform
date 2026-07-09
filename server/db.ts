import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Define the required physical storage directories
const STORAGE_DIRS = ['uploads', 'reports', 'profiles', 'exports', 'reports/admin-reports'];

for (const dir of STORAGE_DIRS) {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created workspace folder: ${dir}`);
  }
}

// Database Interfaces
export interface User {
  id: string; // User ID
  fullName: string;
  email: string;
  username: string;
  passwordHash: string;
  role: 'Admin' | 'Analyst' | 'Viewer';
  profilePicture: string; // URL or local path
  createdDate: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
}

export interface LoginHistory {
  id: string; // Login ID
  userId: string;
  loginTime: string;
  logoutTime: string | null;
  deviceInfo: string;
  browserInfo: string;
}

export interface Dataset {
  id: string; // Dataset ID
  userId: string;
  datasetName: string;
  datasetType: string; // e.g. CSV, Excel
  filePath: string;
  fileSize: number; // in bytes
  uploadDate: string;
  status: 'active' | 'archived' | 'processing';
  version: number;
}

export interface Project {
  id: string; // Project ID
  userId: string;
  projectName: string;
  datasetId: string;
  createdDate: string;
  lastModified: string;
  rawRows?: any[]; // Saved state
  cleanRows?: any[];
  datasetInfo?: any;
  stats?: any;
  correlationMatrix?: any;
  qualityReport?: any;
}

export interface TeamWorkspace {
  id: string; // Workspace ID
  name: string;
  ownerId: string;
  members: string[]; // User IDs of members
  createdDate: string;
}

export interface SharedDashboard {
  id: string; // Share ID
  dashboardId: string; // Can be datasetId or projectId
  shareToken: string;
  shareUrl: string;
  expiryDate: string | null; // Expiry date or null
  accessPermissions: 'view' | 'edit';
  createdDate: string;
}

// Define DB Model container
export interface Notification {
  id: string;
  userId: string;
  type: 'dataset_upload' | 'report_generation' | 'workspace_invite' | 'dashboard_share' | 'user_activity';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  activityType: string;
  description: string;
}

export interface AdminReport {
  id: string;
  name: string;
  generatedBy: string; // User ID
  generatedByName: string; // User full name
  generatedDate: string;
  fileType: 'pdf' | 'xlsx' | 'csv';
  filePath: string;
  downloadLink: string;
  fileSize: number; // in bytes
}

interface DatabaseSchema {
  users: User[];
  loginHistory: LoginHistory[];
  datasets: Dataset[];
  projects: Project[];
  teamWorkspaces: TeamWorkspace[];
  sharedDashboards: SharedDashboard[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
  adminReports?: AdminReport[]; // Optional fallback
}

const DB_FILE_PATH = path.join(process.cwd(), 'database-store.json');

class RelationalDB {
  private data: DatabaseSchema;

  constructor() {
    this.data = {
      users: [],
      loginHistory: [],
      datasets: [],
      projects: [],
      teamWorkspaces: [],
      sharedDashboards: [],
      notifications: [],
      activityLogs: [],
      adminReports: [],
    };
    this.load();
    this.seedDefaultAdmin();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
        // Ensure all required collections are initialized
        this.data.users = (this.data.users || []).map(u => ({ ...u, status: u.status || 'Active' }));
        this.data.loginHistory = this.data.loginHistory || [];
        this.data.datasets = this.data.datasets || [];
        this.data.projects = this.data.projects || [];
        this.data.teamWorkspaces = this.data.teamWorkspaces || [];
        this.data.sharedDashboards = this.data.sharedDashboards || [];
        this.data.notifications = this.data.notifications || [];
        this.data.activityLogs = this.data.activityLogs || [];
        this.data.adminReports = this.data.adminReports || [];
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Failed to load database. Initializing empty database.', err);
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database changes.', err);
    }
  }

  private seedDefaultAdmin() {
    // 1. Clean up outdated default users
    this.data.users = this.data.users.filter(u => u.email !== 'admin@analytics.platform');

    // 2. Ensure Admin account exists
    let adminUser = this.data.users.find(u => u.username === 'admin');
    const adminSalt = bcrypt.genSaltSync(10);
    const adminHash = bcrypt.hashSync('admin@123', adminSalt);
    if (!adminUser) {
      adminUser = {
        id: 'user_admin',
        fullName: 'Global System Admin',
        email: 'admin123@gmail.com',
        username: 'admin',
        passwordHash: adminHash,
        role: 'Admin',
        profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        createdDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        status: 'Active'
      };
      this.data.users.push(adminUser);
    } else {
      adminUser.email = 'admin123@gmail.com';
      adminUser.passwordHash = adminHash;
      adminUser.role = 'Admin';
      adminUser.status = 'Active';
    }

    // 3. Ensure Analyst account exists
    let analystUser = this.data.users.find(u => u.username === 'archu');
    const analystSalt = bcrypt.genSaltSync(10);
    const analystHash = bcrypt.hashSync('Archu123!', analystSalt);
    if (!analystUser) {
      analystUser = {
        id: 'user_archu',
        fullName: 'Architha',
        email: 'architha.k11@gmail.com',
        username: 'archu',
        passwordHash: analystHash,
        role: 'Analyst',
        profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        createdDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        status: 'Active'
      };
      this.data.users.push(analystUser);
    } else {
      analystUser.fullName = 'Architha';
      analystUser.email = 'architha.k11@gmail.com';
      analystUser.passwordHash = analystHash;
      analystUser.role = 'Analyst';
      analystUser.status = 'Active';
    }

    // 4. Ensure default Team Workspace is populated correctly
    let workspace = this.data.teamWorkspaces.find(w => w.id === 'workspace_global');
    if (!workspace) {
      workspace = {
        id: 'workspace_global',
        name: 'Global Team Analytics',
        ownerId: 'user_admin',
        members: ['user_admin', 'user_archu'],
        createdDate: new Date().toISOString()
      };
      this.data.teamWorkspaces.push(workspace);
    } else {
      if (!workspace.members.includes('user_admin')) {
        workspace.members.push('user_admin');
      }
      if (!workspace.members.includes('user_archu')) {
        workspace.members.push('user_archu');
      }
    }

    this.save();
    console.log('Seeded default credentials successfully.');
  }

  // --- USERS SECTION ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getUserByUsernameOrEmail(identifier: string): User | undefined {
    const cleanId = identifier.trim().toLowerCase();
    return this.data.users.find(
      (u) => u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
    );
  }

  public createUser(user: Omit<User, 'id' | 'passwordHash' | 'createdDate' | 'lastLogin' | 'status'>, passwordPlain: string): User {
    // Password strength check
    if (!this.validatePasswordStrength(passwordPlain)) {
      throw new Error('Password does not satisfy visual strength requirements.');
    }

    // Check duplicate username
    const existingUsername = this.data.users.find(
      (u) => u.username.toLowerCase() === user.username.trim().toLowerCase()
    );
    if (existingUsername) {
      throw new Error('Username is already taken.');
    }

    // Check duplicate email
    const existingEmail = this.data.users.find(
      (u) => u.email.toLowerCase() === user.email.trim().toLowerCase()
    );
    if (existingEmail) {
      throw new Error('Email address is already registered.');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(passwordPlain, salt);

    const newUser: User = {
      ...user,
      id: `user_${Math.random().toString(36).substring(2, 11)}`,
      passwordHash,
      createdDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'Active',
    };

    this.data.users.push(newUser);
    
    // Automatically add to global workspace
    const globalWs = this.data.teamWorkspaces.find(w => w.id === 'workspace_global');
    if (globalWs && !globalWs.members.includes(newUser.id)) {
      globalWs.members.push(newUser.id);
    }

    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<Omit<User, 'id' | 'passwordHash'>>): User {
    const userIndex = this.data.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found.');
    }

    const user = this.data.users[userIndex];
    
    // If username changes, check for unique constraints
    if (updates.username && updates.username.toLowerCase() !== user.username.toLowerCase()) {
      const exists = this.data.users.find((u) => u.username.toLowerCase() === updates.username?.toLowerCase() && u.id !== id);
      if (exists) throw new Error('Username is already taken.');
    }

    // If email changes, check for unique constraints
    if (updates.email && updates.email.toLowerCase() !== user.email.toLowerCase()) {
      const exists = this.data.users.find((u) => u.email.toLowerCase() === updates.email?.toLowerCase() && u.id !== id);
      if (exists) throw new Error('Email address is already in use.');
    }

    const updatedUser = { ...user, ...updates };
    this.data.users[userIndex] = updatedUser;
    this.save();
    return updatedUser;
  }

  public updateUserPassword(id: string, passwordPlain: string) {
    const userIndex = this.data.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found.');
    }

    if (!this.validatePasswordStrength(passwordPlain)) {
      throw new Error('Password does not satisfy physical complexity criteria.');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(passwordPlain, salt);
    this.data.users[userIndex].passwordHash = passwordHash;
    this.save();
  }

  public deleteUser(id: string) {
    this.data.users = this.data.users.filter((u) => u.id !== id);
    this.save();
  }

  public validatePasswordStrength(pwd: string): boolean {
    if (pwd.length < 8) return false;
    if (!/[A-Z]/.test(pwd)) return false;
    if (!/[a-z]/.test(pwd)) return false;
    if (!/[0-9]/.test(pwd)) return false;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return false;
    return true;
  }

  // --- LOGIN HISTORY SECTION ---
  public logLogin(userId: string, deviceInfo: string, browserInfo: string): string {
    const id = `login_${Math.random().toString(36).substring(2, 11)}`;
    const historyEntry: LoginHistory = {
      id,
      userId,
      loginTime: new Date().toISOString(),
      logoutTime: null,
      deviceInfo,
      browserInfo
    };
    this.data.loginHistory.push(historyEntry);
    
    // Update users last login
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      user.lastLogin = historyEntry.loginTime;
    }

    this.save();
    return id;
  }

  public logLogout(loginId: string) {
    const entry = this.data.loginHistory.find((l) => l.id === loginId);
    if (entry) {
      entry.logoutTime = new Date().toISOString();
      this.save();
    }
  }

  public getHistoryByUser(userId: string): LoginHistory[] {
    return this.data.loginHistory.filter((lh) => lh.userId === userId);
  }

  public getAllLoginHistory(): LoginHistory[] {
    return this.data.loginHistory;
  }

  // --- DATASETS SECTION ---
  public getDatasets(): Dataset[] {
    return this.data.datasets;
  }

  public getDatasetsByUser(userId: string): Dataset[] {
    return this.data.datasets.filter((d) => d.userId === userId);
  }

  public getDatasetById(id: string): Dataset | undefined {
    return this.data.datasets.find((d) => d.id === id);
  }

  public createDataset(dataset: Omit<Dataset, 'id' | 'uploadDate' | 'version'>): Dataset {
    const id = `dataset_${Math.random().toString(36).substring(2, 11)}`;
    
    // Check if there is an existing dataset with same name for user - if so, auto-increment version
    const existing = this.data.datasets
      .filter((d) => d.userId === dataset.userId && d.datasetName.toLowerCase() === dataset.datasetName.toLowerCase())
      .sort((a,b) => b.version - a.version);

    const version = existing.length > 0 ? existing[0].version + 1 : 1;

    const newDataset: Dataset = {
      ...dataset,
      id,
      uploadDate: new Date().toISOString(),
      version
    };

    this.data.datasets.push(newDataset);
    this.save();
    return newDataset;
  }

  public deleteDataset(id: string) {
    const dataset = this.getDatasetById(id);
    if (dataset && fs.existsSync(dataset.filePath)) {
      try {
        fs.unlinkSync(dataset.filePath); // physical delete
      } catch (err) {
        console.error('File unlink error:', err);
      }
    }
    this.data.datasets = this.data.datasets.filter((d) => d.id !== id);
    this.save();
  }

  // --- PROJECTS SECTION ---
  public getProjectsByUser(userId: string): Project[] {
    return this.data.projects.filter((p) => p.userId === userId);
  }

  public getProjectById(id: string): Project | undefined {
    return this.data.projects.find((p) => p.id === id);
  }

  public createProject(project: Omit<Project, 'id' | 'createdDate' | 'lastModified'>): Project {
    const id = `project_${Math.random().toString(36).substring(2, 11)}`;
    const newProject: Project = {
      ...project,
      id,
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    this.data.projects.push(newProject);
    this.save();
    return newProject;
  }

  public updateProject(id: string, updates: Partial<Project>): Project {
    const index = this.data.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Project not found.');
    }
    const updated = {
      ...this.data.projects[index],
      ...updates,
      lastModified: new Date().toISOString(),
    };
    this.data.projects[index] = updated;
    this.save();
    return updated;
  }

  public deleteProject(id: string) {
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    this.save();
  }

  // --- WORKSPACES SECTION ---
  public getWorkspaces(): TeamWorkspace[] {
    return this.data.teamWorkspaces;
  }

  public getWorkspacesByUser(userId: string): TeamWorkspace[] {
    return this.data.teamWorkspaces.filter((w) => w.members.includes(userId) || w.ownerId === userId);
  }

  public getWorkspaceById(id: string): TeamWorkspace | undefined {
    return this.data.teamWorkspaces.find((w) => w.id === id);
  }

  public createWorkspace(name: string, ownerId: string): TeamWorkspace {
    const id = `workspace_${Math.random().toString(36).substring(2, 11)}`;
    const ws: TeamWorkspace = {
      id,
      name,
      ownerId,
      members: [ownerId],
      createdDate: new Date().toISOString()
    };
    this.data.teamWorkspaces.push(ws);
    this.save();
    return ws;
  }

  public addWorkspaceMember(workspaceId: string, memberId: string) {
    const ws = this.data.teamWorkspaces.find(w => w.id === workspaceId);
    if (ws && !ws.members.includes(memberId)) {
      ws.members.push(memberId);
      this.save();
    }
  }

  public removeWorkspaceMember(workspaceId: string, memberId: string) {
    const ws = this.data.teamWorkspaces.find(w => w.id === workspaceId);
    if (ws) {
      ws.members = ws.members.filter(m => m !== memberId);
      this.save();
    }
  }

  // --- SHARED DASHBOARDS SECTION ---
  public getShares(): SharedDashboard[] {
    return this.data.sharedDashboards;
  }

  public getShareByToken(token: string): SharedDashboard | undefined {
    return this.data.sharedDashboards.find(s => s.shareToken === token);
  }

  public createShare(dashboardId: string, accessPermissions: 'view' | 'edit', expiryDays: number | null): SharedDashboard {
    const id = `share_${Math.random().toString(36).substring(2, 11)}`;
    const shareToken = `token_${Math.random().toString(36).substring(2, 15)}`;
    
    let expiryDate: string | null = null;
    if (expiryDays !== null) {
      const exp = new Date();
      exp.setDate(exp.getDate() + expiryDays);
      expiryDate = exp.toISOString();
    }

    const shareUrl = `/shared/${shareToken}`;

    const newShare: SharedDashboard = {
      id,
      dashboardId,
      shareToken,
      shareUrl,
      expiryDate,
      accessPermissions,
      createdDate: new Date().toISOString(),
    };

    this.data.sharedDashboards.push(newShare);
    this.save();
    return newShare;
  }

  public deleteShare(id: string) {
    this.data.sharedDashboards = this.data.sharedDashboards.filter(s => s.id !== id);
    this.save();
  }

  // --- NOTIFICATIONS SECTION ---
  public getNotificationsByUser(userId: string): Notification[] {
    return (this.data.notifications || []).filter(n => n.userId === userId);
  }

  public createNotification(userId: string, type: Notification['type'], title: string, message: string): Notification {
    if (!this.data.notifications) this.data.notifications = [];
    const newNotif: Notification = {
      id: `notif_${Math.random().toString(36).substring(2, 11)}`,
      userId,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    this.data.notifications.push(newNotif);
    this.save();
    return newNotif;
  }

  public markNotificationRead(id: string) {
    const notif = (this.data.notifications || []).find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
    }
  }

  public markAllNotificationsRead(userId: string) {
    (this.data.notifications || [])
      .filter(n => n.userId === userId)
      .forEach(n => { n.read = true; });
    this.save();
  }

  public deleteNotification(id: string) {
    this.data.notifications = (this.data.notifications || []).filter(n => n.id !== id);
    this.save();
  }

  // --- ACTIVITY LOGS SECTION ---
  public getAllActivityLogs(): ActivityLog[] {
    return this.data.activityLogs || [];
  }

  public createActivityLog(userId: string, activityType: string, description: string): ActivityLog {
    if (!this.data.activityLogs) this.data.activityLogs = [];
    const user = this.getUserById(userId);
    const username = user ? user.username : 'system';
    const newLog: ActivityLog = {
      id: `act_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: new Date().toISOString(),
      userId,
      username,
      activityType,
      description
    };
    this.data.activityLogs.push(newLog);
    this.save();
    return newLog;
  }

  // --- ADMIN REPORTS SECTION ---
  public getAdminReports(): AdminReport[] {
    return this.data.adminReports || [];
  }

  public createAdminReport(report: Omit<AdminReport, 'id' | 'generatedDate' | 'downloadLink'>): AdminReport {
    if (!this.data.adminReports) this.data.adminReports = [];
    const id = `rep_${Math.random().toString(36).substring(2, 11)}`;
    const newReport: AdminReport = {
      ...report,
      id,
      generatedDate: new Date().toISOString(),
      downloadLink: `/api/admin/reports/download/${id}`
    };
    this.data.adminReports.push(newReport);
    this.save();
    return newReport;
  }

  public deleteAdminReport(id: string) {
    const reports = this.getAdminReports();
    const rep = reports.find(r => r.id === id);
    if (rep && fs.existsSync(rep.filePath)) {
      try {
        fs.unlinkSync(rep.filePath);
      } catch (err) {
        console.error('Failed to physically delete report file', err);
      }
    }
    this.data.adminReports = reports.filter(r => r.id !== id);
    this.save();
  }
}

export const db = new RelationalDB();
