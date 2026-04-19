import { ROLES } from '../context/AuthContext.jsx'

export const TEAM = [
  { id: 't1', name: 'Aarav Gupta',  role: ROLES.OWNER,   email: 'aarav@chulha.in',   phone: '+91 98000 10001', active: true },
  { id: 't2', name: 'Lakshmi Devi', role: ROLES.KITCHEN, email: 'lakshmi@chulha.in', phone: '+91 98000 10002', active: true },
  { id: 't3', name: 'Ravi Kumar',   role: ROLES.KITCHEN, email: 'ravi@chulha.in',    phone: '+91 98000 10003', active: true },
  { id: 't4', name: 'Suresh K.',    role: ROLES.RIDER,   email: 'suresh@chulha.in',  phone: '+91 98000 10004', active: true },
  { id: 't5', name: 'Manoj P.',     role: ROLES.RIDER,   email: 'manoj@chulha.in',   phone: '+91 98000 10005', active: true },
  { id: 't6', name: 'Divya R.',     role: ROLES.SUPPORT, email: 'divya@chulha.in',   phone: '+91 98000 10006', active: false },
]
