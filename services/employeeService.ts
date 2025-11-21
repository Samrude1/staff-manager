import { Employee, NewEmployee } from "../types";

const API_BASE = "http://localhost:5000/api";
const EMPLOYEES_URL = `${API_BASE}/employees`;

export const login = async (
  username: string,
  password: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Login failed");
    }

    return true;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await fetch(EMPLOYEES_URL);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Connection error:", error);
    throw error;
  }
};

export const addEmployee = async (employee: NewEmployee): Promise<Employee> => {
  const response = await fetch(EMPLOYEES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
  if (!response.ok) throw new Error("Failed to add employee");
  return response.json();
};

export const updateEmployee = async (
  updatedEmployee: Employee
): Promise<void> => {
  const response = await fetch(`${EMPLOYEES_URL}/${updatedEmployee.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedEmployee),
  });
  if (!response.ok) throw new Error("Failed to update employee");
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const response = await fetch(`${EMPLOYEES_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete employee");
};
