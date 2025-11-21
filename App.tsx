import React, { useEffect, useState, useRef } from "react";
import { Employee, NewEmployee } from "./types";
import {
  getEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployee,
  login,
} from "./services/employeeService";
import { RetroWindow } from "./components/RetroWindow";
import { RetroButton } from "./components/RetroButton";
import { RetroInput } from "./components/RetroInput";

// Helper component to handle the non-standard marquee tag without TS errors
const Marquee: React.FC<
  React.HTMLAttributes<HTMLElement> & { scrollamount?: string }
> = ({ children, ...props }) => {
  return React.createElement("marquee", { ...props } as any, children);
};

const App: React.FC = () => {
  // -- Login State --
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginCreds, setLoginCreds] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // -- App State --
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Replaced Help state with About state
  const [showAbout, setShowAbout] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for Adding
  const [formData, setFormData] = useState<NewEmployee>({
    name: "",
    jobTitle: "",
    department: "",
    dateHired: "",
    photo: "",
  });

  // State for Editing
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const loadData = async () => {
    setLoading(true);
    setServerError("");
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to load employees", error);
      setServerError("Connection failed. Ensure 'node server.js' is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Pre-load data even if not logged in (local app)
    loadData();
  }, []);

  // -- Login Handlers --

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      await login(loginCreds.username, loginCreds.password);
      setIsAuthenticated(true);
    } catch (err: any) {
      setLoginError(err.message || "Login failed");
      setLoginCreds((prev) => ({ ...prev, password: "" }));
    } finally {
      setIsLoggingIn(false);
    }
  };

  // -- File Handling --

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert("File too large! Max 500KB.");
        e.target.value = "";
        return;
      }
      const base64 = await convertFileToBase64(file);
      setFormData((prev) => ({ ...prev, photo: base64 }));
    }
  };

  const handleEditFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && editingEmployee) {
      if (file.size > 500 * 1024) {
        alert("File too large! Max 500KB.");
        e.target.value = "";
        return;
      }
      const base64 = await convertFileToBase64(file);
      setEditingEmployee({ ...editingEmployee, photo: base64 });
    }
  };

  // -- Add Handlers --

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.jobTitle) return;

    setLoading(true);
    setServerError("");
    try {
      await addEmployee(formData);
      setFormData({
        name: "",
        jobTitle: "",
        department: "",
        dateHired: "",
        photo: "",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadData();
    } catch (error) {
      console.error("Failed to add employee", error);
      setServerError("Failed to save. Server may be offline.");
    } finally {
      setLoading(false);
    }
  };

  // -- Delete Handler --

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    // Prevent event bubbling just in case
    e.stopPropagation();

    if (
      !window.confirm(
        "WARNING: This action will permanently delete the employee record. Continue?"
      )
    )
      return;

    setLoading(true);
    try {
      await deleteEmployee(id);
      await loadData();
    } catch (error) {
      console.error("Failed to delete employee", error);
      setServerError("Delete failed. Server offline?");
    } finally {
      setLoading(false);
    }
  };

  // -- Edit Handlers --

  const handleEditClick = (emp: Employee) => {
    setEditingEmployee(emp);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingEmployee) return;
    const { name, value } = e.target;
    setEditingEmployee({ ...editingEmployee, [name]: value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    setLoading(true);
    try {
      await updateEmployee(editingEmployee);
      setEditingEmployee(null);
      await loadData();
    } catch (error) {
      console.error("Failed to update employee", error);
      setServerError("Update failed. Server offline?");
    } finally {
      setLoading(false);
    }
  };

  // -- Render Login Screen --
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center">
        <RetroWindow
          title="Welcome to Windows"
          className="w-full max-w-md shadow-2xl"
        >
          <div className="flex flex-col md:flex-row gap-6 p-2">
            {/* Icon Column */}
            <div className="hidden md:flex flex-col items-center justify-start pt-2 w-24">
              <div className="text-6xl mb-2">🔑</div>
            </div>

            {/* Form Column */}
            <div className="flex-1">
              <p className="mb-4 text-sm font-sans text-black">
                Type a user name and password to log on to RetroSys.
              </p>
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                  <label className="block mb-1 font-sans text-sm text-black">
                    User name:
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white text-black border-t-2 border-l-2 border-black border-b-2 border-r-2 border-white px-1 py-0.5 font-sans focus:outline-none"
                    value={loginCreds.username}
                    onChange={(e) =>
                      setLoginCreds({ ...loginCreds, username: e.target.value })
                    }
                    autoFocus
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-sans text-sm text-black">
                    Password:
                  </label>
                  <input
                    type="password"
                    className="w-full bg-white text-black border-t-2 border-l-2 border-black border-b-2 border-r-2 border-white px-1 py-0.5 font-sans focus:outline-none"
                    value={loginCreds.password}
                    onChange={(e) =>
                      setLoginCreds({ ...loginCreds, password: e.target.value })
                    }
                  />
                </div>

                {loginError && (
                  <div className="mb-4 bg-red-100 text-red-600 border border-red-600 p-1 text-xs font-bold text-center">
                    {loginError}
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-6">
                  <RetroButton
                    type="submit"
                    disabled={isLoggingIn}
                    className="px-6 min-w-[80px]"
                  >
                    {isLoggingIn ? "..." : "OK"}
                  </RetroButton>
                  <RetroButton
                    type="button"
                    onClick={() =>
                      setLoginCreds({ username: "", password: "" })
                    }
                    className="px-6 min-w-[80px]"
                  >
                    Cancel
                  </RetroButton>
                </div>
              </form>
            </div>
          </div>
        </RetroWindow>
      </div>
    );
  }

  // -- Render Main App --
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      {/* Main Window - Increased Width */}
      <RetroWindow
        title="Personnel Management System v1.0"
        className="w-full max-w-6xl mb-8"
      >
        {/* Window Menu Bar - Simplified */}
        <div className="flex gap-4 px-2 py-1 text-sm font-sans mb-2 border-b border-gray-400">
          <button
            onClick={() => setShowAbout(true)}
            className="cursor-pointer hover:bg-win-blue hover:text-white px-2 py-0.5 bg-transparent border-none text-black text-sm font-sans text-left focus:outline-none"
          >
            <span className="underline">A</span>bout
          </button>
        </div>

        {/* Header Marquee */}
        <div className="bg-black text-green-400 font-mono text-lg p-3 mb-6 border-2 border-inset border-gray-500">
          <Marquee scrollamount="5">
            *** WELCOME TO THE PERSONNEL MANAGEMENT SYSTEM *** AUTHORIZED
            PERSONNEL ONLY *** DO NOT TURN OFF COMPUTER WHILE SAVING ***
          </Marquee>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Add Form */}
          <div className="md:col-span-1">
            <fieldset className="border-2 border-white border-l-gray-500 border-t-gray-500 p-4 h-full">
              <legend className="px-2 font-bold mb-2 text-lg">New Entry</legend>
              <form onSubmit={handleSubmit}>
                <RetroInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="text-lg p-2"
                  required
                />
                <RetroInput
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="Junior Associate"
                  className="text-lg p-2"
                  required
                />
                <RetroInput
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Sales"
                  className="text-lg p-2"
                  required
                />
                <RetroInput
                  label="Date Hired"
                  name="dateHired"
                  type="date"
                  value={formData.dateHired}
                  onChange={handleInputChange}
                  className="text-lg p-2"
                  required
                />

                <div className="flex flex-col mb-4">
                  <label className="mb-1 text-black font-serif font-bold">
                    Photo ID:
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-sm font-mono"
                  />
                </div>

                <div className="mt-8 flex justify-end">
                  <RetroButton
                    type="submit"
                    disabled={loading}
                    className="text-lg px-6 py-2"
                  >
                    {loading ? "Working..." : "Add Record"}
                  </RetroButton>
                </div>
              </form>
            </fieldset>
          </div>

          {/* Right Column: Data Table */}
          <div className="md:col-span-2 min-w-0">
            <fieldset className="border-2 border-white border-l-gray-500 border-t-gray-500 p-4 h-full flex flex-col min-w-0">
              <legend className="px-2 font-bold mb-2 text-lg">
                Employee Directory
              </legend>

              {/* Fixed Height Container for Scroll - RESTORED */}
              <div className="w-full h-[500px] overflow-auto border-2 border-gray-400 bg-white relative shadow-inset">
                {loading && employees.length === 0 && !serverError && (
                  <div className="text-center py-20 font-mono text-xl animate-pulse">
                    Accessing Database...
                  </div>
                )}

                {serverError && (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <div className="bg-red-100 border-2 border-red-600 p-4 text-center shadow-xl max-w-md">
                      <h3 className="text-red-600 font-bold text-xl mb-2">
                        CRITICAL ERROR
                      </h3>
                      <p className="text-black font-mono mb-4">{serverError}</p>
                      <p className="text-sm text-gray-600 font-sans">
                        Please ensure MongoDB is running and executing 'node
                        server.js' in your terminal.
                      </p>
                    </div>
                  </div>
                )}

                {!loading && !serverError && (
                  <table className="w-full border-collapse bg-white min-w-[600px]">
                    <thead className="bg-win-gray text-black sticky top-0 z-10 outline outline-1 outline-black">
                      <tr>
                        <th className="border border-black px-4 py-2 text-left text-lg w-10 whitespace-nowrap shadow-outset">
                          ID
                        </th>
                        <th className="border border-black px-4 py-2 text-left text-lg whitespace-nowrap shadow-outset">
                          Name
                        </th>
                        <th className="border border-black px-4 py-2 text-left text-lg whitespace-nowrap shadow-outset">
                          Title
                        </th>
                        <th className="border border-black px-4 py-2 text-left text-lg whitespace-nowrap shadow-outset">
                          Dept
                        </th>
                        <th className="border border-black px-4 py-2 text-left text-lg whitespace-nowrap shadow-outset">
                          Hired
                        </th>
                        <th className="border border-black px-4 py-2 text-center text-lg whitespace-nowrap shadow-outset">
                          Cmd
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-serif">
                      {employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-blue-100 group">
                          <td className="border border-gray-400 px-4 py-2 text-lg text-center whitespace-nowrap">
                            {emp.photo && <span title="Photo on file">📸</span>}
                          </td>
                          <td className="border border-gray-400 px-4 py-2 text-lg text-black whitespace-nowrap">
                            <button
                              onClick={() => handleEditClick(emp)}
                              className="text-blue-800 underline hover:text-red-600 focus:outline-none font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                              title="Click to edit details"
                            >
                              {emp.name}
                            </button>
                          </td>
                          <td className="border border-gray-400 px-4 py-2 text-lg text-black whitespace-nowrap">
                            {emp.jobTitle}
                          </td>
                          <td className="border border-gray-400 px-4 py-2 text-lg text-black whitespace-nowrap">
                            {emp.department}
                          </td>
                          <td className="border border-gray-400 px-4 py-2 text-lg text-black whitespace-nowrap">
                            {emp.dateHired}
                          </td>
                          <td className="border border-gray-400 px-4 py-2 text-center whitespace-nowrap">
                            <RetroButton
                              onClick={(e) => handleDelete(emp.id, e)}
                              className="bg-red-100 text-red-900 font-bold border-red-900 active:bg-red-200"
                              title="Terminate Employment"
                            >
                              DELETE
                            </RetroButton>
                          </td>
                        </tr>
                      ))}
                      {employees.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-10 text-gray-500 italic text-lg"
                          >
                            No records found in database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </fieldset>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-400 pt-3 flex justify-between text-sm font-mono text-gray-600">
          <span>
            Status:{" "}
            {loading ? "Reading/Writing..." : serverError ? "Offline" : "Ready"}
          </span>
          <div className="flex gap-4">
            <span>User: {loginCreds.username}</span>
            <span>Mem: 640KB OK</span>
          </div>
        </div>
      </RetroWindow>

      <div className="text-white font-mono text-sm mt-6 opacity-70 text-center">
        <p>© 1995 RetroSys Corp. All Rights Reserved.</p>
        <p>Best viewed in Netscape Navigator 2.0 at 1024x768 resolution.</p>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <RetroWindow
            title="About Retro Personnel Manager"
            className="w-full max-w-md shadow-2xl"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="text-5xl mb-4">💾</div>
              <h2 className="text-xl font-bold font-sans mb-2">
                Retro Personnel Manager
              </h2>
              <p className="font-mono text-sm mb-4">Version 1.0 (Build 1995)</p>

              <div className="w-full border-t border-gray-500 border-b border-white h-px my-2"></div>

              <p className="text-sm font-sans mb-4 mt-4">
                This product is licensed to:
                <br />
                <strong>Authorized User</strong>
                <br />
                RetroSys Corp.
              </p>

              <p className="text-xs font-sans text-gray-600 mb-6">
                Warning: This computer program is protected by copyright law and
                international treaties. Unauthorized reproduction or
                distribution of this program may result in severe civil and
                criminal penalties.
              </p>

              <div className="w-full flex justify-center">
                <RetroButton
                  onClick={() => setShowAbout(false)}
                  className="px-8"
                >
                  OK
                </RetroButton>
              </div>
            </div>
          </RetroWindow>
        </div>
      )}

      {/* Edit Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <RetroWindow
            title={`Details: ${editingEmployee.name}`}
            className="w-full max-w-5xl shadow-2xl"
          >
            <div className="p-4">
              <div className="flex items-center gap-4 mb-6 bg-yellow-100 border border-black p-2 shadow-inset">
                <div className="text-3xl">⚠</div>
                <div className="text-sm font-bold font-sans">
                  Authorized Access Only. Verify all data before saving changes
                  to the permanent record.
                </div>
              </div>

              <form
                onSubmit={handleEditSubmit}
                className="flex flex-col md:flex-row gap-6"
              >
                {/* Column 1: Photo */}
                <div className="md:w-1/4 flex flex-col items-center border-r-2 border-gray-400 pr-4">
                  <div className="w-40 h-40 bg-white border-2 border-gray-600 border-inset mb-4 flex items-center justify-center overflow-hidden relative">
                    {editingEmployee.photo ? (
                      <img
                        src={editingEmployee.photo}
                        alt={editingEmployee.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400 font-mono text-sm">
                        NO PHOTO
                        <br />
                        AVAILABLE
                      </div>
                    )}
                  </div>
                  <label className="block w-full">
                    <span className="block font-bold mb-1 text-xs text-center">
                      Update Photo:
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileChange}
                      className="w-full text-xs font-mono"
                    />
                  </label>
                </div>

                {/* Column 2: Employment Data */}
                <div className="md:w-1/3">
                  <fieldset className="border border-gray-500 p-3 h-full">
                    <legend className="text-sm font-bold px-1">
                      Employment Data
                    </legend>
                    <div className="grid grid-cols-1 gap-2">
                      <RetroInput
                        label="Full Name"
                        name="name"
                        value={editingEmployee.name}
                        onChange={handleEditChange}
                        className="w-full text-sm p-1"
                        required
                      />
                      <RetroInput
                        label="Job Title"
                        name="jobTitle"
                        value={editingEmployee.jobTitle}
                        onChange={handleEditChange}
                        className="w-full text-sm p-1"
                        required
                      />
                      <RetroInput
                        label="Department"
                        name="department"
                        value={editingEmployee.department}
                        onChange={handleEditChange}
                        className="w-full text-sm p-1"
                        required
                      />
                      <RetroInput
                        label="Date Hired"
                        name="dateHired"
                        type="date"
                        value={editingEmployee.dateHired}
                        onChange={handleEditChange}
                        className="w-full text-sm p-1"
                        required
                      />
                    </div>
                  </fieldset>
                </div>

                {/* Column 3: Contact Info (New) */}
                <div className="md:w-1/3">
                  <fieldset className="border border-gray-500 p-3 h-full">
                    <legend className="text-sm font-bold px-1">
                      Contact Information
                    </legend>
                    <div className="grid grid-cols-1 gap-2">
                      <RetroInput
                        label="Email"
                        name="email"
                        type="email"
                        value={editingEmployee.email || ""}
                        onChange={handleEditChange}
                        className="w-full text-sm p-1"
                        placeholder="user@company.com"
                      />
                      <RetroInput
                        label="Phone"
                        name="phone"
                        value={editingEmployee.phone || ""}
                        onChange={handleEditChange}
                        className="w-full text-sm p-1"
                        placeholder="(555) 123-4567"
                      />
                      <RetroInput
                        label="Address"
                        name="address"
                        value={editingEmployee.address || ""}
                        onChange={handleEditChange}
                        className="w-full text-sm p-1"
                        placeholder="123 Main St"
                      />
                      <div className="flex gap-2">
                        <div className="w-1/2">
                          <RetroInput
                            label="City"
                            name="city"
                            value={editingEmployee.city || ""}
                            onChange={handleEditChange}
                            className="w-full text-sm p-1"
                          />
                        </div>
                        <div className="w-1/2">
                          <RetroInput
                            label="State/Zip"
                            name="state"
                            value={editingEmployee.state || ""}
                            onChange={handleEditChange}
                            className="w-full text-sm p-1"
                            placeholder="TX 75001"
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </form>

              <div className="mt-6 flex justify-end gap-4 border-t border-gray-400 pt-4">
                <RetroButton
                  onClick={() => setEditingEmployee(null)}
                  className="px-6 py-2 text-lg"
                >
                  Cancel
                </RetroButton>
                <RetroButton
                  onClick={handleEditSubmit}
                  disabled={loading}
                  className="px-6 py-2 text-lg font-bold"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </RetroButton>
              </div>
            </div>
          </RetroWindow>
        </div>
      )}
    </div>
  );
};

export default App;
