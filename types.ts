export interface Employee {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  dateHired: string;
  photo?: string; // Base64 encoded image string
  // Extended Information
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export type NewEmployee = Omit<Employee, "id">;
