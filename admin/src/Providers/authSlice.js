import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  authToken: localStorage.getItem('authToken') || null,  
  isAuthenticated: !!localStorage.getItem('authToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {

      state.authToken = action.payload.authToken;
      state.useremail = action.payload.useremail;
      state.isAuthenticated = true;
      localStorage.setItem('authToken', action.payload.authToken);
      localStorage.setItem('useremail', action.payload.useremail);
      
    },
    logout: (state) => {
      state.authToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('useremail');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
