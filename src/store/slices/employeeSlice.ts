import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Employee {
  id: string;
  firstName: string;
  address: string;
}

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

// Mock API calls
const mockFetchEmployees = (): Promise<Employee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1234500001',
          firstName: 'กาญจนา สีทอง',
          address: '46/1 หมู่ 9 หมู่บ้านเมืองทอง พัฒนาการ66 แขวงประเวศ เขต ประเวศ กทม. 10800',
        },
        {
          id: '1234500002',
          firstName: 'ตะวัน สุขใจ',
          address: '46/2 หมู่ 9 หมู่บ้านเมืองทอง พัฒนาการ66 แขวงประเวศ เขต ประเวศ กทม. 10800',
        },
        {
          id: '1234500003',
          firstName: 'จิราพร เกียรตินิยม',
          address: '46/3 หมู่ 9 หมู่บ้านเมืองทอง พัฒนาการ66 แขวงประเวศ เขต ประเวศ กทม. 10800',
        },
        {
          id: '1234500004',
          firstName: 'มินตรา โชคชัย',
          address: '46/4 หมู่ 9 หมู่บ้านเมืองทอง พัฒนาการ66 แขวงประเวศ เขต ประเวศ กทม. 10800',
        },
      ]);
    }, 1000);
  });
};

const mockDeleteEmployee = (_id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

const mockCreateEmployee = (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = Date.now().toString();
      resolve({
        ...employee,
        id: newId,
      });
    }, 500);
  });
};

const mockUpdateEmployee = (employee: Employee): Promise<Employee> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(employee);
    }, 500);
  });
};

export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async () => {
    const response = await mockFetchEmployees();
    return response;
  }
);

export const deleteEmployee = createAsyncThunk(
  'employee/deleteEmployee',
  async (id: string) => {
    await mockDeleteEmployee(id);
    return id;
  }
);

export const createEmployee = createAsyncThunk(
  'employee/createEmployee',
  async (employee: Omit<Employee, 'id'>) => {
    const response = await mockCreateEmployee(employee);
    return response;
  }
);

export const updateEmployee = createAsyncThunk(
  'employee/updateEmployee',
  async (employee: Employee) => {
    const response = await mockUpdateEmployee(employee);
    return response;
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      });
  },
});

export default employeeSlice.reducer; 